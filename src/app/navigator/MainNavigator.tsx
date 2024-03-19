import {createStackNavigator} from '@react-navigation/stack';
import React, {FunctionComponent} from 'react';
import {MainStackParamList} from './types/MainStackParamList';
import Notification from '../notifications/screens/Notification';
import CreateNewPosts from 'app/posts/screens/CreateNewPosts';

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
