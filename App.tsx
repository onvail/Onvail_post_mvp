import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import SplashScreen from 'app/onboarding/SplashScreen';
import tw from 'lib/tailwind';

const App: FunctionComponent = () => {
  return (
    <View style={tw`flex-1`}>
      <SplashScreen />
    </View>
  );
};

export default App;
