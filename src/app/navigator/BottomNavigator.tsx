import React, { FC, useRef, useEffect, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, Easing } from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import { Colors } from "app/styles/colors";
import { generalIcon } from "app/components/Icons/generalIcons";
import Home from "app/home/screens/Home";
import Profile from "app/profile/screen/Profile";
import { BottomTabParamList } from "./types/BottomTabParamList";
import { SvgProps } from "react-native-svg";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import CustomOnvailButton from "app/components/Buttons/CustomOnvailBtn";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import tw from "src/lib/tailwind";
import MainNavigator from "./MainNavigator";

const HomeSvg = generalIcon.Home;
const ProfileSvg = generalIcon.Profile;
const ReloadingIconSvg = generalIcon.Refresh; // Replace with your actual reloading icon

interface ScreenDef {
     name: keyof BottomTabParamList;
     component: React.ComponentType<any>;
     position: "LEFT" | "RIGHT" | "CENTER";
     icon: FC<SvgProps> | null;
}

const tabs: ScreenDef[] = [
     {
          name: "Home",
          component: Home,
          icon: HomeSvg,
          position: "LEFT",
     },
     {
          name: "Profile",
          component: Profile,
          icon: ProfileSvg,
          position: "RIGHT",
     },
     {
          name: "MainAppNavigator",
          component: MainNavigator,
          icon: null,
          position: "CENTER",
     },
];

interface TabBarProps {
     routeName: string;
     selectedTab: string;
     navigate: (selectedTab: string) => void;
     refreshing: boolean;
     setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeIcon: FC<{
     refreshing: boolean;
     setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ refreshing, setRefreshing }) => {
     const rotateAnim = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          if (refreshing) {
               Animated.loop(
                    Animated.timing(rotateAnim, {
                         toValue: 1,
                         duration: 1500,
                         easing: Easing.linear,
                         useNativeDriver: true,
                    }),
               ).start();
          } else {
               rotateAnim.stopAnimation();
               rotateAnim.setValue(0);
          }

          const refreshId = setTimeout(() => setRefreshing(false), 1500);
          return () => clearTimeout(refreshId);
     }, [refreshing]);

     if (refreshing) {
          return (
               <Animated.View
                    style={{
                         transform: [
                              {
                                   rotate: rotateAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["-120deg", "-60deg"],
                                   }),
                              },
                         ],
                    }}
               >
                    <ReloadingIconSvg />
               </Animated.View>
          );
     }

     return <HomeSvg />;
};

export default function BottomNavigator() {
     const homeRef = useRef<any>(null);

     const _renderIcon = ({ routeName, refreshing, setRefreshing }: TabBarProps) => {
          const tab = tabs.find((item) => item.name === routeName);

          if (tab?.icon) {
               if (routeName === "Home") {
                    return <HomeIcon refreshing={refreshing} setRefreshing={setRefreshing} />;
               } else {
                    const IconComponent = tab.icon;
                    return <IconComponent />;
               }
          }
          return null;
     };

     const RenderTabBar = ({ routeName, selectedTab, navigate }: TabBarProps) => {
          const [refreshing, setRefreshing] = useState(false);

          return (
               <TouchableOpacity
                    onPress={() => {
                         if (routeName === "Home" && selectedTab === "Home" && homeRef.current) {
                              homeRef.current.refresh();
                              setRefreshing(true);
                         } else {
                              navigate(routeName);
                         }
                    }}
                    style={styles.tabbarItem}
               >
                    {_renderIcon({
                         routeName,
                         selectedTab,
                         navigate,
                         refreshing,
                         setRefreshing,
                    })}
               </TouchableOpacity>
          );
     };

     const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList, "Home">>();

     const renderCustomOnvailButton = () => {
          return <CustomOnvailButton navigation={navigation} />;
     };

     const screenIndex = useNavigationState((state) => state.routes[state.index]?.state?.index);

     return (
          <CurvedBottomBar.Navigator
               screenOptions={{
                    headerShown: false,
               }}
               type="DOWN"
               style={{
                    ...tw`bg-[${Colors.primary}] pb-4 ${screenIndex === 2 ? "hidden" : "flex"}`,
               }}
               shadowStyle={styles.shawdow}
               height={65}
               circleWidth={60}
               bgColor={Colors.primary}
               initialRouteName="Home"
               renderCircle={() => (
                    <Animated.View style={styles.btnCircleUp}>
                         {renderCustomOnvailButton()}
                    </Animated.View>
               )}
               tabBar={(props) => <RenderTabBar {...props} />}
          >
               {tabs.map((item, _) => {
                    return (
                         <CurvedBottomBar.Screen
                              name={item.name}
                              component={
                                   item.name === "Home"
                                        ? (props: any) => <Home ref={homeRef} {...props} />
                                        : item.component
                              }
                              position={item.position}
                              key={item.name}
                         />
                    );
               })}
          </CurvedBottomBar.Navigator>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          padding: 20,
     },
     shawdow: {
          shadowColor: "#DDDDDD",
          shadowOffset: {
               width: 0,
               height: -1.5,
          },
          shadowOpacity: 0.5,
          shadowRadius: 0.1,
     },
     button: {
          flex: 1,
          justifyContent: "center",
     },
     btnCircleUp: {
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#E8E8E8",
          bottom: 25,
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 1,
     },
     imgCircle: {
          width: 30,
          height: 30,
          tintColor: "gray",
     },
     tabbarItem: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
     img: {
          width: 30,
          height: 30,
     },
});
