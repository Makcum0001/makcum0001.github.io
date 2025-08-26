// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhAiDI1pfGZhFhrmkBP1UIWQd0LwHghxw",
  authDomain: "react-wishlist-1e632.firebaseapp.com",
  projectId: "react-wishlist-1e632",
  storageBucket: "react-wishlist-1e632.firebasestorage.app",
  messagingSenderId: "825865680841",
  appId: "1:825865680841:web:b40de5ac90e201d1e35a18",
  measurementId: "G-2978XB21ZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);