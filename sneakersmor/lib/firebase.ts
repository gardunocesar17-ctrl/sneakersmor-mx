// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt8QaI-MT9spA0yRSu519Y2oVliCdn1tE",
  authDomain: "sneakersmor-227e1.firebaseapp.com",
  projectId: "sneakersmor-227e1",
  storageBucket: "sneakersmor-227e1.firebasestorage.app",
  messagingSenderId: "593377346546",
  appId: "1:593377346546:web:3a8b640bd53ee605abe16b",
  measurementId: "G-KZPPP1JVV6"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
