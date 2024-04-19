import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';

export type MainStackParamList = {
  Notifications: undefined;
  CreateNewPost: undefined;
  PlanYourParty: undefined;
  PartyScreen: undefined;
  BottomNavigator: NavigatorScreenParams<BottomTabParamList>;
};
