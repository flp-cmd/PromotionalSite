import { db } from "@/lib/firebase"; 
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

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

    if (
      !body.cpf ||
      !body.fullName ||
      !body.birthDate ||
      !body.cellphone ||
      !body.email ||
      !body.address ||
      !body.addressNumber ||
      !body.neighborhood ||
      !body.complement ||
      !body.state ||
      !body.city ||
      !body.postalCode
    ) {
      return NextResponse.json(
        { status: "error", message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const sanitizedCpf = body.cpf.replace(/\D/g, ""); 

    await setDoc(doc(db, "clients", sanitizedCpf), {
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
