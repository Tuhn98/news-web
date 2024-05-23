import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAazXK-7Nlv4ONcniNTE1Tzob3maXiVYEM",
  authDomain: "react-chat-460a6.firebaseapp.com",
  projectId: "react-chat-460a6",
  storageBucket: "react-chat-460a6.appspot.com",
  messagingSenderId: "429687152252",
  appId: "1:429687152252:web:289a059b76b4904409f3f9",
  measurementId: "G-99R8L9405Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
