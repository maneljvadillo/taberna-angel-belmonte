import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CartaComida } from "@/components/mesa/carta-comida";
import { PedidoBebidas } from "@/components/mesa/pedido-bebidas";
import { VistaMesa } from "@/components/mesa/vista-mesa";
import { NUMERO_MESAS, mesaValida } from "@/lib/pedidos/config";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Carta y bebidas · ${site.nombre}`,
  // Estas páginas son para quien está sentado en la mesa, no para Google.
  robots: { index: false, follow: false },
};

/** Una página estática por mesa: el QR abre al instante, sin esperar al servidor. */
export function generateStaticParams() {
  return Array.from({ length: NUMERO_MESAS }, (_, i) => ({
    numero: String(i + 1),
  }));
}

export default async function PaginaMesa({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  if (!mesaValida(numero)) notFound();

  return (
    <VistaMesa
      mesa={numero}
      comida={<CartaComida />}
      bebidas={<PedidoBebidas mesa={numero} />}
    />
  );
}
