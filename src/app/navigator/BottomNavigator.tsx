import React, {FC} from 'react';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {BottomTabParamList} from './types/BottomTabParamList';
import Home from 'app/home/screens/Home';
import Profile from 'app/profile/screen/Profile';
import tw from 'src/lib/tailwind';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {generalIcon} from 'components/Icons/generalIcons';
import {SvgProps} from 'react-native-svg';
import {Colors} from 'src/app/styles/colors';

const HomeSvg = generalIcon.Home;
const ProfileSvg = generalIcon.Profile;
const OnvailSvg = generalIcon.FloatingIcon;

interface ScreenDef {
  name: keyof BottomTabParamList;
  component: React.ComponentType<any>;
  position: 'LEFT' | 'RIGHT';
  icon: FC<SvgProps>;
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
];

const CustomOnvailButton = () => {
  return (
    <TouchableOpacity style={tw`mb-4 justify-center items-center`}>
      <OnvailSvg height={70} width={70} />
    </TouchableOpacity>
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
  const renderCustomOnvailButton = () => {
    return <CustomOnvailButton />;
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
