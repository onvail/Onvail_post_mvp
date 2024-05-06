import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';
import {PartiesResponse} from 'src/types/partyTypes';

export type MainStackParamList = {
  Notifications: undefined;
  CreateNewPost: undefined;
  PlanYourParty: {
    partyType: 'jam-session' | 'artist-showdown';
  };
  PartyScreen: {
    party: PartiesResponse;
  };
  PartyOptions: undefined;
  BottomNavigator: NavigatorScreenParams<BottomTabParamList>;
};
