import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';
import {PartiesResponse} from 'src/types/partyTypes';
import {AuthStackParamList} from './AuthStackParamList';

export type MainStackParamList = {
  Notifications: undefined;
  CreateNewPost: undefined;
  PlanYourParty: {
    partyType: 'jam-session' | 'artist-showdown';
  };
  PartyScreen: {
    party: PartiesResponse;
  };
  Settings: undefined;
  PartyOptions: undefined;
  BottomNavigator: NavigatorScreenParams<BottomTabParamList>;
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
};
