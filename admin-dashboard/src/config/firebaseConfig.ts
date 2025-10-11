// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN6cX8lKQgEkMkEXsMKJjljRJQqlY_yzY",
  authDomain: "bthwani-b13cd.firebaseapp.com",
  projectId: "bthwani-b13cd",
  storageBucket: "bthwani-b13cd.firebasestorage.app",
  messagingSenderId: "242766871221",
  appId: "1:242766871221:web:b6ba5c39cf906318a05cfc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
