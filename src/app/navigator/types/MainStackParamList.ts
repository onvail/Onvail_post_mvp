import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';
import {PartiesResponse} from 'src/types/partyTypes';

export type MainStackParamList = {
  Notifications: undefined;
  SongReview: undefined;
  SongReviewSuccess: undefined;
  CreateNewPost: undefined;
  PlanYourParty: {
    partyType: 'cozy_jam_session' | 'artist_show_down';
  };
  PartyScreen: {
    party: PartiesResponse;
  };
  PartyOptions: undefined;
  PartySuccessScreen: undefined;
  BottomNavigator: NavigatorScreenParams<BottomTabParamList>;
};
