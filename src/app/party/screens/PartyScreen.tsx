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
import {Song} from 'src/types/partyTypes';
import api from 'src/api/api';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import useUser, {User} from 'src/app/hooks/useUserInfo';
import socket from 'src/utils/socket';
import {getPlaybackState} from 'react-native-track-player/lib/trackPlayer';
import moment from 'moment-timezone';
import {FireStoreComments, createFireStoreComments} from 'src/actions/parties';
import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import {db} from '../../../../firebaseConfig';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import {BottomSheetFooter, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import GuestsList from '../components/GuestsList';
import Modal from 'react-native-modal/dist/modal';
import CustomImage from 'src/app/components/Image/CustomImage';
import {useAgora} from 'src/app/hooks/useAgora';

type Props = NativeStackScreenProps<MainStackParamList, 'PartyScreen'>;

const PartyScreen: FunctionComponent<Props> = ({navigation, route}) => {
  const {party, partyBackgroundColor} = route.params;
  const {user} = useUser();
  const {isMuted, toggleMute, toggleIsSpeakerEnabled, leave, isSpeakerEnabled} =
    useAgora(party?._id);
  const utcTimeStamp = moment().tz('UTC');
  const HighLightLeft = generalIcon.HighLightLeft;
  const HighLightRight = generalIcon.HighLightRight;
  const PauseIcon = generalIcon.PauseIcon;
  const PlayIcon = generalIcon.PlayIcon;
  const SendIcon = generalIcon.SendIcon;
  const MicMuteIcon = generalIcon.MicMuteIcon;
  const MicUnmuteIcon = generalIcon.MicUnmuteIcon;
  const HandRaisedIcon = generalIcon.HandRaisedIcon;
  const HandDownIcon = generalIcon.HandDownIcon;

  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);
  const [isSameQueue, setIsSameQueue] = useState<boolean>(false);
  const [selectedBottomSheetTab, setSelectedBottomSheetTab] =
    useState<number>(0);
  const [guestList, setGuestList] = useState<User[]>([]);

  const [volume, setVolume] = useState<number>(0.5);
  const [comments, setComments] = useState<FireStoreComments[]>([]);
  const [isUploadingComment, setIsUploadingComment] = useState<boolean>(false);
  const commentRef = useRef<string>('');
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isEndPartyModalVisible, setIsEndPartyModalVisible] =
    useState<boolean>(false);
  const [isLeavePartyModalVisible, setIsLeavePartyModalVisible] =
    useState<boolean>(false);
  const [isEndingParty, setIsEndingParty] = useState<boolean>(false);
  const [isLeavingParty, setIsLeavingParty] = useState<boolean>(false);
  const partyId = party?._id;

  // Initialize the animated value
  const translateX = useSharedValue(0);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

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

  const leaveParty = useCallback(async () => {
    setIsLeavingParty(true);
    try {
      leave();
      socket.emit('leave_party', {
        party: partyId,
        user,
      });
      const partyDocRef = doc(db, 'party', partyId);
      await updateDoc(partyDocRef, {
        participants: arrayRemove(user),
      });
      await api.post({
        url: `parties/leave/${partyId}`,
        requiresToken: true,
        authorization: true,
      });

      navigation.navigate('BottomNavigator', {
        screen: 'Home',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLeavingParty(false);
    }
  }, [navigation, partyId, user, leave]);

  const leavePartyHandler = useCallback(async () => {
    await leaveParty();
    setIsLeavePartyModalVisible(false);
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  }, [leaveParty]);

  const endPartyHandler = async () => {
    // await endCall();
    await endParty();
    setIsEndPartyModalVisible(false);
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  };

  const fetchPartyGuests = useCallback(async () => {
    try {
      const partyDocRef = doc(db, 'party', partyId);
      const unsubscribe = onSnapshot(partyDocRef, snapshotDoc => {
        const data = snapshotDoc.data();
        let userList: User[] =
          data?.participants?.map((allusers: User) => allusers) ?? [];
        setGuestList(userList);
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }, [partyId]);

  useEffect(() => {
    fetchPartyGuests();
  }, [fetchPartyGuests]);

  useEffect(() => {
    const handlePartyStatus = async () => {
      if (!isHost) {
        const callDoc = doc(db, 'party', partyId);

        const unsubscribe = onSnapshot(callDoc, async snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data && data.is_started === false) {
              await TrackPlayer.stop();
              await TrackPlayer.reset();
              await leaveParty();
              Toast.show({
                type: ALERT_TYPE.INFO,
                title: 'Party ended!',
                textBody: 'The host ended the party',
                titleStyle: tw`font-poppinsRegular text-xs`,
                textBodyStyle: tw`font-poppinsRegular text-xs`,
              });
            }
          } else {
            console.log('Document does not exist');
          }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
      }
    };
    handlePartyStatus();
  }, [partyId, leaveParty, isHost]);

  useEffect(() => {
    if (party?._id) {
      const commentCollection = collection(db, `party/${party._id}/comments`);
      const q = query(commentCollection, orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, async querySnapshot => {
        const fetchedComments: any = await Promise.all(
          querySnapshot.docs.map(async doc => {
            const commentData = {...doc.data(), commentId: doc.id};
            const repliesCollection = collection(
              db,
              `party/${party?._id}/comments/${doc.id}/replies`,
            );
            const repliesSnapshot = await getDocs(repliesCollection);
            const replies = repliesSnapshot.docs.map(replyDoc => ({
              ...replyDoc.data(),
              commentId: replyDoc.id,
            }));
            return {...commentData, replies};
          }),
        );
        setComments(fetchedComments);
      });

      // Cleanup the listener on unmount
      return () => unsubscribe();
    }
  }, [party?._id]);

  const commentOnParty = useCallback(async () => {
    setIsUploadingComment(true);
    try {
      const comment = commentRef.current;
      await api.post({
        url: `parties/comment-party/${party?._id}`,
        requiresToken: true,
        authorization: true,
        data: {
          text: comment,
        },
      });
      commentRef.current = '';
      createFireStoreComments(
        party?._id,
        user?._id,
        comment,
        user?.image,
        user?.stageName,
        user?.name,
      );
    } catch (error) {
      console.log(error);
    }
    setIsUploadingComment(false);
  }, [
    party?._id,
    user?._id,
    user?.image,
    user?.stageName,
    user?.name,
    commentRef,
  ]);

  const commentsRenderItem: ListRenderItem<FireStoreComments> = ({
    item,
    index,
  }) => {
    return (
      <CommentCards
        item={item}
        partyId={party?._id}
        isLastItem={index + 1 === comments.length}
      />
    );
  };

  const endParty = async () => {
    setIsEndingParty(true);
    try {
      const partyDocRef = doc(db, 'party', party?._id);
      leave();
      await updateDoc(partyDocRef, {
        participants: arrayRemove(user),
        is_started: false,
      });
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
    } finally {
      setIsEndingParty(false);
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

  const trackRenderItem: ListRenderItem<Track> = ({item, index}) => {
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

  interface SocketData {
    cmd: string;
    timeStamp: string;
    party: string;
    user?: any;
  }

  const handleSocketEvents = useCallback(
    async (data: SocketData) => {
      const currentTime = moment().tz('UTC');
      const eventTime = moment.tz(data.timeStamp, 'UTC');
      const timeDifference = moment(currentTime).diff(eventTime) / 1000;

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
          await TrackPlayer.seekTo(timeDifference);
          break;
        default:
          break;
      }
    },
    [isHost],
  );

  // const handleSocketEventsForEveryone = useCallback(
  //   async (data: SocketData) => {
  //     console.log(data);
  //     switch (data.cmd) {
  //       case 'user_joined':
  //         return console.log('user joined', user);
  //       case 'user_left':
  //         console.log('user left', user);
  //         break;
  //       default:
  //         break;
  //     }
  //   },
  //   [user],
  // );

  useEffect(() => {
    mountTrackForGuests();
    socket.on('receive', handleSocketEvents);
    // socket.on('receive', handleSocketEventsForEveryone);

    return () => {
      TrackPlayer.stop();
      TrackPlayer.reset();
      socket.off('receive', handleSocketEvents);
      // socket.off('receive', handleSocketEventsForEveryone);
    };
  }, [
    isHost,
    mountTrackForGuests,
    handleSocketEvents,
    // handleSocketEventsForEveryone,
  ]);

  const handleCommentChange = (text: string) => {
    commentRef.current = text;
  };

  useEffect(() => {
    if (!isHost) {
      socket.emit('join_party', {
        party: party._id,
        user,
      });
    }
  }, [isHost, party?._id, user]);

  const updateTab = (direction: number) => {
    setSelectedBottomSheetTab(prev => {
      let nextTab = prev + direction;
      if (nextTab < 0) {
        nextTab = 0;
      }
      if (nextTab > 2) {
        nextTab = 2;
      }
      return nextTab;
    });
  };

  const screenWidth = Dimensions.get('window').width;

  const swipeGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
    })
    .onEnd(event => {
      if (event.translationX < -screenWidth / 3) {
        runOnJS(updateTab)(1);
      } else if (event.translationX > screenWidth / 3) {
        runOnJS(updateTab)(-1);
      }
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    });

  const guestRenderItem: ListRenderItem<User> = useCallback(
    ({item}) => {
      return (
        <GuestsList
          item={item}
          isHost={party?.artist?._id === item?._id}
          toggleMute={toggleMute}
          isMuted={isMuted}
        />
      );
    },
    [isMuted, toggleMute, party?.artist?._id],
  );

  const renderBottomFooter = useCallback(
    (props: any) => (
      <>
        {selectedBottomSheetTab === 0 ? (
          <BottomSheetFooter {...props} bottomInset={24}>
            <View
              style={[
                tw`bg-inherit m-4 mt-3  h-10 rounded-full border-grey4 flex-row px-3 items-center border `,
                {
                  backgroundColor: screenColors.accent,
                },
              ]}>
              <BottomSheetTextInput
                placeholder="Add comment"
                style={tw`text-white text-xs w-[90%]  font-poppinsRegular`}
                placeholderTextColor={'white'}
                onChangeText={handleCommentChange} // Use the new handler
              />
              <Pressable
                disabled={isUploadingComment}
                onPress={() => commentOnParty()}>
                {isUploadingComment ? <ActivityIndicator /> : <SendIcon />}
              </Pressable>
            </View>
          </BottomSheetFooter>
        ) : (
          <></>
        )}
      </>
    ),
    [
      isUploadingComment,
      screenColors?.accent,
      SendIcon,
      commentOnParty,
      selectedBottomSheetTab,
    ],
  );

  const snapPoints = useMemo(() => ['20%', '50%', '75%'], []);
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
          onPress={() =>
            isHost
              ? setIsEndPartyModalVisible(true)
              : setIsLeavePartyModalVisible(true)
          }>
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
          renderItem={trackRenderItem}
          keyExtractor={item => item?.id}
          estimatedItemSize={20}
          estimatedListSize={{
            height: 120,
            width: Dimensions.get('screen').width,
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <Modal
        style={tw`flex-1 justify-center items-center`}
        backdropOpacity={0.9}
        onBackdropPress={() => setIsLeavePartyModalVisible(false)}
        isVisible={isLeavePartyModalVisible}>
        <View
          style={tw` bg-white w-[80%] h-1/7 p-3 rounded-lg items-center justify-center`}>
          <CustomText style={tw`text-grey6 font-poppinsBold`}>
            Are you sure you want to leave the party?
          </CustomText>
          <RowContainer style={tw`mt-3 `}>
            <Pressable
              onPress={() => setIsLeavePartyModalVisible(false)}
              style={tw`border w-15 items-center h-7 justify-center rounded-full border-grey4`}>
              <CustomText style={tw`text-grey7 text-xs font-poppinsRegular`}>
                Stay
              </CustomText>
            </Pressable>
            <Pressable
              onPress={() => leavePartyHandler()}
              style={tw` w-15 items-center h-7 justify-center  ml-4 rounded-full bg-purple`}>
              {isLeavingParty ? (
                <ActivityIndicator />
              ) : (
                <CustomText style={tw`text-white text-xs font-poppinsRegular`}>
                  Leave
                </CustomText>
              )}
            </Pressable>
          </RowContainer>
        </View>
      </Modal>

      <Modal
        style={tw`flex-1 justify-center items-center`}
        backdropOpacity={0.9}
        onBackdropPress={() => setIsEndPartyModalVisible(false)}
        isVisible={isEndPartyModalVisible}>
        <View
          style={tw` bg-white w-[80%] h-1/7 p-3 rounded-lg items-center justify-center`}>
          <CustomText style={tw`text-grey6 font-poppinsBold`}>
            Are you sure you want to end the party?
          </CustomText>
          <RowContainer style={tw`mt-3 `}>
            <Pressable
              onPress={() => setIsEndPartyModalVisible(false)}
              style={tw`border w-15 items-center h-7 justify-center rounded-full border-grey4`}>
              <CustomText style={tw`text-grey7 text-xs font-poppinsRegular`}>
                Stay
              </CustomText>
            </Pressable>
            <Pressable
              disabled={isEndingParty}
              onPress={() => endPartyHandler()}
              style={tw` w-15 items-center h-7 justify-center  ml-4 rounded-full bg-purple`}>
              {isEndingParty ? (
                <ActivityIndicator color={'white'} />
              ) : (
                <CustomText style={tw`text-white text-xs font-poppinsRegular`}>
                  End
                </CustomText>
              )}
            </Pressable>
          </RowContainer>
        </View>
      </Modal>

      <CustomBottomSheet
        ref={bottomSheetRef}
        customSnapPoints={snapPoints}
        backgroundColor={screenColors?.accent}
        footerComponent={renderBottomFooter}
        visibilityHandler={() => {}}>
        <View style={tw`relative h-[40px] flex-1  mb-6`}>
          <RowContainer style={tw`items-center mb-3 mt-5 px-3 justify-center`}>
            {Array.from({length: 3}, (_, key) => (
              <Pressable
                key={key}
                onPress={() => {
                  setSelectedBottomSheetTab(key);
                }}
                style={tw`h-1 w-6 rounded-lg bg-${
                  selectedBottomSheetTab === key ? 'white' : 'grey2'
                } mr-1`}
              />
            ))}
          </RowContainer>
          <GestureDetector gesture={swipeGesture}>
            <View style={tw`relative w-full`}>
              <Animated.View style={[styles.tabsContainer, animatedStyle]}>
                <View style={styles.tabContent}>
                  {selectedBottomSheetTab === 0 && (
                    <View style={tw`flex-1 px-3`}>
                      {comments.length === 0 ? (
                        <View style={tw`justify-center items-center  mt-30`}>
                          <LottieView
                            source={require('../../../assets/comments.json')}
                            style={tw`h-50 w-50`}
                            autoPlay={true}
                            loop={true}
                          />
                          <CustomText style={tw`text-center text-base mt-5`}>
                            Be the frist to say something
                          </CustomText>
                        </View>
                      ) : (
                        <FlashList
                          renderItem={commentsRenderItem}
                          estimatedItemSize={200}
                          data={comments}
                          renderScrollComponent={ScrollView}
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={tw`pb-20`}
                        />
                      )}
                    </View>
                  )}
                  {selectedBottomSheetTab === 1 && (
                    <FlashList
                      data={guestList}
                      renderItem={guestRenderItem}
                      estimatedItemSize={200}
                      numColumns={4}
                      horizontal={false}
                      extraData={isMuted}
                    />
                  )}
                  {selectedBottomSheetTab === 2 && <></>}
                </View>
              </Animated.View>
              <View
                style={[
                  tw`absolute border-t z-20 h-16 justify-center bg-black border-grey2  ${
                    selectedBottomSheetTab === 0 ? 'bottom-0' : '-bottom-12'
                  } w-full `,
                ]}>
                <RowContainer style={tw`justify-between mx-3 items-center`}>
                  <RowContainer style={tw`justify-between items-center w-1/3`}>
                    <Pressable
                      onPress={toggleMute}
                      style={tw`border border-grey2 items-center justify-center rounded-full w-9 h-9`}>
                      {isMuted ? <MicMuteIcon /> : <MicUnmuteIcon />}
                    </Pressable>
                    <Pressable
                      onPress={() => setIsHandRaised(prev => !prev)}
                      style={tw`border border-grey2 items-center justify-center rounded-full w-9 h-9`}>
                      {isHandRaised ? <HandRaisedIcon /> : <HandDownIcon />}
                    </Pressable>
                    <Pressable
                      style={tw`border border-grey2 items-center justify-center rounded-full w-9 h-9`}
                      onPress={toggleIsSpeakerEnabled}>
                      <Icon
                        icon={isSpeakerEnabled ? 'volume-high' : 'volume-low'}
                        size={20}
                        color={isSpeakerEnabled ? 'white' : 'grey'}
                      />
                    </Pressable>
                  </RowContainer>
                  {selectedBottomSheetTab !== 0 && (
                    <RowContainer
                      style={tw`justify-between items-center w-1/3`}>
                      <Pressable
                        style={tw`  items-center justify-center rounded-full`}>
                        <Icon icon={'gift-outline'} color="grey" size={20} />
                      </Pressable>
                      <Pressable
                        style={tw`  items-center justify-center rounded-full`}>
                        <Icon icon={'heart-outline'} color="grey" size={20} />
                      </Pressable>
                      <Pressable
                        onPress={() => setSelectedBottomSheetTab(0)}
                        style={tw`items-center justify-center rounded-full`}>
                        <Icon icon={'message-outline'} color="grey" size={25} />
                      </Pressable>
                    </RowContainer>
                  )}
                </RowContainer>
              </View>
            </View>
          </GestureDetector>
        </View>
      </CustomBottomSheet>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    zIndex: 0,
    flexDirection: 'row',
    paddingHorizontal: 3,
    width: Dimensions.get('window').width * 3, // Adjust width for three tabs
  },

  tabContent: {
    zIndex: 0,
    width: Dimensions.get('window').width, // Width of each tab content
    height: Dimensions.get('window').height / 2, // Adjust height as needed
  },
});

export default PartyScreen;
