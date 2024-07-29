import AsyncStorage from "@react-native-async-storage/async-storage";
import localStorageKeys from "src/api/config/local-storage-keys";

const requestInteceptor = async (config: any) => {
     if (config.headers.authorization) {
          const accessToken = await AsyncStorage.getItem(localStorageKeys.accessToken);
          const token = accessToken ?? null;
          const deviceName = await AsyncStorage.getItem(localStorageKeys.deviceName);
          config.headers.Authorization = `Token ${token}`;
          config.headers["Device-Name"] = deviceName;
     }
     if (config.headers.deviceName) {
          const device = await AsyncStorage.getItem(localStorageKeys.deviceName);
          config.headers["Device-Name"] = device;
     }

     // delete config.headers.requiresToken;
     return config;
};

export default requestInteceptor;
