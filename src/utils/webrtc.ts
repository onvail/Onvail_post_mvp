import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {db} from '../../firebaseConfig';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import tw from 'src/lib/tailwind';

const peerConstraints = {
  iceServers: [
    {urls: 'stun:stun.relay.metered.ca:80'},
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: 'e533aa44d48644f32fe8bcbb',
      credential: 'YFpowISujSKSY0AR',
    },
    {
      urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      username: 'e533aa44d48644f32fe8bcbb',
      credential: 'YFpowISujSKSY0AR',
    },
    {
      urls: 'turn:global.relay.metered.ca:443',
      username: 'e533aa44d48644f32fe8bcbb',
      credential: 'YFpowISujSKSY0AR',
    },
    {
      urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      username: 'e533aa44d48644f32fe8bcbb',
      credential: 'YFpowISujSKSY0AR',
    },
  ],
};

export let localStream: MediaStream | null = null;
export let remoteStream: MediaStream | null = null;
export let peerConnection: RTCPeerConnection | null = null;
export let isConnected = false;
export let callEnded = false;
export const iceCandidatesQueue: RTCIceCandidate[] = [];
export let callStarted = false;
export let isMuted = false;

let firestore = getFirestore();

export const setupMediaStream = async () => {
  try {
    const mediaConstraints = {audio: true, video: false};
    const stream = await mediaDevices.getUserMedia(mediaConstraints);
    localStream = stream;
    return stream;
  } catch (error) {
    console.error('Error accessing media devices in setupMediaStream:', error);
    return null;
  }
};
export const createPeerConnection = (partyId: string) => {
  console.log('Creating peer connection');
  const pc = new RTCPeerConnection(peerConstraints);

  pc.addEventListener('connectionstatechange', event => {
    console.log(event);
    console.log('Connection state changed:', pc.connectionState);
    switch (pc.connectionState) {
      case 'new':
        console.log('Connection state is new');
        break;
      case 'connecting':
        console.log('Connection state is connecting');
        break;
      case 'connected':
        console.log('Connection connected');
        isConnected = true;
        break;
      case 'disconnected':
        console.log('Connection state is disconnected');
        break;
      case 'failed':
        console.log('Connection state is failed');
        break;
      case 'closed':
        console.log('Connection state is closed');
        isConnected = false;
        break;
      default:
        console.log('Connection state is unknown:', pc.connectionState);
        break;
    }
  });

  pc.addEventListener('icecandidate', async event => {
    if (event.candidate) {
      try {
        const callDoc = doc(collection(firestore, 'calls'), partyId);
        await updateDoc(callDoc, {
          candidates: arrayUnion(event.candidate.toJSON()),
        });
        console.log('ICE candidate added:', event.candidate.toJSON());
      } catch (error) {
        console.error(
          'Error adding ICE candidate in createPeerConnection:',
          error,
        );
      }
    } else {
      console.log('All ICE candidates have been sent');
    }
  });

  pc.addEventListener('track', event => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
    }
    remoteStream.addTrack(event.track);
    console.log('Track event in createPeerConnection:', event.track);
  });

  pc.addEventListener('iceconnectionstatechange', () => {
    console.log('ICE connection state changed:', pc.iceConnectionState);
  });

  peerConnection = pc;
  return pc;
};

export const addIceCandidatesToPeerConnection = () => {
  console.log('Adding ICE candidates to peer connection');
  const pc = peerConnection;
  if (pc) {
    while (iceCandidatesQueue.length) {
      const candidate = iceCandidatesQueue.shift();
      pc.addIceCandidate(candidate).catch(error => {
        console.error(
          'Failed to add ICE candidate in addIceCandidatesToPeerConnection:',
          error,
        );
      });
    }
  } else {
    console.error(
      'PeerConnection is not ready to add ICE candidates in addIceCandidatesToPeerConnection.',
    );
  }
};

