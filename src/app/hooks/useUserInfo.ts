import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {useState} from 'react';
import localStorageKeys from 'src/api/config/local-storage-keys';

export type User = {
  country: string;
  dateOfBirth: string;
  desc: string;
  image: string;
  location: string;
  name: string;
  FCMToken: string;
  email: string;
  password: string;
  userType: 'fan' | 'artist' | 'admin'; // Enumerate possible user types if known
  followers: string[]; // Assuming followers are an array of user IDs
  following: string[]; // Assuming following are an array of user IDs
  __v: number;
  _id: string;
  stageName: string;
};

const useUser = () => {
  const [user, setUser] = useState<User>({} as User);

  const fetchUser = async () => {
    try {
      const userString = await AsyncStorage.getItem(localStorageKeys.userInfo);
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData.user);
      } else {
        console.log('No user data found.');
        setUser({} as User);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser({} as User);
    }
  };

  const updateUser = async (response: any) => {
    setUser(response?.data?.user); // Update state
    console.log(response.data);
    console.log(response.token);
    try {
      // Persist updated user data to AsyncStorage
      AsyncStorage.setItem(
        localStorageKeys.userInfo,
        JSON.stringify(response?.data),
      );
      console.log('User data updated successfully in AsyncStorage.');
    } catch (error) {
      console.error('Failed to update user data in AsyncStorage:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      return () => {};
    }, []),
  );

  return {user, updateUser};
};

export default useUser;
