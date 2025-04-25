import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
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

    // Busca apenas clientes participantes que ainda não foram exportados
    const q = query(colRef, where("isParticipating", "==", true));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length === 0) {
      console.log("Nenhum cliente novo para exportar.");
      return;
    }

    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, "0");
    const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
    const nomeArquivo = `fabulosa_participantes_${dia}-${mes}.csv`;

    // Garante que a pasta files existe
    const pastaFiles = "./files";
    if (!fs.existsSync(pastaFiles)) {
      fs.mkdirSync(pastaFiles);
    }

    const caminhoCompleto = `${pastaFiles}/${nomeArquivo}`;
    const csv = Papa.unparse(data);
    fs.writeFileSync(caminhoCompleto, csv);

    // Atualiza os documentos marcando como exportados
    console.log("Atualizando status dos clientes exportados...");
    const atualizacoes = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        wasExported: true,
        exportedAt: new Date().toISOString(),
      })
    );

    await Promise.all(atualizacoes);

    console.log(`✅ Exportado com sucesso para ${caminhoCompleto}`);
    console.log(`📊 Total de clientes exportados: ${data.length}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao exportar:", error);
    process.exit(1);
  }
}

exportParticipatingClients();
