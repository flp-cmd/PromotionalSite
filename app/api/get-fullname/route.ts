import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface ApiResponse {
  status: "success" | "error";
  message: string;
  fullName?: string;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          message: "Token não fornecido",
        },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, process.env.SECRET_API_KEY_JWT_SECRET as string);
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Token inválido ou expirado",
        },
        { status: 401 }
      );
    }

    if (!code || code.length !== 8) {
      return NextResponse.json(
        {
          status: "error",
          message: "Código inválido. Verifique o número digitado.",
        },
        { status: 400 }
      );
    }

    const docRef = doc(db, "convidados", code);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const fullName = data?.fullName || "";

      return NextResponse.json({
        status: "success",
        message: "Nome recuperado com sucesso",
        fullName: fullName,
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Código não encontrado!",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar nome:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Erro interno ao buscar nome. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