export const beginParty = async (partyId: string) => {
  console.log('Beginning party');
  try {
    const pc = createPeerConnection(partyId);
    const stream = await setupMediaStream();

    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      console.log('Local stream tracks added to peer connection in beginParty');
    }

    const callDoc = doc(collection(db, 'calls'), partyId);
    const offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
      voiceActivityDetection: true,
    };
    const offer = await pc.createOffer(offerOptions);
    await pc.setLocalDescription(offer);
    await setDoc(callDoc, {
      offer: offer,
      candidates: [],
      callStarted: true,
      callEnded: false,
    });
    console.log('Offer created and set in beginParty');

    const candidatesCollection = collection(callDoc, 'candidates');
    const unsubscribeCandidates = onSnapshot(candidatesCollection, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const candidate = new RTCIceCandidate(data);
          if (pc.remoteDescription) {
            pc.addIceCandidate(candidate)
              .then(() => {
                console.log('ICE candidate added successfully in beginParty');
              })
              .catch(error => {
                console.error(
                  'Failed to add ICE candidate on beginParty snapshot:',
                  error,
                );
              });
          } else {
            iceCandidatesQueue.push(candidate);
          }
        }
      });
    });

    const unsubscribeCallDoc = onSnapshot(callDoc, snapshot => {
      const data = snapshot.data();
      if (data?.callEnded) {
        callEnded = true;
        unsubscribeCallDoc(); // Unsubscribe from snapshot updates
        unsubscribeCandidates(); // Unsubscribe from ICE candidates updates
      }
      if (data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        if (pc.signalingState === 'stable') {
          pc.setRemoteDescription(answerDescription)
            .then(() => {
              console.log('Remote answer set successfully in beginParty');
              addIceCandidatesToPeerConnection();
            })
            .catch(error =>
              console.error(
                'Failed to set remote answer in beginParty:',
                error,
              ),
            );
        } else {
          console.warn(
            'PeerConnection is not in the correct state to set remote description in beginParty:',
            pc.signalingState,
          );
        }
      }
    });
  } catch (error) {
    console.error('Error in beginParty:', error);
  }
};

export const joinCall = async (partyId: string) => {
  console.log('Joining call');
  try {
    const callDoc = doc(collection(firestore, 'calls'), partyId);
    const callData = (await getDoc(callDoc)).data();

    if (callData?.callEnded) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Can't join party",
        textBody: 'The party has ended',
        titleStyle: tw`font-poppinsRegular text-xs`,
        textBodyStyle: tw`font-poppinsRegular text-xs`,
      });
      callEnded = true;
      return false;
    }

    if (!callData?.callStarted) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Can't join party yet",
        textBody: "Host hasn't started the party",
        titleStyle: tw`font-poppinsRegular text-xs`,
        textBodyStyle: tw`font-poppinsRegular text-xs`,
      });
      callStarted = false;
      return false;
    }

    callStarted = true;

    const pc = createPeerConnection(partyId);
    const stream = await setupMediaStream();

    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      console.log('Local stream tracks added to peer connection');
    }

    if (callData?.offer && pc.signalingState === 'have-local-offer') {
      const offerDescription = new RTCSessionDescription(callData.offer);
      await pc
        .setRemoteDescription(offerDescription)
        .then(() => {
          console.log('Remote description set successfully in joinCall');
          return pc.createAnswer();
        })
        .then(answerDescription => {
          return pc.setLocalDescription(answerDescription).then(() => {
            console.log('Local description set successfully in joinCall');
            updateDoc(callDoc, {answer: answerDescription});
            addIceCandidatesToPeerConnection();
          });
        })
        .catch(error =>
          console.error('Failed to set remote offer in joinCall:', error),
        );
    }

    onSnapshot(callDoc, snapshot => {
      const data = snapshot.data();
      if (data?.callEnded) {
        callEnded = true;
      }
      if (data?.candidates) {
        data.candidates.forEach((candidateData: any) => {
          const candidate = new RTCIceCandidate(candidateData);
          if (pc.remoteDescription) {
            pc.addIceCandidate(candidate)
              .then(() => {
                console.log('ICE candidate added successfully in joinCall');
              })
              .catch(error => {
                console.error(
                  'Failed to add ICE candidate in joinCall:',
                  peerConnection,
                  error,
                );
              });
          } else {
            iceCandidatesQueue.push(candidate);
          }
        });
      }
    });

    return true;
  } catch (error) {
    console.error('Error in joinCall:', error);
    return false;
  }
};

export const endCall = async (partyId: string) => {
  console.log('Ending call');
  try {
    const pc = peerConnection;
    if (pc) {
      pc.getTransceivers().forEach(transceiver => {
        transceiver.stop();
      });
      pc.close();
      peerConnection = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      localStream = null;
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.stop();
      });
      remoteStream = null;
    }

    const callDoc = doc(collection(firestore, 'calls'), partyId);
    await updateDoc(callDoc, {callEnded: true, callStarted: false});

    isConnected = false;
    callEnded = true;
  } catch (error) {
    console.error('Error in endCall:', error);
  }
};

export const leaveCall = async () => {
  console.log('Leaving call');
  try {
    const pc = peerConnection;
    if (pc) {
      pc.close();
      peerConnection = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      localStream = null;
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.stop();
      });
      remoteStream = null;
    }

    isConnected = false;
    callEnded = true;
  } catch (error) {
    console.error('Error in leaveCall:', error);
  }
};

export const microphoneHandler = async () => {
  console.log('Handling microphone');
  if (localStream) {
    try {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      isMuted = !isMuted;
    } catch (error) {
      console.error('Error in microphoneHandler:', error);
    }
  }
};
