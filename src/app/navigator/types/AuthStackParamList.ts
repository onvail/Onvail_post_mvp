import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';

export type AuthStackParamList = {
  Signup: undefined;
  Login: undefined;
  AuthLandingScreen: undefined;
  BottomTabNavigator: NavigatorScreenParams<BottomTabParamList>;
};
