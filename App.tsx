if (__DEV__) {
  require('./ReactotronConfig');
}
import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import tw from 'lib/tailwind';
import Main from 'app/Main';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AlertNotificationRoot} from 'react-native-alert-notification';

// Create a Query client
const queryClient = new QueryClient();

const App: FunctionComponent = () => {
  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <QueryClientProvider client={queryClient}>
        <AlertNotificationRoot>
          <View style={tw`flex-1`}>
            <Main />
          </View>
        </AlertNotificationRoot>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
