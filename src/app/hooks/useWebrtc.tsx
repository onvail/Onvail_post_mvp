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
import {useCallback, useRef, useState} from 'react';
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
import {useMicStore} from '../zustand/store';

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
  iceCandidatePoolSize: 80,
};

/**
 * Provides a custom React hook for managing a WebRTC peer-to-peer connection.
 *
 * The `useWebrtc` hook handles the setup, connection, and management of a WebRTC peer connection,
 * including the handling of media streams, ICE candidates, and call state. It also provides
 * functions to begin a new call, join an existing call, end a call, and mute the remote audio.
 *
 * @param {string} partyId - The unique identifier for the WebRTC call party.
 * @returns {Object} - An object containing the following properties and functions:
 *   - `setupMediaStream`: A function that sets up the local media stream.
 *   - `beginParty`: A function that initiates a new WebRTC call.
 *   - `joinCall`: A function that joins an existing WebRTC call.
 *   - `endCall`: A function that ends the current WebRTC call.
 *   - `localStream`: The local media stream.
 *   - `remoteStream`: The remote media stream.
 *   - `isConnected`: A boolean indicating whether the WebRTC connection is established.
 *   - `callEnded`: A boolean indicating whether the call has ended.
 *   - `callStarted`: A boolean indicating whether the call has started.
 *   - `leaveCall`: A function that leaves the current WebRTC call.
 *   - `muteAll`: A function that mutes the remote audio.
 */

let PEERCONNECTION: RTCPeerConnection | null;
let LOCAL_STREAM: MediaStream | null;
let REMOTE_STREAM: MediaStream | null;

const useWebrtc = (partyId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const firestore = getFirestore();
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const toggleMicGlobalState = useMicStore(state => state.setIsMuted);

  /**
   * Sets up the local media stream.
   * Access the local media stream using the `localStream` property.
   * @returns {MediaStream} - The local media stream.
   *
   */
  const setupMediaStream = useCallback(async () => {
    try {
      const mediaConstraints = {audio: true, video: false};
      const stream = await mediaDevices.getUserMedia(mediaConstraints);
      localStreamRef.current = stream;
      LOCAL_STREAM = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
      return null;
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(peerConstraints);

    pc.addEventListener('connectionstatechange', () => {
      console.log('Connection state changed:', pc.connectionState);
      switch (pc.connectionState) {
        case 'closed':
          console.log('Connection ended');
          break;
        case 'connected':
          console.log('Connection connected');
          setIsConnected(true);
          break;
        case 'disconnected':
        case 'failed':
          console.log('Connection disconnected or failed');
          setIsConnected(false);
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
      remoteStreamRef.current = new MediaStream([event.track!]);
    });

    peerConnectionRef.current = pc;
    PEERCONNECTION = pc;
    return pc;
  }, [firestore, partyId]);

  /**
   * Retrieves the current WebRTC peer connection from the `peerConnectionRef` reference and adds any pending ICE candidates to the connection.
   * This function is used to handle the asynchronous nature of ICE candidate gathering, ensuring that all candidates are added to the peer connection.
   */
  const addIceCandidatesToPeerConnection = useCallback(() => {
    const pc = PEERCONNECTION;
    if (pc) {
      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        pc.addIceCandidate(candidate).catch(error => {
          console.error('Failed to add ICE candidate:', error);
        });
      }
    }
  }, []);

  /**
   *  Initiates a new WebRTC call.
   *  This function sets up the local media stream, creates a new peer connection, adds the local stream to the peer connection, and sends the offer to the remote peer.
   * @returns {void}
   */
  const beginParty = useCallback(async () => {
    const pc = createPeerConnection();
    console.log('peer connection when beginning part', pc);
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
          addIceCandidatesToPeerConnection,
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
    console.log('peer connection when beginning part', pc);
  }, [
    createPeerConnection,
    setupMediaStream,
    partyId,
    addIceCandidatesToPeerConnection,
  ]);

  /**
   * Joins a WebRTC call with the given party ID.
   *
   * This function sets up a WebRTC peer connection, retrieves the call data from Firestore,
   * and handles the call flow, including setting the remote description, creating an answer,
   * and processing ICE candidates.
   *
   * @param {string} partyId - The ID of the party to join.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the call was successfully joined, or `false` otherwise.
   */
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
            addIceCandidatesToPeerConnection();
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
    addIceCandidatesToPeerConnection,
  ]);

  const endCall = useCallback(async () => {
    const pc = PEERCONNECTION;
    console.log('Ending call', pc);
    console.log('Closing peer connection', pc);
    if (pc) {
      pc.getTransceivers().forEach(transceiver => {
        transceiver.stop();
      });
      pc.close();
      PEERCONNECTION = null;
    }

    if (LOCAL_STREAM) {
      LOCAL_STREAM.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
      LOCAL_STREAM = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      remoteStreamRef.current = null;
    }

    const callDoc = doc(collection(firestore, 'calls'), partyId);
    await updateDoc(callDoc, {callEnded: true, callStarted: false});

    setIsConnected(false);
    setCallEnded(true);
  }, [firestore, partyId]);

  const leaveCall = useCallback(async () => {
    const pc = PEERCONNECTION;
    if (pc) {
      pc.close();
      PEERCONNECTION = null;
    }

    if (LOCAL_STREAM) {
      LOCAL_STREAM.getTracks().forEach(track => {
        console.log('Stopping local track:', track);
        track.stop();
      });
      localStreamRef.current = null;
      LOCAL_STREAM = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => {
        console.log('Stopping remote track:', track);
        track.stop();
      });
      remoteStreamRef.current = null;
    }

    setIsConnected(false);
    setCallEnded(true);
  }, []);

  const localStream = localStreamRef.current;
  const remoteStream = remoteStreamRef.current;

  const toggleMute = useCallback(async () => {
    console.log('Toggling mute');
    const audioTrack = LOCAL_STREAM?.getAudioTracks()[0];
    console.log('Audio track:', audioTrack);
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(audioTrack.enabled);
    }
  }, []);

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
    toggleMute,
    isMuted,
  };
};

export default useWebrtc;
