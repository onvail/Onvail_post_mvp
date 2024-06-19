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
    await setDoc(callDoc, {offer: offer, candidates: []});

    onSnapshot(callDoc, snapshot => {
      const data = snapshot.data();
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
    const pc = createPeerConnection();
    const stream = await setupMediaStream();

    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    const callDoc = doc(collection(firestore, 'calls'), partyId);
    const callData = (await getDoc(callDoc)).data();

    if (callData?.offer && pc.signalingState === 'stable') {
      const offerDescription = new RTCSessionDescription(callData.offer);
      await pc
        .setRemoteDescription(offerDescription)
        .then(processIceCandidatesQueue);

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);
      await updateDoc(callDoc, {answer: answerDescription});
    }

    onSnapshot(callDoc, snapshot => {
      const data = snapshot.data();
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
    firestore,
    partyId,
    processIceCandidatesQueue,
  ]);

  useEffect(() => {
    setupMediaStream();
  }, [setupMediaStream]);

  return {
    setupMediaStream,
    beginParty,
    joinCall,
    localStream,
    remoteStream,
    isConnected,
  };
};

export default useWebrtc;
