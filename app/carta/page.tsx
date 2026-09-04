import type { Metadata } from "next";

import { CartaComida } from "@/components/mesa/carta-comida";
import { PedidoBebidas } from "@/components/mesa/pedido-bebidas";
import { VistaMesa } from "@/components/mesa/vista-mesa";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "La carta",
  description: `Carta de ${site.nombre}: entrantes, marisco, pescados, carnes y postres. ${site.direccion.ciudad}.`,
  alternates: { canonical: "/carta" },
};

/**
 * La carta fuera de la mesa: mismo diseño, sin pedido.
 *
 * Es la página que conviene enlazar desde Google o desde redes, y la que ve
 * quien escanea un QR viejo o entra desde el móvil por su cuenta.
 */
export default function PaginaCarta() {
  return (
    <VistaMesa
      mesa={null}
      comida={<CartaComida />}
      bebidas={<PedidoBebidas mesa={null} />}
    />
  );
}
