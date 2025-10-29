import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHjWvWgduMcPQWwe_CntbBIukkgEx2M3g",
  authDomain: "safesprout-4eac2.firebaseapp.com",
  projectId: "safesprout-4eac2",
  storageBucket: "safesprout-4eac2.firebasestorage.app",
  messagingSenderId: "807512688397",
  appId: "1:807512688397:web:e35497af8f38a02f58d244",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
