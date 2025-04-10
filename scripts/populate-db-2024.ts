import { db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface ClienteRaw {
  "Comprador - CPF/CNPJ": string;
}

interface ProcessResult {
  success: boolean;
  cpf: string;
  error?: string;
}

const clientData = require("./clientes2024.json");

// Configurações
const CHUNK_SIZE = 250;
const DELAY_BETWEEN_CHUNKS_MS = 1000;

// Função para sanitizar o CPF/CNPJ
function sanitizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, ""); // Remove tudo que não é dígito
}

// Função para validar o CPF/CNPJ
function validateCpf(cpf: string): boolean {
  const cleanedCpf = sanitizeCpf(cpf);
  return [11, 14].includes(cleanedCpf.length); // 11 dígitos para CPF, 14 para CNPJ
}

async function processChunk(
  chunk: ClienteRaw[],
  chunkNumber: number
): Promise<ProcessResult[]> {
  console.log(
    `\n--- Iniciando chunk ${chunkNumber} com ${chunk.length} registros ---`
  );

  const startTime = Date.now();
  const results = await Promise.allSettled(
    chunk.map(async (client) => {
      const rawCpf = client["Comprador - CPF/CNPJ"];
      const cleanedCpf = sanitizeCpf(rawCpf);

      try {
        // Validação após sanitização
        if (!validateCpf(cleanedCpf)) {
          throw new Error(
            `CPF/CNPJ inválido: ${rawCpf} (sanitizado: ${cleanedCpf})`
          );
        }

        const userData = {
          fullName: "",
          birthDate: "",
          cellphone: "",
          email: "",
          address: "",
          addressNumber: "",
          neighborhood: "",
          complement: "",
          state: "",
          city: "",
          postalCode: "",
          isParticipating: false,
          createdAt: serverTimestamp(),
        };

        console.log(`Processando: ${rawCpf} → ${cleanedCpf}`);

        // Usa o CPF sanitizado como ID do documento
        await setDoc(doc(db, "clientes", cleanedCpf), userData);
        return { success: true, cpf: cleanedCpf };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Erro desconhecido";
        console.error(`Falha no CPF ${rawCpf} (${cleanedCpf}):`, errorMsg);
        return {
          success: false,
          cpf: cleanedCpf,
          error: errorMsg,
        };
      }
    })
  );

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const successCount = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  ).length;

  const errorCount = results.length - successCount;

  console.log(
    `\n--- Finalizado chunk ${chunkNumber} (${duration}s) ---\n` +
      `Sucessos: ${successCount}\n` +
      `Falhas: ${errorCount}\n` +
      `--------------------------------------`
  );

  return results.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : {
          success: false,
          cpf: "DESCONHECIDO",
          error: "Promise rejeitada",
        }
  );
}

async function populateDatabase() {
  try {
    const clients = clientData as ClienteRaw[];
    const totalChunks = Math.ceil(clients.length / CHUNK_SIZE);
    let allResults: ProcessResult[] = [];

    console.log(
      `\n=== INICIANDO CARGA DE ${clients.length} CLIENTES EM ${totalChunks} CHUNKS ===\n`
    );

    for (let i = 0; i < clients.length; i += CHUNK_SIZE) {
      const chunkNumber = i / CHUNK_SIZE + 1;
      const chunk = clients.slice(i, i + CHUNK_SIZE);

      const chunkResults = await processChunk(chunk, chunkNumber);
      allResults = [...allResults, ...chunkResults];

      if (i + CHUNK_SIZE < clients.length) {
        console.log(
          `\nAguardando ${DELAY_BETWEEN_CHUNKS_MS}ms antes do próximo chunk...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_CHUNKS_MS)
        );
      }
    }

    // Relatório final
    const successCount = allResults.filter((r) => r.success).length;
    const errorCount = allResults.length - successCount;
    const errorSample = allResults.filter((r) => !r.success).slice(0, 5);

    console.log(
      `\n=== CARGA FINALIZADA ===\n` +
        `Total de registros: ${clients.length}\n` +
        `Sucessos: ${successCount}\n` +
        `Falhas: ${errorCount}\n` +
        `Amostra de erros (primeiros 5):\n${errorSample
          .map((e) => `• ${e.cpf}: ${e.error}`)
          .join("\n")}`
    );

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error("\n!!! ERRO GLOBAL NA EXECUÇÃO:", error);
    process.exit(1);
  }
}

populateDatabase();
