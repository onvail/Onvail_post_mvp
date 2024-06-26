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
  iceCandidatePoolSize: 10,
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
    console.error('Error accessing media devices.', error);
    return null;
  }
};

export const createPeerConnection = (partyId: string) => {
  console.log('Creating peer connection');
  const pc = new RTCPeerConnection(peerConstraints);

  pc.addEventListener('connectionstatechange', () => {
    console.log('Connection state changed:', pc.connectionState);
    switch (pc.connectionState) {
      case 'closed':
        console.log('Connection ended');
        isConnected = false;
        break;
      case 'connected':
        console.log('Connection connected');
        isConnected = true;
        break;
      case 'disconnected':
      case 'failed':
        console.log('Connection disconnected or failed');
        isConnected = false;
        break;
      default:
        break;
    }
  });

  pc.addEventListener('icecandidate', async event => {
    if (event.candidate) {
      const callDoc = doc(collection(firestore, 'calls'), partyId);
      await updateDoc(callDoc, {
        candidates: arrayUnion(event.candidate.toJSON()),
      });
    }
  });

  pc.addEventListener('track', event => {
    remoteStream = new MediaStream([event.track]);
  });

  peerConnection = pc;
  return pc;
};

export const addIceCandidatesToPeerConnection = () => {
  console.log('Adding ICE candidates to peer connection');
  const pc = peerConnection;
  if (pc) {
    while (iceCandidatesQueue.length) {
      console.log('Adding ICE candidate:', iceCandidatesQueue[0]);
      const candidate = iceCandidatesQueue.shift();
      console.log('Adding ICE candidate:', candidate);
      pc.addIceCandidate(candidate).catch(error => {
        console.error('Failed to add ICE candidate:', error);
      });
    }
  } else {
    console.error('PeerConnection is not ready to add ICE candidates.');
  }
};

export const beginParty = async (partyId: string) => {
  const pc = createPeerConnection(partyId);
  const stream = await setupMediaStream();

  if (stream) {
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
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

  const candidatesCollection = collection(callDoc, 'candidates');
  const unsubscribeCandidates = onSnapshot(candidatesCollection, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        console.log('Adding ICE candidate from snapshot:', data);
        const candidate = new RTCIceCandidate(data);
        console.log('Adding ICE candidate from snapshot:', candidate);
        if (pc.remoteDescription) {
          pc.addIceCandidate(candidate).catch(error => {
            console.error(
              'Failed to add ICE candidate on begin Party snapshot:',
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
    if (data?.answer && pc.signalingState === 'have-local-offer') {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription).then(
        addIceCandidatesToPeerConnection,
      );
    }
  });
};

export const joinCall = async (partyId: string) => {
  console.log('Joining call');
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
  }
  if (callData?.offer && pc.signalingState === 'stable') {
    const offerDescription = new RTCSessionDescription(callData.offer);
    await pc
      .setRemoteDescription(offerDescription)
      .then(() => pc.createAnswer())
      .then(answerDescription => {
        return pc.setLocalDescription(answerDescription).then(() => {
          updateDoc(callDoc, {answer: answerDescription});
          addIceCandidatesToPeerConnection();
        });
      })
      .catch(error => console.error('Failed to set remote offer', error));
  }

  onSnapshot(callDoc, snapshot => {
    const data = snapshot.data();
    if (data?.callEnded) {
      callEnded = true;
    }
    if (data?.candidates) {
      console.log('Adding ICE candidates from snapshot:', data.candidates);
      data.candidates.forEach((candidateData: any) => {
        const candidate = new RTCIceCandidate(candidateData);
        if (pc.remoteDescription) {
          pc.addIceCandidate(candidate).catch(error => {
            console.error('Failed to add ICE candidate:', error);
          });
        } else {
          iceCandidatesQueue.push(candidate);
        }
      });
    }
  });

  return true;
};

export const endCall = async (partyId: string) => {
  const pc = peerConnection;
  console.log('Ending call', pc);
  console.log('Closing peer connection', pc);
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
};

export const leaveCall = async () => {
  const pc = peerConnection;
  if (pc) {
    pc.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach(track => {
      console.log('Stopping local track:', track);
      track.stop();
    });
    localStream = null;
  }

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => {
      console.log('Stopping remote track:', track);
      track.stop();
    });
    remoteStream = null;
  }

  isConnected = false;
  callEnded = true;
};

export const microphoneHandler = async () => {
  if (localStream) {
    try {
      const audioTrack = await localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      isMuted = !isMuted;
    } catch (err) {
      // Handle Error
    }
  }
};
