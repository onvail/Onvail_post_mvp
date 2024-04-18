if (__DEV__) {
  require('./ReactotronConfig');
}
import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import tw from 'lib/tailwind';
import Main from 'app/Main';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App: FunctionComponent = () => {
  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <Main />
      </View>
    </GestureHandlerRootView>
  );
};

export default App;
