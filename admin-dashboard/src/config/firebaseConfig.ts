// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "FIREBASE_API_KEY_NOT_SET",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "FIREBASE_AUTH_DOMAIN_NOT_SET",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "FIREBASE_PROJECT_ID_NOT_SET",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "FIREBASE_STORAGE_BUCKET_NOT_SET",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "FIREBASE_MESSAGING_SENDER_ID_NOT_SET",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "FIREBASE_APP_ID_NOT_SET",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
