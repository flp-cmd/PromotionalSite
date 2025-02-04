import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.SECRET_API_KEY_FIREBASE_API_KEY,
  authDomain: process.env.SECRET_API_KEY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.SECRET_API_KEY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.SECRET_API_KEY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.SECRET_API_KEY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.SECRET_API_KEY_FIREBASE_APP_ID,
  measurementId: process.env.SECRET_API_KEY_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
