import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from './types/BottomTabParamList';
import Home from 'app/home/screens/Home';

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
];

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      {tabs.map(({name, component}) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
