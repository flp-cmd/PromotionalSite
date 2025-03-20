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
    const cpf = searchParams.get("cpf")?.replace(/\D/g, "");
    if (!cpf || ![11, 14].includes(cpf.length)) {
      return NextResponse.json(
        {
          status: "error",
          message: "CPF/CNPJ inválido. Verifique o número digitado.",
        },
        { status: 400 }
      );
    }

    const docRef = doc(db, "clientes", cpf);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data?.isParticipating === false) {
        const token = jwt.sign(
          { cpf, validated: true },
          process.env.SECRET_API_KEY_JWT_SECRET as string,
          { expiresIn: "15m" }
        );

        return NextResponse.json({
          status: "success",
          message: "Pode participar da promoção.",
          token: token,
        });
      } else {
        return NextResponse.json(
          {
            status: "error",
            message:
              "Seu CPF ou CNPJ já está participando, aguarde seu ticket premiado!",
          },
          { status: 400 }
        );
      }
    } else {
      const response = await fetch(
        `https://api.icones.com.br/tickets/promo/baita-2025?cpf=${cpf}`,
        {
          method: "GET",
          headers: {
            Authorization: `${process.env.SECRET_API_KEY_API_TOKEN}`,
          },
        }
      );

      if (response.status === 200) {
        const token = jwt.sign(
          { cpf, validated: true },
          process.env.SECRET_API_KEY_JWT_SECRET as string,
          { expiresIn: "15m" }
        );
        return NextResponse.json({
          status: "success",
          message: "Pode participar da promoção.",
          token: token,
        });
      } else {
        return NextResponse.json(
          {
            status: "error",
            message:
              "Não encontramos seu CPF/CNPJ. Verifique se usou o mesmo na compra dos ingressos do Um Baita Festival.",
          },
          { status: 404 }
        );
      }
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
