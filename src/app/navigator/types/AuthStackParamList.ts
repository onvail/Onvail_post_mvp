import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';

export type AuthStackParamList = {
  Signup: undefined;
  EmailInput: undefined;
  PasswordInput: undefined;
  DateOfBirth: undefined;
  GenderInput: undefined;
  AlmostThere: undefined;
  LocationInput: undefined;
  RoleInput: undefined;
  FullNameInput: undefined;
  UsernameInput: undefined;
  TermsOfUse: undefined;
  AccountCreated: undefined;
  Login: undefined;
  AuthLandingScreen: undefined;
  AuthLanding: undefined;
  BottomTabNavigator: NavigatorScreenParams<BottomTabParamList>;
};
