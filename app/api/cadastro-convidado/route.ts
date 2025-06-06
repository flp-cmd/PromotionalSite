import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface CadastroRequest {
  vip: {
    cpf: string;
    fullName: string;
    cellphone: string;
    email: string;
  };
  guest: {
    cpf: string;
    fullName: string;
    cellphone: string;
    email: string;
  };
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

    if (!body.vip.cpf || !body.vip.fullName || !body.vip.cellphone) {
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
      ...body.vip,
      isActive: true,
      wasExported: false,
      createdAt: Timestamp.now(),
    });

    if (body.guest.cpf !== "") {
      await setDoc(doc(db, "convidados", `${decoded.code}-guest`), {
        ...body.guest,
        isActive: true,
        wasExported: false,
        createdAt: Timestamp.now(),
      });
    }

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
