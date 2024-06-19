import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {db} from '../../../firebaseConfig';
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

const useWebrtc = (partyId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    new MediaStream(),
  );
  const [isConnected, setIsConnected] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const firestore = getFirestore();
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

  const setupMediaStream = useCallback(async () => {
    try {
      const mediaConstraints = {audio: true, video: false};
      const stream = await mediaDevices.getUserMedia(mediaConstraints);
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
      return null;
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(peerConstraints);

    pc.addEventListener('connectionstatechange', () => {
      switch (pc.connectionState) {
        case 'closed':
          console.log('Connection ended');
          break;
        case 'connected':
          console.log('Connection connected');
          setIsConnected(true);
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
      setRemoteStream(prevStream => {
        const updatedStream = new MediaStream([
          ...prevStream.getTracks(),
          event.track!,
        ]);
        return updatedStream;
      });
    });

    peerConnectionRef.current = pc;
    return pc;
  }, [firestore, partyId]);

  const processIceCandidatesQueue = useCallback(() => {
    const pc = peerConnectionRef.current;
    if (pc) {
      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        pc.addIceCandidate(candidate).catch(error => {
          console.error('Failed to add ICE candidate:', error);
        });
      }
    }
  }, []);

  const beginParty = useCallback(async () => {
    const pc = createPeerConnection();
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

    onSnapshot(callDoc, snapshot => {
      const data = snapshot.data();
      if (data?.callEnded) {
        setCallEnded(true);
      }
      if (data?.answer && pc.signalingState === 'have-local-offer') {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription).then(
          processIceCandidatesQueue,
        );
      }
      if (data?.candidates) {
        data.candidates.forEach((candidateData: any) => {
          const candidate = new RTCIceCandidate(candidateData);
          if (pc.remoteDescription) {
            pc.addIceCandidate(candidate).catch(error => {
              console.error('Failed to add ICE candidate:', error);
            });
          } else {
            iceCandidatesQueue.current.push(candidate);
          }
        });
      }
    });
  }, [
    createPeerConnection,
    setupMediaStream,
    partyId,
    processIceCandidatesQueue,
  ]);

  const joinCall = useCallback(async () => {
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
      setCallEnded(true);
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
      setCallStarted(false);
      return false;
    }

    setCallStarted(true);

    const pc = createPeerConnection();
    const stream = await setupMediaStream();

    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    if (callData?.offer && pc.signalingState === 'stable') {
      const offerDescription = new RTCSessionDescription(callData.offer);
      await pc
        .setRemoteDescription(offerDescription)
        .then(() => {
          return pc.createAnswer();
        })
        .then(answerDescription => {
          return pc.setLocalDescription(answerDescription).then(() => {
            updateDoc(callDoc, {answer: answerDescription});
            processIceCandidatesQueue();
          });
        })
        .catch(error => console.error('Failed to set remote offer', error));
    }

    onSnapshot(callDoc, snapshot => {
      const data = snapshot.data();
      if (data?.callEnded) {
        setCallEnded(true);
      }
      if (data?.candidates) {
        data.candidates.forEach((candidateData: any) => {
          const candidate = new RTCIceCandidate(candidateData);
          if (pc.remoteDescription) {
            pc.addIceCandidate(candidate).catch(error => {
              console.error('Failed to add ICE candidate:', error);
            });
          } else {
            iceCandidatesQueue.current.push(candidate);
          }
        });
      }
    });

    return true;
  }, [
    createPeerConnection,
    setupMediaStream,
    firestore,
    partyId,
    processIceCandidatesQueue,
  ]);

  const endCall = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (pc) {
      pc.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);

    // Update the call document to indicate that the call has ended
    const callDoc = doc(collection(firestore, 'calls'), partyId);
    await updateDoc(callDoc, {callEnded: true, callStarted: false});

    setIsConnected(false);
  }, [firestore, localStream, partyId]);

  const leaveCall = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (pc) {
      pc.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().map(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setIsConnected(false);
  }, [localStream]);

  useEffect(() => {
    setupMediaStream();
  }, [setupMediaStream]);

  return {
    setupMediaStream,
    beginParty,
    joinCall,
    endCall,
    localStream,
    remoteStream,
    isConnected,
    callEnded,
    callStarted,
    leaveCall,
  };
};

export default useWebrtc;
