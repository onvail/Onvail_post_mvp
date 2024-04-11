import {createStackNavigator} from '@react-navigation/stack';
import React, {FunctionComponent} from 'react';
import {MainStackParamList} from './types/MainStackParamList';
import Notification from '../notifications/screens/Notification';
import CreateNewPosts from 'app/posts/screens/CreateNewPosts';
import PlanYourParty from 'app/party/screens/PlanYourParty';
import PartyScreen from 'app/party/screens/PartyScreen';

const Stack = createStackNavigator<MainStackParamList>();

interface ScreenDef {
  name: keyof MainStackParamList;
  screen: React.ComponentType<any>;
}

const screens: ScreenDef[] = [
  {
    name: 'Notifications',
    screen: Notification,
  },
  {
    name: 'CreateNewPost',
    screen: CreateNewPosts,
  },
  {
    name: 'PlanYourParty',
    screen: PlanYourParty,
  },
  {
    name: 'PartyScreen',
    screen: PartyScreen,
  },
];

const MainNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {screens.map(({name, screen}) => (
        <Stack.Screen key={name} name={name} component={screen} />
      ))}
    </Stack.Navigator>
  );
};

export default MainNavigator;
