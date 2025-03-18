"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Toaster />;
}
