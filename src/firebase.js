// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8dPBns9p3n9jUJhwrRpdg4xmUASEu4PI",
  authDomain: "hydrosure-eb121.firebaseapp.com",
  projectId: "hydrosure-eb121",
  storageBucket: "hydrosure-eb121.firebasestorage.app",
  messagingSenderId: "767832435093",
  appId: "1:767832435093:web:162c66b47e1efb2c8eee9c",
  measurementId: "G-82B8G4MVYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
