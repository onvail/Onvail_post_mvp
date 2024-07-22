import React, {
     FunctionComponent,
     useCallback,
     useEffect,
     useLayoutEffect,
     useMemo,
     useRef,
     useState,
} from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity, Vibration, View } from "react-native";
import UserHeader from "./UserHeader";
import tw from "src/lib/tailwind";
import CustomText from "components/Text/CustomText";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { generalIcon } from "components/Icons/generalIcons";
import RowContainer from "components/View/RowContainer";
import MiniMusicPlayer from "./MiniMusicPlayer";
import { PartiesResponse } from "src/types/partyTypes";
import Icon from "../Icons/Icon";
import api from "src/api/api";
import useUser, { User } from "src/app/hooks/useUserInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getColors } from "react-native-image-colors";
import { ColorScheme } from "src/app/navigator/types/MainStackParamList";
import { AVPlaybackStatusSuccess, Audio } from "expo-av";
import { leaveParty } from "src/actions/parties";
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import useWebrtc from "src/app/hooks/useWebrtc";
import CustomImage from "../Image/CustomImage";
import { useAgora } from "src/app/hooks/useAgora";
// import * as Animatable from "react-native-animatable";
import Animated, {
     useAnimatedStyle,
     useSharedValue,
     withRepeat,
     withSequence,
     withSpring,
     withTiming,
} from "react-native-reanimated";
import { TapGestureHandler, TouchableWithoutFeedback } from "react-native-gesture-handler";
import LoveOverlay from "../LoveOverlay/LoveOverlay";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

interface JoinPartyProps {
     handleJoinPartyBtnPress: (party: PartiesResponse, albumBackgroundColor: ColorScheme) => void;
     party: PartiesResponse;
}

/**
 * JoinParty Button component
 * @param handleJoinPartyBtnPress
 * @returns Functional component in the form of a button
 */
