import {MainStackParamList} from './MainStackParamList';

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  MainAppNavigator: {screen: keyof MainStackParamList; params?: any};
};
