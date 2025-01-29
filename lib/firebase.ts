import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0b6ljIZcmslPHLpNB7EzBgQrcA-_sPXE",
  authDomain: "promotionalpagebaita.firebaseapp.com",
  projectId: "promotionalpagebaita",
  storageBucket: "promotionalpagebaita.firebasestorage.app",
  messagingSenderId: "569484718440",
  appId: "1:569484718440:web:6a5117f6a71ecf5ff866dd",
  measurementId: "G-NQRP1KH05P",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
