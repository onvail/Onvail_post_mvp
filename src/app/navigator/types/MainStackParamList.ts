import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './BottomTabParamList';
import {PartiesResponse} from 'src/types/partyTypes';
import {AuthStackParamList} from './AuthStackParamList';

export type ColorScheme = {
  background: string;
  detail: string;
  platform: string;
  primary: string;
  secondary: string;
};

export type MainStackParamList = {
  Notifications: undefined;
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
