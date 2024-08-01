/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
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
import useMusicPlayer from "src/app/hooks/useMusicPlayer";
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
     onSnapshot,
     orderBy,
     query,
     updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { BottomSheetFooter, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import LottieView from "lottie-react-native";
import Animated, {
     interpolate,
     runOnJS,
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
     const utcTimeStamp = moment().tz("UTC");
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
     const [snapIndexController, setSnapIndexController] = useState<any>(null);

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
          await leaveParty();
          setIsLeavePartyModalVisible(false);
          await TrackPlayer.stop();
          await TrackPlayer.reset();
     }, [leaveParty]);

     const endPartyHandler = async () => {
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
          const previousState = await getPlaybackState();

          try {
               await handlePauseAndPlayTrack();
               await new Promise((resolve) => setTimeout(resolve, 100));
               const currentState = await getPlaybackState();

               if (currentState !== previousState) {
                    socket.emit("play", {
                         cmd: "play",
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
               socket.emit("previous", {
                    party: party?._id,
                    timeStamp: utcTimeStamp,
                    cmd: "previous",
               });
          });
     };

     const handleNext = async () => {
          await skipToNext().then(() => {
               socket.emit("forward", {
                    party: party?._id,
                    cmd: "forward",
                    timeStamp: utcTimeStamp,
               });
          });
     };

     const buffering = isSameQueue && playerState === "buffering";

     const handleSameQueueItemState = useCallback(async () => {
          const sameQueue = await checkIfTrackQueueIsDifferent();
          setIsSameQueue(sameQueue);
          return sameQueue;
     }, [checkIfTrackQueueIsDifferent]);

     useEffect(() => {
          handleSameQueueItemState();
     }, [handleSameQueueItemState]);

     let IconComponent;

     if (isSameQueue && playerState === "playing") {
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
               const currentTime = moment().tz("UTC");
               const eventTime = moment.tz(data.timeStamp, "UTC");
               const timeDifference = moment(currentTime).diff(eventTime) / 1000;

               const playBackState = await getPlaybackState();
               if (isHost) {
                    return;
               }
               switch (data.cmd) {
                    case "play":
                         if (playBackState.state === State.Playing) {
                              await TrackPlayer.pause().then((res) => console.log("pause", res));
                         } else {
                              await TrackPlayer.play().then((res) => console.log(res));
                              await TrackPlayer.seekTo(timeDifference);
                         }
                         break;
                    case "stop":
                         await TrackPlayer.stop();
                         break;
                    case "previous":
                         await TrackPlayer.skipToPrevious();
                         await TrackPlayer.seekTo(timeDifference);
                         break;
                    case "forward":
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
          socket.on("receive", handleSocketEvents);

          return () => {
               TrackPlayer.stop();
               TrackPlayer.reset();
               socket.off("receive", handleSocketEvents);
          };
     }, [isHost, mountTrackForGuests, handleSocketEvents]);

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
                         {isHost && (
                              <RowContainer style={tw`mt-6 w-[60%] justify-around items-center`}>
                                   <Pressable onPress={handlePrevious}>
                                        <Icon icon="rewind" color="white" size={25} />
                                   </Pressable>
                                   <Pressable
                                        onPress={() => handlePlay()}
                                        style={tw`w-10 items-center`}
                                   >
                                        {IconComponent}
                                   </Pressable>
                                   <Pressable onPress={handleNext}>
                                        <Icon icon="fast-forward" color="white" size={25} />
                                   </Pressable>
                              </RowContainer>
                         )}
                         <View style={tw`flex-row w-[90%] mt-6 items-center`}>
                              <Icon icon={"volume-low"} color="white" />
                              <Slider
                                   style={tw`w-70`}
                                   minimumValue={0}
                                   maximumValue={1}
                                   minimumTrackTintColor="#FFFFFF"
                                   maximumTrackTintColor="#000000"
                                   thumbTintColor="#FFFF"
                                   onValueChange={(value) => setVolume(value)}
                              />
                              <Icon icon={"volume-medium"} color="white" />
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
                                                       color={isSpeakerEnabled ? "white" : "grey"}
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
