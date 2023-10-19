// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "canopy-d2992.firebaseapp.com",
  projectId: "canopy-d2992",
  storageBucket: "canopy-d2992.appspot.com",
  messagingSenderId: "961387446415",
  appId: "1:961387446415:web:56d201ae7e14389b6370fa",
  measurementId: "G-0813CXC243"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);