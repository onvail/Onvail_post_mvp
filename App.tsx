import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import tw from 'lib/tailwind';
import Main from 'app/Main';

const App: FunctionComponent = () => {
  return (
    <View style={tw`flex-1`}>
      <Main />
    </View>
  );
};

export default App;
