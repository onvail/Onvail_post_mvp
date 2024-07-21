// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
     EXPO_PUBLIC_API_KEY,
     EXPO_PUBLIC_AUTH_DOMAIN,
     EXPO_PUBLIC_PROJECT_ID,
     EXPO_PUBLIC_STORAGE_BUCKET,
     EXPO_PUBLIC_MESSAGING_SENDER_ID,
     EXPO_PUBLIC_APP_ID,
     EXPO_PUBLIC_MEASUREMENT_ID,
} from "@env";

const firebaseConfig = {
     apiKey: EXPO_PUBLIC_API_KEY,
     authDomain: EXPO_PUBLIC_AUTH_DOMAIN,
     projectId: EXPO_PUBLIC_PROJECT_ID,
     storageBucket: EXPO_PUBLIC_STORAGE_BUCKET,
     messagingSenderId: EXPO_PUBLIC_MESSAGING_SENDER_ID,
     appId: EXPO_PUBLIC_APP_ID,
     measurementId: EXPO_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// fetch db
const db = getFirestore(firebaseApp);
// initialize Firebase Auth for that app immediately
const appAuth = initializeAuth(firebaseApp, {
     persistence: [getReactNativePersistence(AsyncStorage)],
});

export { firebaseApp, appAuth, db };
