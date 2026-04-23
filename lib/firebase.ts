import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdyKoA5XXbv8oi9Du_p6dP5GBv4KSJS_o",
  authDomain: "maza-c8abe.firebaseapp.com",
  projectId: "maza-c8abe",
  storageBucket: "maza-c8abe.firebasestorage.app",
  messagingSenderId: "56416266587",
  appId: "1:56416266587:web:a5b0a2cb1365aa4233527e",
  measurementId: "G-RV5B1H764G"
};

// Initialize Firebase (prevent duplicate app initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
