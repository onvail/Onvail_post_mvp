import {NavigationContainer} from '@react-navigation/native';
import React, {FunctionComponent} from 'react';
import RootNavigator from './navigator/RootNavigator';

const Main: FunctionComponent = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Main;
