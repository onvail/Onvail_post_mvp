import React, { FunctionComponent, useState } from "react";
import { Dimensions, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { generalIcon } from "src/app/components/Icons/generalIcons";
import PostCard from "src/app/components/Posts/PostCard";
import ScreenContainer from "src/app/components/Screens/ScreenContainer";
import Status from "src/app/components/Status/Status";
import RowContainer from "src/app/components/View/RowContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import tw from "src/lib/tailwind";
import CustomText from "src/app/components/Text/CustomText";
import Animated, {
     useAnimatedScrollHandler,
     useSharedValue,
     useAnimatedStyle,
     withTiming,
     runOnJS,
} from "react-native-reanimated";
import { BottomTabParamList } from "src/app/navigator/types/BottomTabParamList";
import { useQuery } from "@tanstack/react-query";
import { fetchParties, fetchPosts } from "src/actions/parties";
import Feeds from "src/app/components/Feed/screens/Feeds";
import { Avatar } from "react-native-paper";
import { Colors } from "src/app/styles/colors";
import useUser from "src/app/hooks/useUserInfo";
import CustomImage from "src/app/components/Image/CustomImage";
import HomeSkeletonPlaceHolder from "src/app/components/Screens/HomeSkeletonPlaceHolder";

type Props = NativeStackScreenProps<BottomTabParamList, "Home">;
const Home: FunctionComponent<Props> = ({ navigation }) => {
     const LogoSvg = generalIcon.Logo;
     const NotificationBellSvg = generalIcon.NotificationBell;
     type Tabs = "Parties" | "Feeds";
     const tabs: Tabs[] = ["Parties", "Feeds"];
     const [selectedTab, setSelectedTab] = useState<Tabs>("Parties");
     const [scroll, setScroll] = useState(false);
     const { user } = useUser();

     const handleTabSwitch = (item: Tabs) => {
          setSelectedTab(item);
          headerTranslateY.value = withTiming(0, { duration: 200 });
          tabTranslateY.value = withTiming(0, { duration: 200 });
          position.value = 0;
          scrollY.value = 0;
     };

     const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

     const { data: partiesData, isLoading: loadingParties } = useQuery({
          queryKey: ["parties"],
          queryFn: fetchParties,
     });

     const { data: postsData, isLoading: loadingPosts } = useQuery({
          queryKey: ["posts"],
          queryFn: fetchPosts,
     });

     const isLoading = loadingParties || loadingPosts;

     const scrollY = useSharedValue(0);
     const headerTranslateY = useSharedValue(0);
     const tabTranslateY = useSharedValue(0);
     const position = useSharedValue(0);

     const scrollHandler = useAnimatedScrollHandler({
          onScroll: (event) => {
               const currentScrollY = event.contentOffset.y;
               const diffY = currentScrollY - scrollY.value;

               if (diffY > 15) {
                    headerTranslateY.value = withTiming(-100, { duration: 300 });
                    tabTranslateY.value = withTiming(-20, { duration: 300 });
                    position.value = 1;
               } else if (diffY < -15) {
                    headerTranslateY.value = withTiming(0, { duration: 300 });
                    tabTranslateY.value = withTiming(0, { duration: 300 });
                    position.value = 0;
               }

               scrollY.value = currentScrollY;
          },
     });

     const headerStyle = useAnimatedStyle(() => {
          return {
               transform: [{ translateY: headerTranslateY.value }],
               position: position.value === 0 ? "relative" : "absolute",
          };
     });

     const statusStyle = useAnimatedStyle(() => {
          return {
               opacity: headerTranslateY.value <= -60 ? 0 : 1,
          };
     });

     const tabStyle = useAnimatedStyle(() => {
          return {
               transform: [{ translateY: tabTranslateY.value }],
          };
     });

     return (
          <ScreenContainer>
               <View style={tw`flex-1`}>
                    <Animated.View style={[tw`mx-3`]}>
                         <RowContainer style={tw`justify-between items-center`}>
                              <RowContainer style={tw`flex-row items-center`}>
                                   <LogoSvg width={120} height={50} style={styles.logo} />
                                   <View
                                        style={{
                                             ...tw`h-[18px] rounded-[9px] bg-[#313131] justify-center items-center pl-2 pr-2`,
                                             ...styles.freePlanText,
                                        }}
                                   >
                                        <CustomText style={tw`text-white text-[8px] font-normal`}>
                                             Free plan
                                        </CustomText>
                                   </View>
                              </RowContainer>
                              <RowContainer style={tw`flex-row items-center mb-2`}>
                                   <NotificationBellSvg
                                        onPress={() =>
                                             navigation.navigate("MainAppNavigator", {
                                                  screen: "Notifications",
                                             })
                                        }
                                        style={tw`ml-1 mr-4`}
                                        width={16.04}
                                        height={19.15}
                                   />
                                   <Pressable
                                        onPress={() =>
                                             navigation.navigate("MainAppNavigator", {
                                                  screen: "Settings",
                                             })
                                        }
                                   >
                                        {user?.image && user?.image?.length > 0 ? (
                                             <CustomImage
                                                  uri={user?.image}
                                                  style={tw`h-[31px] w-[31px] rounded-full`}
                                             />
                                        ) : (
                                             <Avatar.Text
                                                  label={user?.name?.substring(0, 1) ?? ""}
                                                  style={tw`bg-purple w-[31px] h-[31px] p-1`}
                                                  labelStyle={tw`font-poppinsBold text-base text-[20px]`}
                                                  color={Colors.white}
                                             />
                                        )}
                                   </Pressable>
                              </RowContainer>
                         </RowContainer>
                    </Animated.View>
                    <Animated.View style={[tw``, headerStyle]}>
                         <Animated.View style={[tw``, statusStyle]}>
                              <RowContainer style={tw`flex-row items-center px-3`}>
                                   <Status />
                              </RowContainer>
                         </Animated.View>
                         <Animated.View
                              style={[
                                   tw`items-center flex-row p-1 self-center rounded-full justify-center my-4 bg-grey6`,
                                   tabStyle,
                              ]}
                         >
                              {tabs.map((item) => {
                                   const isActive = item === selectedTab;
                                   const background = isActive ? "white" : "transparent";
                                   const text = isActive ? "black" : "white";
                                   return (
                                        <AnimatedButton
                                             onPress={() => handleTabSwitch(item)}
                                             style={[
                                                  tw`h-[27px] p-1 px-6 rounded-full bg-${background} justify-center items-center`,
                                             ]}
                                             key={item}
                                        >
                                             <CustomText
                                                  style={tw`text-${text} text-[12px] font-medium `}
                                             >
                                                  {item}
                                             </CustomText>
                                        </AnimatedButton>
                                   );
                              })}
                         </Animated.View>
                    </Animated.View>
                    <View
                         style={{
                              ...tw`flex-1 ${
                                   scroll ? "absolute top-0 bottom-0 right-0 left-0" : ""
                              }`,
                              ...{ zIndex: -1 },
                         }}
                    >
                         {isLoading ? (
                              <Animated.ScrollView
                                   contentContainerStyle={tw`px-2`}
                                   onScroll={scrollHandler}
                                   scrollEventThrottle={16}
                              >
                                   {Array.from({ length: 10 }, (_, key) => (
                                        <HomeSkeletonPlaceHolder key={key} />
                                   ))}
                              </Animated.ScrollView>
                         ) : (
                              <>
                                   {selectedTab === "Parties" && (
                                        <PostCard
                                             handleJoinPartyBtnPress={(
                                                  item,
                                                  partyBackgroundColor,
                                             ) => {
                                                  navigation.navigate("MainAppNavigator", {
                                                       screen: "PartyScreen",
                                                       params: {
                                                            party: item,
                                                            partyBackgroundColor:
                                                                 partyBackgroundColor,
                                                       },
                                                  });
                                             }}
                                             data={partiesData}
                                             onScroll={scrollHandler}
                                        />
                                   )}
                                   {selectedTab === "Feeds" && (
                                        <Feeds data={postsData} /> // Pass scroll handler to Feeds
                                   )}
                              </>
                         )}
                    </View>
               </View>
          </ScreenContainer>
     );
};

const styles = StyleSheet.create({
     logo: {
          marginLeft: -14,
     },
     freePlanText: { marginLeft: -10, marginTop: -8 },
});
export default Home;
