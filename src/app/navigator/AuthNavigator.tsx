import {createStackNavigator} from '@react-navigation/stack';
import React, {FunctionComponent} from 'react';
import {AuthStackParamList} from './types/AuthStackParamList';
import Signup from 'auth/screens/Signup';
import AuthLandingScreen from 'auth/screens/AuthLandingScreen';
import Login from 'auth/screens/Login';
import EmailInput from '../auth/screens/EmailScreen';
import PasswordInput from '../auth/screens/PasswordInput';
import DateOfBirth from '../auth/screens/DateOfBirth';
import GenderInput from '../auth/screens/GenderInput';
import AlmostThere from '../auth/screens/AlmostThere';
import LocationInput from '../auth/screens/LocationInput';
import FullNameInput from '../auth/screens/FullNameInput';
import UsernameInput from '../auth/screens/UsernameInput';
import RoleInput from '../auth/screens/RoleInput';
import TermsOfUse from '../auth/screens/TermsOfUse';
import AccountCreated from '../auth/screens/AccountCreated';
import AuthLanding from '../auth/screens/AuthLanding';

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
    name: 'AuthLanding',
    screen: AuthLanding,
  },
  {
    name: 'EmailInput',
    screen: EmailInput,
  },
  {
    name: 'PasswordInput',
    screen: PasswordInput,
  },
  {
    name: 'DateOfBirth',
    screen: DateOfBirth,
  },
  {
    name: 'GenderInput',
    screen: GenderInput,
  },
  {
    name: 'AlmostThere',
    screen: AlmostThere,
  },
  {
    name: 'LocationInput',
    screen: LocationInput,
  },
  {
    name: 'RoleInput',
    screen: RoleInput,
  },
  {
    name: 'FullNameInput',
    screen: FullNameInput,
  },
  {
    name: 'UsernameInput',
    screen: UsernameInput,
  },
  {
    name: 'TermsOfUse',
    screen: TermsOfUse,
  },
  {
    name: 'AccountCreated',
    screen: AccountCreated,
  },
  {
    name: 'Signup',
    screen: Signup,
  },
  {
    name: 'Login',
    screen: Login,
  },
];

const AuthNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuthLanding"
      screenOptions={{headerShown: false}}>
      {screens.map(({name, screen}) => (
        <Stack.Screen key={name} name={name} component={screen} />
      ))}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
