import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import fs from "fs";
import Papa from "papaparse";
import dotenv from "dotenv";

dotenv.config();

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

async function exportParticipatingClients() {
  try {
    const colRef = collection(db, "clientes");

    const q = query(colRef, where("isParticipating", "==", true));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length === 0) {
      console.log("Nenhum cliente participante encontrado.");
      return;
    }

    const csv = Papa.unparse(data);
    fs.writeFileSync("fabulosa_participantes.csv", csv);
    console.log("✅ Exportado com sucesso para fabulosa_participantes.csv");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao exportar:", error);
  }
}

exportParticipatingClients();