const JoinPartyButton: FunctionComponent<JoinPartyProps> = ({ handleJoinPartyBtnPress, party }) => {
     const { user } = useUser();
     const isHost = party?.artist?._id === user?._id;
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [albumBackgroundColor, setAlbumBackgroundColor] = useState<ColorScheme>(
          {} as ColorScheme,
     );
     const [partyTrackWithDuration, setPartyTrackWithDuration] = useState<PartiesResponse>(party);

     const { join } = useAgora(party?._id);

     const handleSongsDuration = useCallback(async () => {
          const sound = new Audio.Sound();
          const songs = party?.songs?.map(async (item) => {
               try {
                    const songResponse = await sound.loadAsync({
                         uri: item.file_url,
                    });
                    const songDetails: AVPlaybackStatusSuccess =
                         songResponse as AVPlaybackStatusSuccess;
                    const duration = songDetails?.durationMillis ?? 0;

                    return {
                         ...item,
                         duration: duration,
                    };
               } catch (error) {
                    return {
                         ...item,
                         duration: 0,
                    };
               }
          });
          const updatedSongs = await Promise.all(songs);
          setPartyTrackWithDuration({
               ...party,
               songs: updatedSongs,
          });
     }, [party]);

     useLayoutEffect(() => {
          handleSongsDuration();
     }, [handleSongsDuration]);

     const fetchAlbumBackgroundColor = useMemo(async () => {
          try {
               const colors = await getColors(party.albumPicture, {
                    fallback: "#228B22",
                    cache: true,
                    key: party.albumPicture,
               });
               return colors;
          } catch (error) {
               console.log(error);
          }
     }, [party?.albumPicture]);

     useEffect(() => {
          const fetchBackgroundColor = async () => {
               const colors = await fetchAlbumBackgroundColor;
               const itemBackgroundColor = colors as ColorScheme;
               setAlbumBackgroundColor(itemBackgroundColor);
          };

          fetchBackgroundColor();
     }, [fetchAlbumBackgroundColor]);

     const partyActionText = () => {
          if (isHost) {
               return "Start Party";
          } else {
               return "Join the party";
          }
     };

     const startParty = async () => {
          setIsLoading(true);
          try {
               const partyDocRef = doc(db, "party", party?._id);
               await updateDoc(partyDocRef, {
                    participants: arrayUnion(user),
                    is_started: true,
               });
               await join();
               await api.patch({
                    url: `parties/start-party/${party?._id}`,
                    requiresToken: true,
                    authorization: true,
               });
               handleJoinPartyBtnPress(partyTrackWithDuration, albumBackgroundColor);
          } catch (error) {
               console.log(error);
          } finally {
               setIsLoading(false);
          }
     };

     const joinParty = async () => {
          setIsLoading(true);
          try {
               const partyDocRef = doc(db, "party", party?._id);
               const partyData = (await getDoc(partyDocRef)).data();
               if (partyData?.is_started) {
                    await updateDoc(partyDocRef, {
                         participants: arrayUnion(user),
                    });
                    await join();
                    await api.post({
                         url: `parties/join-party/${party?._id}`,
                         requiresToken: true,
                         authorization: true,
                    });
                    handleJoinPartyBtnPress(partyTrackWithDuration, albumBackgroundColor);
               } else {
                    Toast.show({
                         type: ALERT_TYPE.DANGER,
                         title: "Can't join party",
                         textBody: "The party has ended",
                         titleStyle: tw`font-poppinsRegular text-xs`,
                         textBodyStyle: tw`font-poppinsRegular text-xs`,
                    });
               }
          } catch (error) {
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <View style={tw`bg-white w-28 py-1.7 px-3 rounded-full`}>
               {isLoading ? (
                    <ActivityIndicator color={"black"} />
               ) : (
                    <TouchableOpacity
                         style={tw`items-center justify-center`}
                         onPress={() => (isHost ? startParty() : joinParty())}
                    >
                         <CustomText style={tw`text-primary text-[11px] font-poppinsMedium`}>
                              {partyActionText()}
                         </CustomText>
                    </TouchableOpacity>
               )}
          </View>
     );
};

/**
 * Post Item component
 * @returns Functional component rendered as individual posts
 */

interface PostItemProps {
     item: PartiesResponse;
     userId: string;
     handleJoinPartyBtnPress: (item: PartiesResponse, albumBackgroundColor: ColorScheme) => void;
}

const PostItem: FunctionComponent<{
     item: PartiesResponse;
     userId: string;
     handleJoinPartyBtnPress: (item: PartiesResponse, albumBackgroundColor: ColorScheme) => void;
}> = ({ item, handleJoinPartyBtnPress, userId }) => {
     const CommentSvg = generalIcon.Comment;
     const PartyJoinersIcon = generalIcon.PartyJoinersIcon;
     const queryClient = useQueryClient();
     const partyId = item?._id;
     const canFollowUser = item?.artist?._id !== userId;
     const isFollowing = item?.artist?.followers?.includes(userId);
     const [isLiked, setLiked] = useState<boolean>(false);
     const [likeCount, setLikeCount] = useState<number>(item?.likes?.length ?? 0);
     const [guestList, setGuestList] = useState<User[]>([]);
     const [partyStarted, setPartyStarted] = useState<boolean>(false);
     const [loveVisible, setLoveVisible] = useState<boolean>(false);

     useEffect(() => {
          if (userId) {
               setLiked(item?.likes?.some((likes) => likes?._id === userId));
          }
     }, [userId, item?.likes]);

     const handleFollowMutation = useMutation({
          mutationFn: () => {
               return isFollowing
                    ? api.post({
                           url: "users/unFollowUser",
                           authorization: true,
                           data: { userIdToUnfollow: item?.artist?._id },
                      })
                    : api.post({
                           url: "users/followUser",
                           authorization: true,
                           data: { userIdToFollow: item?.artist?._id },
                      });
          },
          onSuccess: () => {
               queryClient.refetchQueries({ queryKey: ["parties"] });
          },
     });

     const handleLikeMutation = useMutation({
          mutationFn: async () => {
               if (isLiked) {
                    const response = await api.post({
                         url: `/parties/unlike-party/${item?._id}`,
                         authorization: true,
                    });
                    return response;
               } else {
                    const response = await api.post({
                         url: `/parties/like-party/${item?._id}`,
                         authorization: true,
                    });
                    return response;
               }
          },
          onSuccess: (data, variables, context) => {
               setLiked(!isLiked);
               setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
               if (!isLiked) {
                    Vibration.vibrate();
               }
               // queryClient.refetchQueries({ queryKey: ["parties"] });
          },
          onError: (error, variables, context) => {
               console.error("Error in liking/unliking party:", error);
               setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
               setLiked(!isLiked);
          },
     });

     useEffect(() => {
          const callDoc = doc(db, "calls", partyId);
          const unsubscribe = onSnapshot(callDoc, (snapshot) => {
               if (snapshot.exists()) {
                    const data = snapshot.data();
                    setPartyStarted(data?.callStarted ?? false);
               } else {
                    console.log("Document does not exist");
                    setPartyStarted(false);
               }
          });
          return () => unsubscribe();
     }, [partyId]);

     const fetchPartyGuests = useCallback(async () => {
          try {
               const partyDocRef = doc(db, "party", partyId);
               const unsubscribe = onSnapshot(partyDocRef, (doc) => {
                    const data = doc.data();
                    setGuestList(data?.participants ?? []);
               });
               return () => unsubscribe();
          } catch (error) {
               console.error(error);
          }
     }, [partyId]);

     useEffect(() => {
          fetchPartyGuests();
     }, [fetchPartyGuests]);

     const scale = useSharedValue(1);
     const liveOpacity = useSharedValue(1);
     const liveScale = useSharedValue(1);

     useEffect(() => {
          if (partyStarted) {
               liveOpacity.value = withRepeat(
                    withSequence(
                         withTiming(0.5, { duration: 500 }),
                         withTiming(1, { duration: 500 }),
                    ),
                    -1,
                    true,
               );
               liveScale.value = withRepeat(
                    withSequence(
                         withTiming(1.2, { duration: 500 }),
                         withTiming(1, { duration: 500 }),
                    ),
                    -1,
                    true,
               );
          }
     }, [partyStarted, liveOpacity, liveScale]);

     const likeAnimatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
     }));

     const liveAnimatedStyle = useAnimatedStyle(() => ({
          opacity: liveOpacity.value,
          transform: [{ scale: liveScale.value }],
     }));

     const handleLikePress = useCallback(() => {
          scale.value = withSpring(1.5, {}, () => {
               scale.value = withSpring(1);
          });
          handleLikeMutation.mutate();
          setLoveVisible(true);
     }, [handleLikeMutation, scale]);

     const handleLoveAnimationEnd = useCallback(() => {
          setLoveVisible(false);
     }, []);

     return (
          <View style={tw`mb-4 pb-2`}>
               <UserHeader
                    name={item?.artist?.name}
                    uri={item?.artist?.image}
                    handleFollowBtnPress={() => handleFollowMutation.mutate()}
                    canFollow={canFollowUser}
                    isFollowing={isFollowing}
               />
               <TapGestureHandler numberOfTaps={2} onActivated={handleLikePress}>
                    <View style={tw`self-center relative rounded-lg mx-8 mt-2 w-full`}>
                         <LoveOverlay
                              visible={loveVisible}
                              onAnimationEnd={handleLoveAnimationEnd}
                         />
                         {partyStarted && (
                              <RowContainer
                                   style={tw`flex-row justify-between items-center w-full absolute px-3 top-2 left-0 z-20`}
                              >
                                   <Animated.View
                                        style={[
                                             tw`bg-[#D92A2A] rounded-20 h-10 w-20 items-center justify-center mt-1`,
                                             liveAnimatedStyle,
                                        ]}
                                   >
                                        <CustomText style={tw`text-xs`}>Live</CustomText>
                                   </Animated.View>
                                   <RowContainer
                                        style={tw`bg-primary opacity-70 rounded-20 h-12 w-22 justify-center`}
                                   >
                                        <PartyJoinersIcon />
                                        <CustomText style={tw`text-xs text-white ml-1`}>
                                             {guestList.length}
                                        </CustomText>
                                   </RowContainer>
                              </RowContainer>
                         )}
                         <CustomImage
                              uri={item?.albumPicture}
                              style={tw`h-100 w-full rounded-4`}
                              resizeMode="cover"
                         />
                         <RowContainer
                              style={tw`bg-[#00000080] rounded-b-4 flex-row justify-between items-center absolute w-full h-19 px-2 bottom-0 left-0 z-20`}
                         >
                              <View>
                                   <CustomText style={tw`text-[12px] text-white font-medium`}>
                                        LIVE . 15:00-17:00
                                   </CustomText>
                                   <CustomText style={tw`text-[15px] text-white font-medium`}>
                                        {item?.partyDesc}
                                   </CustomText>
                              </View>
                              <JoinPartyButton
                                   party={item}
                                   handleJoinPartyBtnPress={(party, albumBackgroundColor) =>
                                        handleJoinPartyBtnPress(party, albumBackgroundColor)
                                   }
                              />
                         </RowContainer>
                    </View>
               </TapGestureHandler>

               <CustomText style={tw`mt-2 w-full px-2 mx-auto text-[11px]`}>
                    {item?.partyDesc}
               </CustomText>

               <RowContainer style={tw`mx-[7px] mt-4 justify-between`}>
                    <RowContainer>
                         <Animated.View style={[tw`items-center`, likeAnimatedStyle]}>
                              <TouchableOpacity
                                   onPressIn={handleLikePress}
                                   style={tw`items-center`}
                              >
                                   <RowContainer style={tw`mr-5`}>
                                        <Icon
                                             icon={isLiked ? "heart" : "heart-outline"}
                                             color={isLiked ? "red" : "white"}
                                             size={24}
                                        />
                                        <CustomText style={tw`ml-2 text-grey2`}>
                                             {likeCount}
                                        </CustomText>
                                   </RowContainer>
                              </TouchableOpacity>
                         </Animated.View>
                         <RowContainer style={tw`mt-1`}>
                              <CommentSvg />
                              <CustomText style={tw`ml-2 text-grey2`}>
                                   {item?.comments?.length ?? 0}
                              </CustomText>
                         </RowContainer>
                    </RowContainer>
               </RowContainer>
          </View>
     );
};
/**
 * Post Card
 * @param handleJoinPartyBtnPress
 * @returns FlashList component that renders posts vertically.
 */

