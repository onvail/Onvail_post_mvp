import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';
import {PartiesResponse} from 'src/types/partyTypes';
import {AuthStackParamList} from './AuthStackParamList';
import {
  AndroidImageColors,
  IOSImageColors,
} from 'react-native-image-colors/build/types';

export type ColorScheme = AndroidImageColors | IOSImageColors;

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
    partyBackgroundColor: ColorScheme;
  };
  Settings: undefined;
  PartyOptions: undefined;
  PartySuccessScreen: undefined;
  BottomNavigator: NavigatorScreenParams<BottomTabParamList>;
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
};
