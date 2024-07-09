import {useRef, useState, useEffect, useCallback} from 'react';
import {AGORA_APP_ID, AGORA_TEMPORARY_TOKEN} from '@env';
// Import Agora SDK
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import {PermissionsAndroid, Platform} from 'react-native';

const token = AGORA_TEMPORARY_TOKEN;
const uid = 0;
const appId = AGORA_APP_ID;

export const useAgora = (channelName: string) => {
  const channel = 'onvail';
  console.log('channelName', channelName);

  const agoraEngineRef = useRef<IRtcEngine | null>(null); // IRtcEngine instance
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Remote user UID
  const [message, setMessage] = useState(''); // User prompt message
  const [isMuted, setIsMuted] = useState(true); // Whether the local user is muted
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState<boolean>(true); // Whether the local user is a speaker

  // Initialize the engine when starting the App
  useEffect(() => {
    setupVideoSDKEngine();
  });
  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after checking and obtaining device permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      // Register event callbacks
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel: ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user ' + Uid + ' has joined');
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user ' + Uid + ' has left the channel');
          setRemoteUid(0);
        },
      });
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      console.log('joining', agoraEngineRef);
      // Set the channel profile type to communication after joining the channel
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      // Call the joinChannel method to join the channel
      agoraEngineRef.current?.joinChannel(token, channel, uid, {
        // Set the user role to broadcaster
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };
  // Define the leave method called after clicking the leave channel button
  const leave = () => {
    try {
      // Call the leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('Left the channel');
    } catch (e) {
      console.log(e);
    }
  };

  // Display message
  function showMessage(msg: string) {
    console.log('msg', msg);
    setMessage(msg);
  }

  const toggleMute = useCallback(async () => {
    try {
      agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
      setIsMuted(muted => !muted);
    } catch (e) {
      console.log(e);
    }
  }, [isMuted]);

  const toggleIsSpeakerEnabled = useCallback(async () => {
    agoraEngineRef.current?.setEnableSpeakerphone(!isSpeakerEnabled);
    setIsSpeakerEnabled(enabled => !enabled);
  }, [isSpeakerEnabled]);

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  return {
    join,
    leave,
    toggleMute,
    isMuted,
    toggleIsSpeakerEnabled,
  };
};
