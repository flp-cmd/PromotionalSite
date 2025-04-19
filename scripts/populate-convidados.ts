import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Caminho do JSON da service account (ajuste se necessário)
const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");

// Inicializa o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

// Função para gerar código aleatório (6 caracteres alfanuméricos)
function generateInviteCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Função para esperar um tempo específico
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function populateConvidados() {
  try {
    console.log("Iniciando conexão com o Firestore...");

    const numberOfCodes = 100;
    const codigosGerados = new Set<string>();

    console.log(
      `\n=== INICIANDO GERAÇÃO DE ${numberOfCodes} CÓDIGOS DE CONVITE ===\n`
    );

    // Teste inicial
    try {
      const testCode = "TEST123";
      await db.collection("convidados").doc(testCode).set({ active: true });
      console.log("✅ Teste inicial bem sucedido");
    } catch (error) {
      console.error("❌ Erro no teste inicial:", error);
      process.exit(1);
    }

    for (let i = 0; i < numberOfCodes; i++) {
      try {
        let codigo: string;
        do {
          codigo = generateInviteCode();
        } while (codigosGerados.has(codigo));

        codigosGerados.add(codigo);

        const convidadoData = {
          isActive: false,
          wasExported: false,
          cpf: "",
          fullName: "",
          cellPhone: "",
          createdAt: new Date(),
        };

        await db.collection("convidados").doc(codigo).set(convidadoData);
        console.log(`✅ Código salvo com sucesso: ${codigo}`);

        await delay(100);
      } catch (error) {
        console.error(`❌ Erro ao salvar código ${i + 1}:`, error);
        throw error;
      }
    }

    console.log(`\n=== PROCESSO FINALIZADO ===`);
    console.log(`Total de códigos gerados: ${codigosGerados.size}`);

    // Salva os códigos em arquivo
    if (!fs.existsSync("./files")) {
      fs.mkdirSync("./files");
    }

    const codigosArray = Array.from(codigosGerados);
    fs.writeFileSync(
      "./files/codigos_gerados.json",
      JSON.stringify(codigosArray, null, 2)
    );
    console.log(`✅ Códigos salvos em: ./files/codigos_gerados.json`);

    process.exit(0);
  } catch (error) {
    console.error("\n!!! ERRO GLOBAL NA EXECUÇÃO:", error);
    process.exit(1);
  }
}

populateConvidados();
