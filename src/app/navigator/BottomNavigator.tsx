import React, {FC, FunctionComponent, useState} from 'react';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {BottomTabParamList} from './types/BottomTabParamList';
import Home from 'app/home/screens/Home';
import Profile from 'app/profile/screen/Profile';
import tw from 'src/lib/tailwind';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {generalIcon} from 'components/Icons/generalIcons';
import {SvgProps} from 'react-native-svg';
import {Colors} from 'src/app/styles/colors';
import MainNavigator from './MainNavigator';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from './types/MainStackParamList';

const HomeSvg = generalIcon.Home;
const ProfileSvg = generalIcon.Profile;
const OnvailSvg = generalIcon.FloatingIcon;
const BeatIconSvg = generalIcon.BeatIcon;
const EditIconSvg = generalIcon.EditIcon;

interface ScreenDef {
  name: keyof BottomTabParamList;
  component: React.ComponentType<any>;
  position: 'LEFT' | 'RIGHT' | 'CENTER';
  icon: FC<SvgProps> | null;
}

const tabs: ScreenDef[] = [
  {
    name: 'Home',
    component: Home,
    icon: HomeSvg,
    position: 'LEFT',
  },
  {
    name: 'Profile',
    component: Profile,
    icon: ProfileSvg,
    position: 'RIGHT',
  },
  {
    name: 'MainAppNavigator',
    component: MainNavigator,
    icon: null,
    position: 'CENTER',
  },
];

interface OnvailBtnProps {
  title: string;
  icon: FC<SvgProps>;
  route: keyof MainStackParamList;
}

const onvailBtnOptions: OnvailBtnProps[] = [
  {
    title: 'Create a post',
    icon: EditIconSvg,
    route: 'CreateNewPost',
  },
  {
    title: 'Plan a party',
    icon: BeatIconSvg,
    route: 'PlanYourParty',
  },
];

type NavigationProps = {
  navigation: NativeStackNavigationProp<BottomTabParamList, 'Home'>;
};

const CustomOnvailButton: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  const [showNavOptions, setShowNavOptions] = useState<boolean>(false);
  return (
    <View style={tw`relative  items-center `}>
      <Modal
        isVisible={showNavOptions}
        backdropOpacity={0.87}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        onBackdropPress={() => setShowNavOptions(false)}
        style={tw`absolute items-center justify-center left-20 right-20 bottom-20`}>
        <View style={tw`flex-1 self-center items-center justify-center`}>
          {onvailBtnOptions.map((item, _) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.title}
                onPress={() => {
                  navigation.navigate('MainAppNavigator', {
                    screen: item.route,
                  });
                  setShowNavOptions(false);
                }}
                style={tw`bg-white flex-row items-center rounded-full justify-between px-3   py-2 mb-3 w-50`}>
                <Text style={tw`font-poppinsMedium text-base`}>
                  {item.title}
                </Text>
                <Icon height={21} width={21} />
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => setShowNavOptions(prev => !prev)}
        style={tw`mb-4 justify-center items-center`}>
        <OnvailSvg height={60} width={60} />
      </TouchableOpacity>
    </View>
  );
};

interface TabBarProps {
  routeName: string;
  selectedTab: string;
  navigate: (selectedTab: string) => void;
}

const _renderIcon = ({routeName}: TabBarProps) => {
  // Find the current tab object based on the routeName
  const tab = tabs.find(item => item.name === routeName);
  // If the tab and icon exist, render the icon component and pass the focused prop
  if (tab?.icon) {
    const IconComponent = tab.icon;
    return <IconComponent />;
  }
  // If the icon doesn't exist, return null or some default icon
  return null;
};

const renderTabBar = ({routeName, selectedTab, navigate}: TabBarProps) => {
  return (
    <TouchableOpacity
      onPress={() => navigate(routeName)}
      style={styles.tabbarItem}>
      {_renderIcon({
        routeName,
        selectedTab,
        navigate,
      })}
    </TouchableOpacity>
  );
};

const BottomTabNavigator = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList, 'Home'>>();

  const renderCustomOnvailButton = () => {
    return <CustomOnvailButton navigation={navigation} />;
  };
  return (
    <CurvedBottomBar.Navigator
      screenOptions={{
        headerShown: false,
      }}
      type="DOWN"
      style={tw`bg-primary`}
      shadowStyle={styles.shawdow}
      height={65}
      circleWidth={55}
      bgColor={Colors.primary}
      initialRouteName="Home"
      renderCircle={() => (
        <Animated.View style={styles.btnCircleUp}>
          {renderCustomOnvailButton()}
        </Animated.View>
      )}
      tabBar={renderTabBar}>
      {tabs.map((item, _) => {
        return (
          <CurvedBottomBar.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            position={item.position}
          />
        );
      })}
    </CurvedBottomBar.Navigator>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    backgroundColor: 'transparent',
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 18,
    shadowColor: '#000',
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
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
  },
  screen2: {
    flex: 1,
  },
});

export default BottomTabNavigator;
