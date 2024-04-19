import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';
import {PartiesResponse} from 'src/types/partyTypes';

export type MainStackParamList = {
  Notifications: undefined;
  CreateNewPost: undefined;
  PlanYourParty: undefined;
  PartyScreen: {
    party: PartiesResponse;
  };
  BottomNavigator: NavigatorScreenParams<BottomTabParamList>;
};
