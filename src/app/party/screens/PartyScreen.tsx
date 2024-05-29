import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  SafeAreaView,
  View,
  TextInput,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'src/app/components/Icons/Icon';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomText from 'src/app/components/Text/CustomText';
import tw from 'src/lib/tailwind';
import Slider from '@react-native-community/slider';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';
import CustomBottomSheet, {
  CustomBottomSheetRef,
} from 'src/app/components/BottomSheet/CustomBottomsheet';
import CommentCards from 'src/app/components/Cards/CommentCards';
import RowContainer from 'src/app/components/View/RowContainer';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import MusicList from '../components/MusicList';
import useMusicPlayer from 'src/app/hooks/useMusicPlayer';
import {VolumeManager} from 'react-native-volume-manager';
import TrackPlayer, {State, Track} from 'react-native-track-player';
import CustomImage from 'src/app/components/Image/CustomImage';
import {Comment, Song} from 'src/types/partyTypes';
import api from 'src/api/api';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import useUser from 'src/app/hooks/useUserInfo';
import socket from 'src/utils/socket';
import {getPlaybackState} from 'react-native-track-player/lib/trackPlayer';
import moment from 'moment-timezone';

type Props = NativeStackScreenProps<MainStackParamList, 'PartyScreen'>;

const PartyScreen: FunctionComponent<Props> = ({navigation, route}) => {
  const {party, partyBackgroundColor} = route.params;
  const {user} = useUser();
  const utcTimeStamp = moment().tz('UTC');
  const HighLightLeft = generalIcon.HighLightLeft;
  const HighLightRight = generalIcon.HighLightRight;
  const PauseIcon = generalIcon.PauseIcon;
  const PlayIcon = generalIcon.PlayIcon;
  const SendIcon = generalIcon.SendIcon;
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);
  const [isSameQueue, setIsSameQueue] = useState<boolean>(false);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [comment, setComment] = useState<string>('');
  const [isUploadingComment, setIsUploadingComment] = useState<boolean>(false);

  const screenColors = {
    background:
      partyBackgroundColor?.platform === 'android'
        ? partyBackgroundColor?.average
        : partyBackgroundColor?.background,
    detail:
      partyBackgroundColor?.platform === 'android'
        ? partyBackgroundColor?.darkVibrant
        : partyBackgroundColor?.detail,
    accent:
      partyBackgroundColor?.platform === 'android'
        ? partyBackgroundColor?.darkMuted
        : partyBackgroundColor?.detail,
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const songs: Song[] = party?.songs;
  const isHost = party?.artist?._id === user?._id;

  const allTracks = useMemo(() => {
    return songs?.map(song => ({
      genre: '',
      album: '',
      artwork: party?.albumPicture,
      duration: song?.duration,
      url: song?.file_url,
      id: song?._id,
      date: party?.date,
      title: song?.name,
      artist: party?.artist?.name,
    }));
  }, [party?.artist?.name, party?.date, songs, party?.albumPicture]);

  const leavePartyHandler = () => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Leave party',
      textBody: 'Are you sure you want to leave this party?',
      button: 'continue',
      onPressButton: async () => {
        await leaveParty();
        await TrackPlayer.stop();
        await TrackPlayer.reset();
        Dialog.hide();
      },
    });
  };

  const endPartyHandler = () => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'End party',
      textBody: 'Are you sure you want to end this party?',
      button: 'continue',
      onPressButton: async () => {
        endParty();
        await TrackPlayer.stop();
        await TrackPlayer.reset();
        Dialog.hide();
      },
    });
  };

  const leaveParty = async () => {
    try {
      await api.post({
        url: `parties/leave/${party?._id}`,
        requiresToken: true,
        authorization: true,
      });
      navigation.navigate('BottomNavigator', {
        screen: 'Home',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const commentOnParty = async () => {
    setIsUploadingComment(true);
    try {
      const response = await api.post({
        url: `parties/comment-party/${party?._id}`,
        requiresToken: true,
        authorization: true,
        data: {
          text: comment,
        },
      });
      setComment('');
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsUploadingComment(false);
  };

  const commentsRenderItem: ListRenderItem<Comment> = ({item}) => {
    return <CommentCards item={item} />;
  };

  const endParty = async () => {
    try {
      await api.post({
        url: `parties/leave/${party?._id}`,
        requiresToken: true,
        authorization: true,
      });
      navigation.navigate('BottomNavigator', {
        screen: 'Home',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const {
    playerState,
    checkIfTrackQueueIsDifferent,
    skipToNext,
    skipToPrevious,
    handlePauseAndPlayTrack,
  } = useMusicPlayer({
    track: allTracks,
  });

  const volumeHandler = useCallback(async () => {
    await VolumeManager.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    volumeHandler();
  }, [volume, volumeHandler]);

  const handlePlay = async () => {
    // Get the previous playback state
    const previousState = await getPlaybackState();

    try {
      // Call the function to play or pause the track
      await handlePauseAndPlayTrack();

      // Add a slight delay to ensure the state has time to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the current playback state after the delay
      const currentState = await getPlaybackState();

      // Emit the play event only if there is an actual state change
      if (currentState !== previousState) {
        socket.emit('play', {
          cmd: 'play',
          timeStamp: utcTimeStamp,
          party: party?._id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevious = async () => {
    await skipToPrevious().then(() => {
      socket.emit('previous', {
        party: party?._id,
        timeStamp: utcTimeStamp,
        cmd: 'previous',
      });
    });
  };

  const handleNext = async () => {
    await skipToNext().then(() => {
      socket.emit('forward', {
        party: party?._id,
        cmd: 'forward',
        timeStamp: utcTimeStamp,
      });
    });
  };

  const renderItem: ListRenderItem<Track> = ({item, index}) => {
    const {artist, title, url, id, duration} = item;
    return (
      <MusicList
        duration={duration}
        title={title}
        index={index}
        artist={artist}
        url={url}
        id={id}
      />
    );
  };

  const buffering = isSameQueue && playerState === 'buffering';

  const handleSameQueueItemState = useCallback(async () => {
    const sameQueue = await checkIfTrackQueueIsDifferent();
    setIsSameQueue(sameQueue);
    return sameQueue;
  }, [checkIfTrackQueueIsDifferent]);

  useLayoutEffect(() => {
    handleSameQueueItemState();
  }, [handleSameQueueItemState]);

  let IconComponent;

  if (isSameQueue && playerState === 'playing') {
    IconComponent = <PauseIcon />;
  } else if (buffering) {
    IconComponent = <ActivityIndicator />;
  } else {
    IconComponent = <PlayIcon />;
  }

  const mountTrackForGuests = useCallback(async () => {
    if (!isHost) {
      TrackPlayer.add(allTracks);
    }
  }, [allTracks, isHost]);

  const handleSocketEvents = useCallback(
    async (data: {cmd: string; timeStamp: string; party: string}) => {
      const currentTime = moment().tz('UTC');
      const eventTime = moment.tz(data.timeStamp, 'UTC');
      const timeDifference = moment(currentTime).diff(eventTime) / 1000;
      console.log('timeDifference', timeDifference);

      const playBackState = await getPlaybackState();

      if (isHost) {
        return;
      }
      switch (data.cmd) {
        case 'play':
          if (playBackState.state === State.Playing) {
            await TrackPlayer.pause().then(res => console.log('pause', res));
          } else {
            await TrackPlayer.play().then(res => console.log(res));
            await TrackPlayer.seekTo(timeDifference);
          }
          break;
        case 'stop':
          await TrackPlayer.stop();
          break;
        case 'previous':
          await TrackPlayer.skipToPrevious();
          await TrackPlayer.seekTo(timeDifference);
          break;
        case 'forward':
          await TrackPlayer.skipToNext();
          await TrackPlayer.seekTo(timeDifference);
          break;
        default:
          break;
      }
    },
    [isHost],
  );

  useEffect(() => {
    mountTrackForGuests();
    socket.on('receive', handleSocketEvents);

    return () => {
      TrackPlayer.stop();
      TrackPlayer.reset();
      socket.off('receive', handleSocketEvents);
    };
  }, [isHost, mountTrackForGuests, handleSocketEvents]);

  return (
    <LinearGradient
      style={tw`h-full  flex-1 p-4`}
      colors={[
        screenColors?.background ?? '#0E0E0E',
        screenColors?.detail ?? '#087352',
      ]}>
      <SafeAreaView style={tw`h-full flex-1`}>
        <TouchableOpacity
          style={tw` ${
            Platform.OS === 'android' ? 'mt-6' : 'mt-0'
          } h-10 w-20 items-center  justify-center self-end`}
          onPress={() => (isHost ? endPartyHandler() : leavePartyHandler())}>
          <CustomText
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color: screenColors?.accent,
              fontWeight: '700',
            }}>
            {isHost ? 'End' : 'Leave'}
          </CustomText>
        </TouchableOpacity>
        <View style={tw`mt-8 mb-3 items-center`}>
          <CustomImage
            uri={party.albumPicture}
            resizeMode="cover"
            style={tw`h-60 w-60 rounded-lg`}
          />
          <View style={tw` mt-8 flex-row items-center justify-between`}>
            <HighLightLeft />
            <CustomText style={tw`font-poppinsBold w-10`}>LIVE</CustomText>
            <Pressable onPress={() => openBottomSheet()}>
              <HighLightRight />
            </Pressable>
          </View>
          {isHost && (
            <RowContainer
              style={tw`mt-6 w-[60%]  justify-around  items-center`}>
              <Pressable onPress={handlePrevious}>
                <Icon icon="rewind" color="white" size={25} />
              </Pressable>
              <Pressable
                onPress={() => handlePlay()}
                style={tw`w-10 items-center `}>
                {IconComponent}
              </Pressable>
              <Pressable onPress={handleNext}>
                <Icon icon="fast-forward" color="white" size={25} />
              </Pressable>
            </RowContainer>
          )}
          <View style={tw`flex-row w-[90%] mt-6 items-center`}>
            <Icon icon={'volume-low'} color="white" />
            <Slider
              style={tw`w-70`}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FFFF"
              onValueChange={value => setVolume(value)}
            />
            <Icon icon={'volume-medium'} color="white" />
          </View>
        </View>
        <FlashList
          data={allTracks}
          renderItem={renderItem}
          keyExtractor={item => item?.id}
          estimatedItemSize={20}
          estimatedListSize={{
            height: 200,
            width: 300,
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <CustomBottomSheet
        ref={bottomSheetRef}
        customSnapPoints={[60, 300, 500, 700]}
        backgroundColor={screenColors?.accent}
        visibilityHandler={() => {}}>
        <View style={styles.commentFlatList}>
          <FlashList
            renderItem={commentsRenderItem}
            estimatedItemSize={200}
            data={party?.comments}
          />
          <RowContainer style={tw` px-6 mb-5 `}>
            <View
              style={tw`border flex-row items-center mr-3 justify-between px-3 h-12 rounded-lg border-grey4`}>
              <TextInput
                placeholder="Add comment"
                style={tw`text-white text-sm w-[90%] font-poppinsRegular h-12`}
                placeholderTextColor={'#A2A2A2'}
                onChangeText={text => setComment(text)}
              />
              <Pressable
                disabled={comment.length < 1 || isUploadingComment}
                onPress={() => commentOnParty()}>
                {isUploadingComment ? <ActivityIndicator /> : <SendIcon />}
              </Pressable>
            </View>
            <Pressable onPress={() => setIsMuted(!isMuted)} style={tw``}>
              <Icon
                icon={isMuted ? 'microphone' : 'microphone-off'}
                color="white"
                size={25}
              />
            </Pressable>
          </RowContainer>
        </View>
      </CustomBottomSheet>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  commentFlatList: {
    minHeight: Dimensions.get('screen').height / 1.4,
    flex: 1,
  },
});

export default PartyScreen;
