import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface CadastroRequest {
  cpf: string;
  fullName: string;
  birthDate: string;
  cellphone: string;
  email: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  complement: string;
  state: string;
  city: string;
  postalCode: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: CadastroRequest = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { status: "error", message: "Token não fornecido" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (
      !body.cpf ||
      !body.fullName ||
      !body.birthDate ||
      !body.cellphone ||
      !body.email ||
      !body.address ||
      !body.neighborhood ||
      !body.state ||
      !body.city ||
      !body.postalCode
    ) {
      return NextResponse.json(
        { status: "error", message: "Campos obrigatórios faltando!" },
        { status: 400 }
      );
    }
    const sanitizedCpf = body.cpf.replace(/\D/g, "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      cpf: string;
    };

    if (decoded.cpf !== sanitizedCpf) {
      return NextResponse.json(
        { status: "error", message: "CPF não corresponde à validação" },
        { status: 400 }
      );
    }

    await setDoc(doc(db, "clientes", decoded.cpf), {
      ...body,
      isParticipating: true,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json(
      { status: "success", message: "Cadastro realizado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { status: "error", message: "Erro ao processar cadastro." },
      { status: 500 }
    );
  }
}
