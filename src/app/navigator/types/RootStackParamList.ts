import {AuthStackParamList} from './AuthStackParamList';
import {BottomTabParamList} from './BottomTabParamList';
export type RootStackParamList = {
  AuthNavigator: {screen: keyof AuthStackParamList};
  BottomTabNavigator: {screen: keyof BottomTabParamList};
};
