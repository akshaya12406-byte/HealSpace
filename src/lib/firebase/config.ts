import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  "projectId": "studio-9999962512-c29d8",
  "appId": "1:231935751399:web:0fcd9b3535264c05c31e42",
  "storageBucket": "studio-9999962512-c29d8.appspot.com",
  "apiKey": "AIzaSyBpbnoM5g86nPbw-hF9OpqTwnDUsYq9ED8",
  "authDomain": "studio-9999962512-c29d8.firebaseapp.com",
  "messagingSenderId": "231935751399",
  "measurementId": "G-S0D36X411T"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db, firebaseConfig };
