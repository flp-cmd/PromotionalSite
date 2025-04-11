import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const dominio = "https://www.fabulosa.umbaitafestival.com.br";
const codigo = process.env.NEXT_PUBLIC_QR_CODE_KEY;

const pastaSaida = path.join(__dirname, "..", "qrcode");
if (!fs.existsSync(pastaSaida)) {
  fs.mkdirSync(pastaSaida);
}

if (!codigo) {
  console.error("❌ Código não encontrado no ambiente");
  process.exit(1);
}

async function gerarQRCode(codigo: string) {
  const url = `${dominio}/authentication/${codigo}`;
  const caminhoArquivo = path.join(pastaSaida, `qr_code_fabulosa.png`);

  try {
    await QRCode.toFile(caminhoArquivo, url, {
      color: {
        dark: "#000",
        light: "#FFF",
      },
      width: 300,
    });
    console.log(`✅ QRCode gerado: ${caminhoArquivo}`);
  } catch (err) {
    console.error(`❌ Erro ao gerar QR para ${codigo}`, err);
  }
}

gerarQRCode(codigo);
