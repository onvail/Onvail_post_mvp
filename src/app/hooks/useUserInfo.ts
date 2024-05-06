import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import localStorageKeys from 'src/api/config/local-storage-keys';

export type User = {
  accessToken: string;
  _id: string;
  name: string;
  FCMToken: string;
  email: string;
  password: string;
  userType: 'fan' | 'artist' | 'admin'; // Enumerate possible user types if known
  followers: string[]; // Assuming followers are an array of user IDs
  following: string[]; // Assuming following are an array of user IDs
  __v: number;
};

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const userString = await AsyncStorage.getItem(localStorageKeys.userInfo);
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData?.user);
      } else {
        console.log('No user data found.');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {user};
};

export default useUser;
