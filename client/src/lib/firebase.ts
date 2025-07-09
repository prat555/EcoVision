// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtEdCXtKyFoVraeIifG5rkRcHMPi8Z8Mc",
  authDomain: "ecovision-sign.firebaseapp.com",
  projectId: "ecovision-sign",
  storageBucket: "ecovision-sign.firebasestorage.app",
  messagingSenderId: "933948637726",
  appId: "1:933948637726:web:2c7183ea5b59f70a52e40f",
  measurementId: "G-84P9C4ST5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;