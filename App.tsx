import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import Onboarding from 'onboarding/Onboarding';
import tw from 'lib/tailwind';

const App: FunctionComponent = () => {
  return (
    <View style={tw`flex-1`}>
      <Onboarding />
    </View>
  );
};

export default App;
