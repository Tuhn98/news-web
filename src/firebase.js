// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAazXK-7Nlv4ONcniNTE1Tzob3maXiVYEM",
  authDomain: "react-chat-460a6.firebaseapp.com",
  projectId: "react-chat-460a6",
  storageBucket: "react-chat-460a6.appspot.com",
  messagingSenderId: "429687152252",
  appId: "1:429687152252:web:289a059b76b4904409f3f9",
  measurementId: "G-99R8L9405Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
