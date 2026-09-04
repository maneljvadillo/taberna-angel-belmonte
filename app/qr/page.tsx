import type { Metadata } from "next";

import { HojaQR } from "@/components/qr/hoja-qr";

export const metadata: Metadata = {
  title: "Códigos QR de mesa",
  robots: { index: false, follow: false },
};

/** Herramienta interna: genera e imprime el QR de cada mesa. */
export default function PaginaQR() {
  return <HojaQR />;
}
