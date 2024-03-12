import React, {FunctionComponent} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamList} from './types/RootStackParamList';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomNavigator';

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator: FunctionComponent = () => {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="AuthNavigator" component={AuthNavigator} />
      <RootStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
