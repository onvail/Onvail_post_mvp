import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageKeys from 'src/api/config/local-storage-keys';

const errorInteceptor = async (instance: any, error: any) => {
  if (error.response) {
    if (error.response.status === 401) {
      const originalConfig = error.config;
      const accessToken = await AsyncStorage.getItem(
        localStorageKeys.accessToken,
      );
      const refreshToken = await AsyncStorage.getItem(
        localStorageKeys.refreshToken,
      );
      if (accessToken && refreshToken && !originalConfig._retry) {
        // Access Token has expired
        console.log('Token expired');
        try {
          originalConfig._retry = true;
          const refreshResponse = await instance.post(
            'auth/jwt/refresh',
            {
              refresh: refreshToken,
            },
            originalConfig,
          );

          if (refreshResponse?.data) {
            console.log('Refresh token sent');
            const {access} = refreshResponse.data;
            const type = 'JWT';
            if (access) {
              console.log('New access token returned');
              await AsyncStorage.setItem(localStorageKeys.accessToken, access);

              if (type) {
                await AsyncStorage.setItem(localStorageKeys.tokenType, type);
              }
              originalConfig.headers.Authorization = `${type} ${access}`;
            }
            return instance(originalConfig);
          }
        } catch (_error: any) {
          if (_error?.response?.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }
    }
    if (error.response.status === 403 && error.response.data) {
      return Promise.reject(error.response.data);
    }
  }
  return Promise.reject(error);
};

export default errorInteceptor;
