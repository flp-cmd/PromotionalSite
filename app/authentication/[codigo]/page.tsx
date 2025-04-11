"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QRPage() {
  const router = useRouter();
  const params = useParams();
  const codigo = params.codigo;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (codigo) {
      localStorage.setItem("acesso_autorizado", "true");
      localStorage.setItem("codigo_acesso", String(codigo));
      router.replace("/local-troca");
      setIsLoading(false);
    }
  }, [codigo, router]);

  if (isLoading) {
    return null;
  }

  return <p>Redirecionando...</p>;
}
