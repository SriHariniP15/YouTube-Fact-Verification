import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlSU86m9XBugmWCcuGrjCJtRLi8MujdN4",
  authDomain: "fact-verification-b20e1.firebaseapp.com",
  projectId: "fact-verification-b20e1",
  storageBucket: "fact-verification-b20e1.firebasestorage.app",
  messagingSenderId: "849846066693",
  appId: "1:849846066693:web:c1862f40d516956aa3066c",
  measurementId: "G-3PS6DFLVFM"
};

// Initialize Firebase App and other services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export necessary utilities for other components to use
export { 
    auth, 
    googleProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    app,
    analytics
};