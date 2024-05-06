import React, {FC} from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {Colors} from 'app/styles/colors';
import {generalIcon} from 'app/components/Icons/generalIcons';
import Home from 'app/home/screens/Home';
import Profile from 'app/profile/screen/Profile';
import {BottomTabParamList} from './types/BottomTabParamList';
import {SvgProps} from 'react-native-svg';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import CustomOnvailButton from 'app/components/Buttons/CustomOnvailBtn';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import tw from 'src/lib/tailwind';
import MainNavigator from './MainNavigator';

const HomeSvg = generalIcon.Home;
const ProfileSvg = generalIcon.Profile;

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

interface TabBarProps {
  routeName: string;
  selectedTab: string;
  navigate: (selectedTab: string) => void;
}

export default function BottomNavigator() {
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

  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList, 'Home'>>();

  const renderCustomOnvailButton = () => {
    return <CustomOnvailButton navigation={navigation} />;
  };
  // Indexes defines screen positions.
  // Home = 0; Profile = 1; MainNavigator = 2
  const screenIndex = useNavigationState(
    state => state.routes[state.index]?.state?.index,
  );

  return (
    <CurvedBottomBar.Navigator
      screenOptions={{
        headerShown: false,
      }}
      type="DOWN"
      style={tw`bg-transparent ${screenIndex === 2 ? 'hidden' : 'flex'}`}
      shadowStyle={styles.shawdow}
      height={65}
      circleWidth={60}
      bgColor={Colors.primary}
      initialRouteName="title1"
      renderCircle={() => (
        <Animated.View style={styles.btnCircleUp}>
          {renderCustomOnvailButton()}
        </Animated.View>
      )}
      tabBar={renderTabBar}>
      {tabs.map((item, _) => {
        return (
          <CurvedBottomBar.Screen
            name={item.name}
            component={item.component}
            position={item.position}
            key={item.name}
          />
        );
      })}
    </CurvedBottomBar.Navigator>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
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
    backgroundColor: '#E8E8E8',
    bottom: 25,
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
});
