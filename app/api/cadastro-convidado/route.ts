import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface CadastroRequest {
  cpf: string;
  fullName: string;
  cellphone: string;
  code: string;
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

    if (!body.cpf || !body.fullName || !body.cellphone) {
      return NextResponse.json(
        { status: "error", message: "Campos obrigatórios faltando!" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_API_KEY_JWT_SECRET as string
    ) as {
      code: string;
    };

    if (decoded.code !== body.code) {
      return NextResponse.json(
        { status: "error", message: "Código não corresponde à validação" },
        { status: 400 }
      );
    }

    await setDoc(doc(db, "convidados", decoded.code), {
      ...body,
      isActive: true,
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
