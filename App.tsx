if (__DEV__) {
  require('./ReactotronConfig');
}
import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import tw from 'lib/tailwind';
import Main from 'app/Main';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Cloudinary} from '@cloudinary/url-gen';

// Create a Query client
const queryClient = new QueryClient();

const App: FunctionComponent = () => {
  const _cld = new Cloudinary({cloud: {cloudName: 'dycpdxcii'}});

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <QueryClientProvider client={queryClient}>
        <View style={tw`flex-1`}>
          <Main />
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
