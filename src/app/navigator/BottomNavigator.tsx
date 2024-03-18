import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from './types/BottomTabParamList';
import Home from 'app/home/screens/Home';
import TabBarIcon from 'components/Icons/TabBarIcon';
import {RouteProp} from '@react-navigation/native';
import Profile from 'app/profile/screen/Profile';
import {Colors} from '../styles/colors';
import MainNavigator from './MainNavigator';

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface ScreenDef {
  name: keyof BottomTabParamList;
  component: React.ComponentType<any>;
}

const tabs: ScreenDef[] = [
  {
    name: 'Home',
    component: Home,
  },
  {
    name: 'Profile',
    component: Profile,
  },
  {
    name: 'MainAppNavigator',
    component: MainNavigator,
  },
];

type TabBarProps = {
  focused: boolean;
  color: string;
};

const renderTabBarIcon =
  (route: RouteProp<BottomTabParamList>) => (props: TabBarProps) =>
    <TabBarIcon {...props} route={route} />;

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: renderTabBarIcon(route),
        tabBarLabel: () => null,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
        },
      })}>
      {tabs.map(({name, component}) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
