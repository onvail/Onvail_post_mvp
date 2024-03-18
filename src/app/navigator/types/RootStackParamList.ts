import {AuthStackParamList} from './AuthStackParamList';
import {BottomTabParamList} from './BottomTabParamList';
import {MainStackParamList} from './MainStackParamList';
export type RootStackParamList = {
  AuthNavigator: {screen: keyof AuthStackParamList};
  BottomTabNavigator: {screen: keyof BottomTabParamList};
  MainStackNavigator: {screen: keyof MainStackParamList};
};