interface PostCardProps {
     handleJoinPartyBtnPress: (item: PartiesResponse, albumBackgroundColor: string) => void;
     data: PartiesResponse[];
     onScroll: (event: any) => void;
}

const PostCard: FunctionComponent<PostCardProps> = ({
     handleJoinPartyBtnPress,
     data = [],
     onScroll,
}) => {
     const { user } = useUser();
     const ITEM_SIZE = 600;

     const renderItem: ListRenderItem<PartiesResponse> = ({ item, index }) => {
          const opacityInputRange = [-1, 0, index * ITEM_SIZE, (index + 1.3) * ITEM_SIZE];

          return (
               <Animated.View>
                    <PostItem
                         item={item}
                         handleJoinPartyBtnPress={(partyItem, albumBackgroundColor) =>
                              handleJoinPartyBtnPress(partyItem, albumBackgroundColor as any)
                         }
                         userId={user?._id ?? ""}
                    />
               </Animated.View>
          );
     };

     const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

     const renderFooterComponent = () => <View style={tw`h-12`} />;
     const reversedItems = Array.isArray(data) ? [...data].reverse() : [];

     return (
          <AnimatedFlashList
               data={reversedItems}
               renderItem={renderItem as any}
               estimatedItemSize={300}
               bounces={false}
               onScroll={onScroll} // Pass onScroll prop to AnimatedFlashList
               scrollEventThrottle={16}
               showsHorizontalScrollIndicator={false}
               ListFooterComponent={renderFooterComponent}
               contentContainerStyle={tw`px-4 pb-12`}
          />
     );
};
export default PostCard;
