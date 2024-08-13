import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';;
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYVA2M13asMMbIjW7kcsvu7gaS8orxWuI",
  authDomain: "tododb-579ba.firebaseapp.com",
  projectId: "tododb-579ba",
  storageBucket: "tododb-579ba.appspot.com",
  messagingSenderId: "341775082789",
  appId: "1:341775082789:web:e9bf1af45e0e75fcbda6cc"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Use either `getAuth` or `initializeAuth` for Firebase Auth
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const FIREBASE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };
