import React, {FunctionComponent, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, ActivityIndicator} from 'react-native'; // For loading indicator

import {RootStackParamList} from './types/RootStackParamList';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageKeys from 'src/api/config/local-storage-keys';
import tw from 'src/lib/tailwind';
import MainNavigator from './MainNavigator';

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator: FunctionComponent = () => {
  const [initialRouteName, setInitialRouteName] = useState<
    keyof RootStackParamList | undefined
  >();
  const [loading, setLoading] = useState(true); // Manage loading state

  const fetchApiKeys = async () => {
    try {
      const token = await AsyncStorage.getItem(localStorageKeys.accessToken);
      if (token) {
        setInitialRouteName('AuthNavigator');
        // setInitialRouteName('BottomTabNavigator');
      } else {
        setInitialRouteName('AuthNavigator');
      }
    } catch (error) {
      console.error('Failed to fetch token:', error);
      setInitialRouteName('AuthNavigator'); // Default to AuthNavigator on error
    } finally {
      setLoading(false); // Ensure loading is set to false after the operation
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center bg-primary justify-center`}>
        <ActivityIndicator size="large" color={'white'} />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{headerShown: false}}>
      <RootStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <RootStack.Screen name="AuthNavigator" component={AuthNavigator} />
      <RootStack.Screen name="MainStackNavigator" component={MainNavigator} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
