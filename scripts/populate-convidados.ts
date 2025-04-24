import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

function generateInviteCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function populateConvidados() {
  try {
    console.log("Iniciando conexão com o Firestore...");

    const vipFilePath = path.resolve(__dirname, "../files/convidados_vip.json");
    const vipData = JSON.parse(fs.readFileSync(vipFilePath, "utf8"));
    const vipNames = vipData.nomes;

    console.log(
      `\n=== INICIANDO GERAÇÃO DE ${vipNames.length} CÓDIGOS DE CONVITE PARA VIPs ===\n`
    );

    const codigosGerados = new Set<string>();

    for (let i = 0; i < vipNames.length; i++) {
      try {
        const vipName = vipNames[i];

        let codigo: string;
        do {
          codigo = generateInviteCode();
        } while (codigosGerados.has(codigo));

        codigosGerados.add(codigo);

        const convidadoData = {
          isActive: false,
          wasExported: false,
          cpf: "",
          email: "",
          fullName: vipName,
          cellPhone: "",
          createdAt: new Date(),
        };

        await db.collection("convidados").doc(codigo).set(convidadoData);
        console.log(`✅ Código ${codigo} salvo com sucesso para: ${vipName}`);

        await delay(100);
      } catch (error) {
        console.error(`❌ Erro ao salvar código ${i + 1}:`, error);
        throw error;
      }
    }

    console.log(`\n=== PROCESSO FINALIZADO ===`);
    console.log(`Total de códigos gerados: ${codigosGerados.size}`);

    if (!fs.existsSync("./files")) {
      fs.mkdirSync("./files");
    }

    const codigosVIP = Array.from(codigosGerados).map((codigo, index) => ({
      codigo,
      nome: vipNames[index],
    }));

    fs.writeFileSync(
      "./files/codigos_vip_gerados.json",
      JSON.stringify(codigosVIP, null, 2)
    );
    console.log(`✅ Códigos VIP salvos em: ./files/codigos_vip_gerados.json`);

    process.exit(0);
  } catch (error) {
    console.error("\n!!! ERRO GLOBAL NA EXECUÇÃO:", error);
    process.exit(1);
  }
}

populateConvidados();
