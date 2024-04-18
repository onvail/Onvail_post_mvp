import {BottomTabParamList} from './BottomTabParamList';

export type MainStackParamList = {
  Notifications: undefined;
  CreateNewPost: undefined;
  PlanYourParty: undefined;
  PartyScreen: undefined;
  BottomNavigator: {screen: keyof BottomTabParamList; params?: any};
};
