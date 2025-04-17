import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface ApiResponse {
  status: "success" | "error";
  message: string;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const codigo = searchParams.get("codigo");
    if (!codigo || codigo.length !== 6) {
      return NextResponse.json(
        {
          status: "error",
          message: "Código inválido. Verifique o número digitado.",
        },
        { status: 400 }
      );
    }

    const docRef = doc(db, "convidados", codigo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data?.isActive === false) {
        const token = jwt.sign(
          { codigo, validated: true },
          process.env.SECRET_API_KEY_JWT_SECRET as string,
          { expiresIn: "15m" }
        );

        return NextResponse.json({
          status: "success",
          message: "SUCESSO",
          token: token,
        });
      } else {
        return NextResponse.json(
          {
            status: "error",
            message: "Seu codigo já foi resgatado!",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Código Inválido!",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro na verificação:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Erro interno na verificação. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
