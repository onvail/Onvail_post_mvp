import React, {
     FunctionComponent,
     useCallback,
     useEffect,
     useRef,
     useState,
     useMemo,
     Animated as RNAnimated,
} from "react";
import {
     Pressable,
     SafeAreaView,
     View,
     ActivityIndicator,
     Platform,
     TouchableOpacity,
     StyleSheet,
     Dimensions,
     ScrollView,
     Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "src/app/components/Icons/Icon";
import { generalIcon } from "src/app/components/Icons/generalIcons";
import CustomText from "src/app/components/Text/CustomText";
import tw from "src/lib/tailwind";
import Slider from "@react-native-community/slider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "src/app/navigator/types/MainStackParamList";
import CustomBottomSheet, {
     CustomBottomSheetRef,
} from "src/app/components/BottomSheet/CustomBottomsheet";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import MusicList from "../components/MusicList";
import useMusicPlayer, { Stream } from "src/app/hooks/useMusicPlayer";
import { VolumeManager } from "react-native-volume-manager";
import TrackPlayer, { State, Track } from "react-native-track-player";
import { Song } from "src/types/partyTypes";
import api from "src/api/api";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import useUser, { User } from "src/app/hooks/useUserInfo";
import socket from "src/utils/socket";
import { getPlaybackState } from "react-native-track-player/lib/src/trackPlayer";
import moment from "moment-timezone";
import { FireStoreComments, createFireStoreComments } from "src/actions/parties";
import {
     arrayRemove,
     collection,
     doc,
     getDocs,
     getFirestore,
     onSnapshot,
     orderBy,
     query,
     updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { BottomSheetFooter, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import LottieView from "lottie-react-native";
import Animated, {
     useAnimatedStyle,
     useSharedValue,
     withRepeat,
     withSpring,
     withTiming,
} from "react-native-reanimated";
import Modal from "react-native-modal/dist/modal";
import CustomImage from "src/app/components/Image/CustomImage";
import { useAgora } from "src/app/hooks/useAgora";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RowContainer from "src/app/components/View/RowContainer";
import CommentCards from "src/app/components/Cards/CommentCards";
import GuestsList from "../components/GuestsList";
import tinycolor from "tinycolor2";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import NetInfo from "@react-native-community/netinfo";
import { Audio } from "expo-av";
import _ from "lodash";

const Tab = createMaterialTopTabNavigator();

type Props = NativeStackScreenProps<MainStackParamList, "PartyScreen">;

const GuestsListScreen: FunctionComponent<{
     guestList: User[];
     isMuted: boolean;
     toggleMute: () => void;
     party: any;
}> = ({ guestList, isMuted, toggleMute, party }) => {
     const renderItem: ListRenderItem<User> = ({ item }) => (
          <GuestsList
               item={item}
               isHost={party?.artist?._id === item?._id}
               toggleMute={toggleMute}
               isMuted={isMuted}
          />
     );

     return (
          <FlashList
               data={guestList}
               renderItem={renderItem}
               estimatedItemSize={200}
               numColumns={4}
               horizontal={false}
               style={{ borderWidth: 2, borderColor: "red" }}
               extraData={isMuted}
          />
     );
};

const CommentsScreen: FunctionComponent<{
     comments: FireStoreComments[];
     commentsRenderItem: ListRenderItem<FireStoreComments>;
}> = ({ comments, commentsRenderItem }) => (
     <View style={tw`flex-1 px-3`}>
          {comments.length === 0 ? (
               <View style={tw`justify-center items-center mt-30`}>
                    <LottieView
                         source={require("../../../assets/comments.json")}
                         style={tw`h-50 w-50`}
                         autoPlay={true}
                         loop={true}
                    />
                    <CustomText style={tw`text-center text-base mt-5`}>
                         Be the first to say something
                    </CustomText>
               </View>
          ) : (
               <FlashList
                    renderItem={commentsRenderItem}
                    estimatedItemSize={200}
                    data={comments}
                    renderScrollComponent={ScrollView}
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={tw`pb-20`}
               />
          )}
     </View>
);

const BounceButton: React.FC<{
     onPress: () => void;
     children: React.ReactNode;
     isRounded?: boolean;
}> = ({ onPress, children, isRounded }) => {
     const scale = useSharedValue(1);

     const animatedStyle = useAnimatedStyle(() => {
          return {
               transform: [{ scale: scale.value }],
          };
     });

     return (
          <Pressable
               onPressIn={() => {
                    scale.value = withSpring(0.8);
               }}
               onPressOut={() => {
                    scale.value = withSpring(1);
               }}
               onPress={onPress}
          >
               <Animated.View
                    style={[
                         animatedStyle,
                         tw`items-center justify-center ${
                              isRounded ? "rounded-full border border-grey2" : ""
                         } w-9 h-9`,
                    ]}
               >
                    {children}
               </Animated.View>
          </Pressable>
     );
};

const PartyScreen: FunctionComponent<Props> = ({ navigation, route }) => {
     const { party, partyBackgroundColor } = route.params;
     const { user } = useUser();
     const { isMuted, toggleMute, toggleIsSpeakerEnabled, leave, isSpeakerEnabled } = useAgora(
          party?._id,
     );
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
     const [guestList, setGuestList] = useState<User[]>([]);

     const [volume, setVolume] = useState<number>(0.5);
     const [comments, setComments] = useState<FireStoreComments[]>([]);
     const [isUploadingComment, setIsUploadingComment] = useState<boolean>(false);
     const commentRef = useRef<string>("");
     const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
     const [isEndPartyModalVisible, setIsEndPartyModalVisible] = useState<boolean>(false);
     const [isLeavePartyModalVisible, setIsLeavePartyModalVisible] = useState<boolean>(false);
     const [isEndingParty, setIsEndingParty] = useState<boolean>(false);
     const [isLeavingParty, setIsLeavingParty] = useState<boolean>(false);
     const [snapPointIndex, setSnapPointIndex] = useState(0);
     const [activeTabName, setActiveTabName] = useState<string>("");
     const [tabNavigation, setTabNavigation] = useState<any>(null);
     const [isPlaying, setIsPlaying] = useState<boolean>(false);
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
     const [snapIndexController, setSnapIndexController] = useState<any>(null);
     const [isHostNetworkUnstable, setIsHostNetworkUnstable] = useState<boolean>(false);
     const [isGuestNetworkUnstable, setIsGuestNetworkUnstable] = useState<boolean>(false);
     const [showLoading, setShowLoading] = useState<boolean>(false);
     const [isAlertShown, setIsAlertShown] = useState<boolean>(false);
     const sound = useRef<Audio.Sound | null>(null);
     const debouncedShowLoading = useMemo(() => _.debounce(setShowLoading, 500), []);

     const partyId = party?._id;

     const screenColors = {
          background:
               partyBackgroundColor?.platform === "android"
                    ? partyBackgroundColor?.average
                    : partyBackgroundColor?.background,
          detail:
               partyBackgroundColor?.platform === "android"
                    ? partyBackgroundColor?.darkVibrant
                    : partyBackgroundColor?.detail,
          accent:
               partyBackgroundColor?.platform === "android"
                    ? partyBackgroundColor?.darkMuted
                    : partyBackgroundColor?.detail,
     };

     const snapPoints = useMemo(() => [125, "65%"], []);
     const darkerAccentColor = tinycolor(screenColors?.background ?? screenColors?.accent)
          .darken(1)
          .toString();

     const openBottomSheet = () => {
          bottomSheetRef.current?.open();
     };

     const songs: Song[] = party?.songs;
     const isHost = party?.artist?._id === user?._id;

     const allTracks = useMemo(() => {
          return songs?.map((song) => ({
               genre: "",
               album: "",
               artwork: party?.albumPicture,
               duration: song?.duration,
               url: song?.file_url,
               id: song?._id,
               date: party?.date,
               title: song?.name,
               artist: party?.artist?.name,
               uri: song.file_url,
          }));
     }, [party?.artist?.name, party?.date, songs, party?.albumPicture]);

     const leaveParty = useCallback(async () => {
          setIsLeavingParty(true);
          try {
               leave();
               socket.emit("leave_party", {
                    party: partyId,
                    user,
               });
               const partyDocRef = doc(db, "party", partyId);
               await updateDoc(partyDocRef, {
                    participants: arrayRemove(user),
               });
               await api.post({
                    url: `parties/leave/${partyId}`,
                    requiresToken: true,
                    authorization: true,
               });

               navigation.navigate("BottomNavigator", {
                    screen: "Home",
               });
          } catch (error) {
               console.log(error);
          } finally {
               setIsLeavingParty(false);
          }
     }, [navigation, partyId, user, leave]);

     const leavePartyHandler = useCallback(async () => {
          if (sound.current) {
               await sound.current.unloadAsync();
          }

          await leaveParty();
          setIsLeavePartyModalVisible(false);
          await TrackPlayer.stop();
          await TrackPlayer.reset();
     }, [leaveParty]);

     const endPartyHandler = async () => {
          if (sound.current) {
               await sound.current.unloadAsync();
          }

          await endParty();
          setIsEndPartyModalVisible(false);
          await TrackPlayer.stop();
          await TrackPlayer.reset();
     };

     const fetchPartyGuests = useCallback(async () => {
          try {
               const partyDocRef = doc(db, "party", partyId);
               const unsubscribe = onSnapshot(partyDocRef, (doc) => {
                    const data = doc.data();
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
          if (party?._id) {
               const commentCollection = collection(db, `party/${party._id}/comments`);
               const q = query(commentCollection, orderBy("timestamp", "desc"));
               const unsubscribe = onSnapshot(q, async (querySnapshot) => {
                    const fetchedComments: any = await Promise.all(
                         querySnapshot.docs.map(async (doc) => {
                              const commentData = { ...doc.data(), commentId: doc.id };
                              const repliesCollection = collection(
                                   db,
                                   `party/${party?._id}/comments/${doc.id}/replies`,
                              );
                              const repliesSnapshot = await getDocs(repliesCollection);
                              const replies = repliesSnapshot.docs.map((replyDoc) => ({
                                   ...replyDoc.data(),
                                   commentId: replyDoc.id,
                              }));
                              return { ...commentData, replies };
                         }),
                    );
                    setComments(fetchedComments);
               });

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
               commentRef.current = "";
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
     }, [party?._id, user?._id, user?.image, user?.stageName, user?.name, commentRef]);

     const commentsRenderItem: ListRenderItem<FireStoreComments> = ({ item, index }) => {
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
               const partyDocRef = doc(db, "party", party?._id);
               await leave();
               await updateDoc(partyDocRef, {
                    participants: arrayRemove(user),
               });
               await api.post({
                    url: `parties/leave/${party?._id}`,
                    requiresToken: true,
                    authorization: true,
               });
               navigation.navigate("BottomNavigator", {
                    screen: "Home",
               });
          } catch (error) {
               console.log(error);
          } finally {
               setIsEndingParty(false);
          }
     };

     const loadTrack = async (index: number, play = false) => {
          setIsLoading(true);
          if (sound.current) {
               await sound.current.unloadAsync();
          }

          try {
               const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: allTracks[index].uri },
                    { shouldPlay: play },
               );
               sound.current = newSound;

               setCurrentTrackIndex(index);
          } catch (error) {
               console.error("Error loading track:", error);
          } finally {
               setIsLoading(false);
          }
     };

     const updatePlaybackState = async (stream: Stream) => {
          const partyDocRef = doc(db, "party", partyId);
          await updateDoc(partyDocRef, {
               playbackState: {
                    position: stream.position,
                    duration: stream.duration,
                    shouldPlay: stream.shouldPlay,
                    lastUpdated: moment().tz("UTC").format(),
                    uri: allTracks?.[currentTrackIndex],
               },
          });
     };

     useEffect(() => {
          if (isHost && sound.current) {
               sound.current.setOnPlaybackStatusUpdate(async (status) => {
                    if (status.isLoaded) {
                         if (status.didJustFinish && !status.isLooping) {
                              const nextTrackIndex = (currentTrackIndex + 1) % allTracks.length;
                              await loadTrack(nextTrackIndex);
                              setIsPlaying(false);
                         }
                         if (isHost && status.positionMillis) {
                              const stream: Stream = {
                                   position: status.positionMillis,
                                   duration: status.durationMillis,
                                   shouldPlay: isPlaying,
                              };
                              await updatePlaybackState(stream);
                         }
                    }
               });
          }
     }, [isHost, isPlaying, party._id, currentTrackIndex, allTracks]);

     const togglePlayPause = async () => {
          try {
               if (sound.current) {
                    debouncedShowLoading(true); // Start showing the loading indicator after the debounce delay
                    if (isPlaying) {
                         await sound.current.pauseAsync();
                         setIsPlaying(false);
                    } else {
                         await sound.current.playAsync();
                         setIsPlaying(true);
                    }
               }
          } catch (error) {
               console.error("Error during play/pause:", error);
               Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Playback Error",
                    textBody: "Unable to play the track. Please try again.",
               });
          } finally {
               debouncedShowLoading(false); // Stop showing the loading indicator
          }
     };

     const retryPlay = async (retries = 3) => {
          for (let i = 0; i < retries; i++) {
               try {
                    setIsLoading(true);
                    await sound.current?.playAsync();
                    setIsPlaying(true);
                    break; // Exit the loop if playback starts successfully
               } catch (error) {
                    console.error(`Retry ${i + 1} failed:`, error);
                    if (i === retries - 1) {
                         Toast.show({
                              type: ALERT_TYPE.DANGER,
                              title: "Playback Error",
                              textBody: "Failed to play the track after multiple attempts.",
                         });
                    }
               } finally {
                    setIsLoading(false);
               }
          }
     };

     // Play the previous track
     const handlePrevious = async () => {
          if (currentTrackIndex > 0) {
               loadTrack(currentTrackIndex - 1);
          }
     };

     // Play the next track
     const handleNext = async () => {
          if (currentTrackIndex < allTracks.length - 1) {
               loadTrack(currentTrackIndex + 1);
          }
     };

     // Adjust the volume
     const adjustVolume = async (value: number) => {
          setVolume(value);
          if (sound.current) {
               await sound.current.setVolumeAsync(value);
          }
     };

     const handlePlaybackFailure = () => {
          setIsAlertShown(true); // Set alert state to true

          Alert.alert(
               "Playback Error",
               "There was an issue syncing with the host. What would you like to do?",
               [
                    {
                         text: "Retry",
                         onPress: () => {
                              retryPlay();
                              setIsAlertShown(false);
                         },
                    },
                    {
                         text: "Leave Party",
                         onPress: () => {
                              leavePartyHandler();
                              setIsAlertShown(false);
                         },
                    },
               ],
               { cancelable: true },
          );
     };

     const debouncedHandlePlaybackFailure = _.debounce(handlePlaybackFailure, 3000);

     const loadSoundWithRetry = async (uri: string, retries = 3) => {
          for (let i = 0; i < retries; i++) {
               try {
                    await sound.current?.loadAsync({ uri });
                    return true;
               } catch (error) {
                    console.error(`Attempt ${i + 1} to load sound failed:`, error);
                    if (i === retries - 1) {
                         Toast.show({
                              type: ALERT_TYPE.DANGER,
                              title: "Playback Error",
                              textBody: "Failed to load the track after multiple attempts.",
                         });
                         return false;
                    }
               }
          }
          return false;
     };
     const listenToPlaybackState = () => {
          if (!isHost) {
               let retryCount = 0;
               const maxRetries = 20;

               const partyDocRef = doc(db, "party", partyId);
               const unsubscribe = onSnapshot(partyDocRef, async (doc) => {
                    try {
                         const data = doc.data();
                         const playbackState = data?.playbackState;

                         if (playbackState && sound.current) {
                              const status = await sound.current.getStatusAsync();
                              const isPlayingRemote = playbackState.shouldPlay;
                              const positionDifference = Math.abs(
                                   status.positionMillis - playbackState.position,
                              );

                              const currentTime = moment().tz("UTC");
                              const lastUpdateTime = moment(playbackState.lastUpdated);
                              const timeSinceLastUpdate = currentTime.diff(
                                   lastUpdateTime,
                                   "seconds",
                              );

                              // Check if the stream data is still being received
                              if (timeSinceLastUpdate > 5) {
                                   retryCount++;
                                   if (retryCount >= maxRetries) {
                                        Toast.show({
                                             type: ALERT_TYPE.WARNING,
                                             title: "Sync Issue",
                                             textBody: "Host's stream data seems to be delayed.",
                                        });
                                        handlePlaybackFailure();
                                        return;
                                   }
                                   return; // Skip further processing to retry
                              }

                              // Check if the sound is loaded before playing
                              if (!status.isLoaded) {
                                   debouncedShowLoading(true); // Show loading indicator
                                   const soundLoaded = await loadSoundWithRetry(playbackState.uri);
                                   if (!soundLoaded) {
                                        handlePlaybackFailure();
                                        return; // Exit early if loading fails
                                   }
                              }

                              // Adjust position if necessary
                              if (positionDifference > 500) {
                                   await sound.current.setPositionAsync(playbackState.position);
                              }

                              // Play or pause based on host's playback state
                              if (isPlayingRemote && !status.isPlaying) {
                                   retryCount++;
                                   await sound.current.playAsync();
                                   setIsPlaying(true);

                                   // Automatically dismiss the alert if it is shown
                                   if (isAlertShown) {
                                        setIsAlertShown(false);
                                        Alert?.dismiss();
                                   }
                              } else if (!isPlayingRemote && status.isPlaying) {
                                   await sound.current.pauseAsync();
                                   setIsPlaying(false);
                              }

                              // Reset the retry counter if playback is successful
                              if (status.isPlaying && retryCount > 0) {
                                   retryCount = 0;
                              }

                              debouncedShowLoading(false);
                         } else {
                              retryCount++;
                              if (retryCount >= maxRetries) {
                                   Toast.show({
                                        type: ALERT_TYPE.DANGER,
                                        title: "Playback Error",
                                        textBody: "Failed to retrieve playback data from the host.",
                                   });
                                   handlePlaybackFailure();
                              }
                         }
                    } catch (error) {
                         console.error("Error syncing playback:", error);
                         retryCount++;
                         if (retryCount >= maxRetries) {
                              Toast.show({
                                   type: ALERT_TYPE.DANGER,
                                   title: "Playback Error",
                                   textBody: "Failed to sync playback with the host. Retrying...",
                              });
                              handlePlaybackFailure();
                         }
                    } finally {
                         debouncedShowLoading(false); // Ensure the loading indicator is hidden
                    }
               });

               return () => unsubscribe();
          }
     };

     useEffect(() => {
          if (!isHost) {
               const unsubscribe = listenToPlaybackState();
               return () => unsubscribe();
          }
     }, [isHost, party._id]);

     useEffect(() => {
          if (allTracks.length > 0) {
               loadTrack(0);
          }
     }, [allTracks]);

     // Monitor network connectivity
     useEffect(() => {
          const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
               if (!state.isConnected) {
                    if (isHost) {
                         setIsHostNetworkUnstable(true);
                         socket.emit("host_network_unstable", {
                              party: party._id,
                              cmd: "host_network_unstable",
                         });
                    } else {
                         setIsGuestNetworkUnstable(true);
                    }
               } else {
                    setIsHostNetworkUnstable(false);
                    setIsGuestNetworkUnstable(false);
               }
          });

          return () => {
               unsubscribeNetInfo();
          };
     }, [isHost, party._id]);

     useEffect(() => {
          if (isGuestNetworkUnstable) {
               Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Network Issue",
                    textBody: "Your network is unstable. Reconnecting...",
               });

               // Try to reconnect and play the song if the host is playing
               if (!isHost && sound.current) {
                    sound.current.getStatusAsync().then((status) => {
                         if (!status.isPlaying && status.shouldPlay) {
                              sound.current.playAsync();
                         }
                    });
               }
          }

          if (isHostNetworkUnstable) {
               Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Network Issue",
                    textBody: "Host network is unstable.",
               });
          }
     }, [isGuestNetworkUnstable, isHostNetworkUnstable, isHost]);

     const handleCommentChange = (text: string) => {
          commentRef.current = text;
     };

     useEffect(() => {
          if (!isHost) {
               socket.emit("join_party", {
                    party: party._id,
                    user,
               });
          }
     }, [isHost, party?._id, user]);

     const arrowY = useSharedValue(0);
     const opacity = useSharedValue(1);

     const animatedArrowStyle = useAnimatedStyle(() => {
          return {
               transform: [{ translateY: arrowY.value }],
               opacity: opacity.value,
          };
     });

     useEffect(() => {
          if (snapPointIndex === 0) {
               arrowY.value = withRepeat(withTiming(-10, { duration: 1000 }), -1, true);
               opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true);
          } else {
               arrowY.value = 0;
               opacity.value = 1;
          }
     }, [snapPointIndex]);

     const openCommentsTab = useCallback(() => {
          if (tabNavigation && bottomSheetRef.current) {
               tabNavigation.navigate("Comments");
          }
          if (snapPointIndex === 0) {
               setSnapIndexController(1);
               setTimeout(() => tabNavigation?.navigate?.("Comments"), 5000);
          }
     }, [tabNavigation]);

     return (
          <LinearGradient style={tw`h-full flex-1 p-4`} colors={[darkerAccentColor, "#000"]}>
               <SafeAreaView style={tw`h-full flex-1`}>
                    <TouchableOpacity
                         style={tw` ${
                              Platform.OS === "android" ? "mt-6" : "mt-0"
                         } h-10 w-20 items-center justify-center self-end`}
                         onPress={() =>
                              isHost
                                   ? setIsEndPartyModalVisible(true)
                                   : setIsLeavePartyModalVisible(true)
                         }
                    >
                         <CustomText
                              style={{
                                   color: screenColors?.accent,
                                   fontWeight: "700",
                              }}
                         >
                              {isHost ? "End" : "Leave"}
                         </CustomText>
                    </TouchableOpacity>

                    <View style={tw`mt-8 mb-3 items-center`}>
                         <CustomImage
                              uri={party.albumPicture}
                              resizeMode="cover"
                              style={tw`h-60 w-60 rounded-lg`}
                         />
                         <View style={tw`mt-8 flex-row items-center justify-between`}>
                              <HighLightLeft />
                              <CustomText style={tw`font-poppinsBold w-10`}>LIVE</CustomText>
                              <Pressable onPress={() => openBottomSheet()}>
                                   <HighLightRight />
                              </Pressable>
                         </View>
                         {showLoading && (
                              <View style={tw`mt-4`}>
                                   <ActivityIndicator color="#FFFFFF" />
                                   <CustomText style={tw`mt-2`}>Syncing with host...</CustomText>
                              </View>
                         )}
                         {isHost && (
                              <RowContainer style={tw`mt-6 w-[60%] justify-around items-center`}>
                                   <Pressable onPress={handlePrevious}>
                                        <Icon
                                             icon="rewind"
                                             color="white"
                                             size={25}
                                             iconProvider="MaterialIcon"
                                        />
                                   </Pressable>
                                   <Pressable
                                        onPress={togglePlayPause}
                                        style={tw`w-10 items-center`}
                                   >
                                        {isLoading ? (
                                             <ActivityIndicator />
                                        ) : isPlaying ? (
                                             <PauseIcon />
                                        ) : (
                                             <PlayIcon />
                                        )}
                                   </Pressable>
                                   <Pressable onPress={handleNext}>
                                        <Icon
                                             icon="fast-forward"
                                             color="white"
                                             size={25}
                                             iconProvider="MaterialIcon"
                                        />
                                   </Pressable>
                              </RowContainer>
                         )}
                         <View style={tw`flex-row w-[90%] mt-6 items-center`}>
                              <Icon
                                   icon={"volume-mute"}
                                   color="white"
                                   iconProvider="MaterialIcon"
                              />
                              <Slider
                                   style={tw`w-70`}
                                   minimumValue={0}
                                   maximumValue={1}
                                   minimumTrackTintColor="#FFFFFF"
                                   maximumTrackTintColor="#000000"
                                   thumbTintColor="#FFFF"
                                   value={volume}
                                   onValueChange={(value) => adjustVolume(value)}
                              />
                              <Icon icon={"volume-up"} color="white" iconProvider="MaterialIcon" />
                         </View>
                    </View>
                    <FlashList
                         data={allTracks}
                         renderItem={({ item, index }) => (
                              <MusicList
                                   duration={item.duration}
                                   title={item.title}
                                   index={index}
                                   artist={item.artist}
                                   url={item.url}
                                   id={item.id}
                              />
                         )}
                         keyExtractor={(item) => item?.id}
                         estimatedItemSize={20}
                         estimatedListSize={{
                              height: 120,
                              width: Dimensions.get("screen").width,
                         }}
                         showsVerticalScrollIndicator={false}
                    />
               </SafeAreaView>

               {snapPointIndex > 0 && (
                    <Pressable
                         style={StyleSheet.absoluteFillObject}
                         onPress={() => {
                              setSnapIndexController(0);
                         }}
                    />
               )}

               <Modal
                    style={tw`flex-1 justify-center items-center`}
                    backdropOpacity={0.9}
                    onBackdropPress={() => setIsLeavePartyModalVisible(false)}
                    isVisible={isLeavePartyModalVisible}
               >
                    <View
                         style={tw`bg-white w-[80%] h-1/7 p-3 rounded-lg items-center justify-center`}
                    >
                         <CustomText style={tw`text-grey6 font-poppinsBold`}>
                              Are you sure you want to leave the party?
                         </CustomText>
                         <RowContainer style={tw`mt-3`}>
                              <Pressable
                                   onPress={() => setIsLeavePartyModalVisible(false)}
                                   style={tw`border w-15 items-center h-7 justify-center rounded-full border-grey4`}
                              >
                                   <CustomText style={tw`text-grey7 text-xs font-poppinsRegular`}>
                                        Stay
                                   </CustomText>
                              </Pressable>
                              <Pressable
                                   onPress={() => leavePartyHandler()}
                                   style={tw`w-15 items-center h-7 justify-center ml-4 rounded-full bg-purple`}
                              >
                                   {isLeavingParty ? (
                                        <ActivityIndicator />
                                   ) : (
                                        <CustomText
                                             style={tw`text-white text-xs font-poppinsRegular`}
                                        >
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
                    isVisible={isEndPartyModalVisible}
               >
                    <View
                         style={tw`bg-white w-[80%] h-1/7 p-3 rounded-lg items-center justify-center`}
                    >
                         <CustomText style={tw`text-grey6 font-poppinsBold`}>
                              Are you sure you want to end the party?
                         </CustomText>
                         <RowContainer style={tw`mt-3`}>
                              <Pressable
                                   onPress={() => setIsEndPartyModalVisible(false)}
                                   style={tw`border w-15 items-center h-7 justify-center rounded-full border-grey4`}
                              >
                                   <CustomText style={tw`text-grey7 text-xs font-poppinsRegular`}>
                                        Stay
                                   </CustomText>
                              </Pressable>
                              <Pressable
                                   disabled={isEndingParty}
                                   onPress={() => endPartyHandler()}
                                   style={tw`w-15 items-center h-7 justify-center ml-4 rounded-full bg-purple`}
                              >
                                   {isEndingParty ? (
                                        <ActivityIndicator color={"white"} />
                                   ) : (
                                        <CustomText
                                             style={tw`text-white text-xs font-poppinsRegular`}
                                        >
                                             End
                                        </CustomText>
                                   )}
                              </Pressable>
                         </RowContainer>
                    </View>
               </Modal>
               {snapPointIndex === 0 && (
                    <View
                         style={[
                              tw`absolute items-center justify-center flex transform w-100 h-4 `,
                              { marginBottom: 135, bottom: 0 },
                         ]}
                    >
                         <Animated.View
                              style={[
                                   tw`items-center justify-center flex transform -translate-x-1/2 h-6`,
                                   animatedArrowStyle,
                              ]}
                         >
                              <MaterialIcons name="keyboard-arrow-up" color="white" size={20} />
                              <MaterialIcons
                                   name="keyboard-arrow-up"
                                   color="white"
                                   size={25}
                                   style={{ marginTop: -12 }}
                              />
                              <MaterialIcons
                                   name="keyboard-arrow-up"
                                   color="white"
                                   size={30}
                                   style={{ marginTop: -15 }}
                              />
                         </Animated.View>
                    </View>
               )}
               <CustomBottomSheet
                    ref={bottomSheetRef}
                    customSnapPoints={snapPoints}
                    backgroundColor={"#000000"}
                    setSnapIndex={setSnapIndexController}
                    snapIndex={snapIndexController}
                    // footerComponent={renderBottomFooter}

                    footerComponent={() => (
                         <View style={[tw` z-20  bg-[#000000] w-full`]}>
                              <View style={[tw` justify-center w-full pb-4`]}>
                                   <RowContainer
                                        style={tw`justify-between px-3 items-center py-[10px] border-t border-grey2`}
                                   >
                                        <RowContainer
                                             style={tw`justify-between items-center w-1/3`}
                                        >
                                             <BounceButton onPress={toggleMute} isRounded>
                                                  {isMuted ? <MicMuteIcon /> : <MicUnmuteIcon />}
                                                  {/* <SoundTracker isMuted={isMuted} /> */}
                                             </BounceButton>
                                             <BounceButton
                                                  onPress={() => setIsHandRaised((prev) => !prev)}
                                                  isRounded
                                             >
                                                  {isHandRaised ? (
                                                       <HandRaisedIcon />
                                                  ) : (
                                                       <HandDownIcon />
                                                  )}
                                             </BounceButton>
                                             <BounceButton
                                                  onPress={toggleIsSpeakerEnabled}
                                                  isRounded
                                             >
                                                  <Icon
                                                       icon={
                                                            isSpeakerEnabled
                                                                 ? "volume-high"
                                                                 : "volume-low"
                                                       }
                                                       size={20}
                                                       color={isSpeakerEnabled ? "#fff" : "#ebebeb"}
                                                  />
                                             </BounceButton>
                                        </RowContainer>
                                        {activeTabName !== "Comments" && (
                                             <RowContainer
                                                  style={tw`justify-between items-center w-1/3`}
                                             >
                                                  <BounceButton onPress={() => {}}>
                                                       <Icon
                                                            icon={"gift-outline"}
                                                            color="grey"
                                                            size={20}
                                                       />
                                                  </BounceButton>
                                                  <BounceButton onPress={() => {}}>
                                                       <Icon
                                                            icon={"heart-outline"}
                                                            color="grey"
                                                            size={20}
                                                       />
                                                  </BounceButton>
                                                  <BounceButton onPress={openCommentsTab}>
                                                       <Icon
                                                            icon={"message-outline"}
                                                            color="grey"
                                                            size={25}
                                                       />
                                                  </BounceButton>
                                             </RowContainer>
                                        )}
                                   </RowContainer>
                                   {activeTabName === "Comments" && (
                                        <View
                                             style={[
                                                  tw`bg-inherit flex-row px-3 items-center py-3`,
                                             ]}
                                        >
                                             <View
                                                  style={[
                                                       tw` h-10 rounded-full border-grey4 flex-row px-3 items-center border `,
                                                  ]}
                                             >
                                                  <BottomSheetTextInput
                                                       placeholder="Add comment"
                                                       style={tw`text-white text-xs w-[90%] font-poppinsRegular`}
                                                       placeholderTextColor={"white"}
                                                       onChangeText={handleCommentChange}
                                                  />
                                                  <Pressable
                                                       disabled={isUploadingComment}
                                                       onPress={() => commentOnParty()}
                                                  >
                                                       {isUploadingComment ? (
                                                            <ActivityIndicator />
                                                       ) : (
                                                            <SendIcon />
                                                       )}
                                                  </Pressable>
                                             </View>
                                        </View>
                                   )}
                              </View>
                         </View>
                    )}
                    visibilityHandler={() => {}}
                    onChange={(index: number) => setSnapPointIndex(index)}
               >
                    {snapPointIndex > 0 && (
                         <NavigationContainer
                              independent={true}
                              onStateChange={(state) => {
                                   const activeRoute = state?.routes[state.index];
                                   setActiveTabName((activeRoute?.name as string) ?? "");
                              }}
                         >
                              <Tab.Navigator
                                   tabBar={({ navigation, state }) => {
                                        setTabNavigation(navigation);

                                        return (
                                             <RowContainer
                                                  style={tw`items-center mt-5 justify-center`}
                                             >
                                                  {Array.from(
                                                       { length: state.routes.length },
                                                       (_, key) => (
                                                            <Pressable
                                                                 key={key}
                                                                 onPress={() => {
                                                                      navigation.navigate(
                                                                           state.routes[key].name,
                                                                      );
                                                                 }}
                                                                 style={tw`px-1 py-1`}
                                                            >
                                                                 <View
                                                                      key={key}
                                                                      style={tw`h-1 w-12 rounded-lg bg-${
                                                                           state.index === key
                                                                                ? "white"
                                                                                : "grey2"
                                                                      }`}
                                                                 />
                                                            </Pressable>
                                                       ),
                                                  )}
                                             </RowContainer>
                                        );
                                   }}
                              >
                                   <Tab.Screen name="Guests">
                                        {() => (
                                             <View
                                                  style={{
                                                       backgroundColor: "#000000",
                                                       height: "100%",
                                                  }}
                                             >
                                                  <GuestsListScreen
                                                       guestList={guestList}
                                                       isMuted={isMuted}
                                                       toggleMute={toggleMute}
                                                       party={party}
                                                  />
                                             </View>
                                        )}
                                   </Tab.Screen>
                                   <Tab.Screen name="Comments">
                                        {() => (
                                             <View
                                                  style={{
                                                       backgroundColor: "#000000",
                                                       height: "100%",
                                                  }}
                                             >
                                                  <CommentsScreen
                                                       comments={comments}
                                                       commentsRenderItem={commentsRenderItem}
                                                  />
                                             </View>
                                        )}
                                   </Tab.Screen>
                              </Tab.Navigator>
                         </NavigationContainer>
                    )}
               </CustomBottomSheet>
          </LinearGradient>
     );
};

export default PartyScreen;
