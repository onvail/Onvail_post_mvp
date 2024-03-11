import {createStackNavigator} from '@react-navigation/stack';
import React, {FunctionComponent} from 'react';
import {AuthStackParamList} from './types/AuthStackParamList';
import Signup from 'auth/screens/Signup';
import AuthLandingScreen from 'auth/screens/AuthLandingScreen';

const Stack = createStackNavigator<AuthStackParamList>();

interface ScreenDef {
  name: keyof AuthStackParamList;
  screen: React.ComponentType<any>;
}

const screens: ScreenDef[] = [
  {
    name: 'AuthLandingScreen',
    screen: AuthLandingScreen,
  },
  {
    name: 'Signup',
    screen: Signup,
  },
];

const AuthNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator initialRouteName="AuthLandingScreen">
      {screens.map(({name, screen}) => (
        <Stack.Screen key={name} name={name} component={screen} />
      ))}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
