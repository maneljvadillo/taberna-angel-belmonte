import type { Metadata } from "next";

import { PantallaBarra } from "@/components/barra/pantalla-barra";

export const metadata: Metadata = {
  title: "Barra",
  robots: { index: false, follow: false },
};

/**
 * Pantalla de barra: los pedidos de las mesas, en directo.
 *
 * Pensada para una tablet o un móvil fijo detrás de la barra. Pide la clave una
 * vez y la guarda en una cookie httpOnly de 30 días.
 */
export default function PaginaBarra() {
  return <PantallaBarra />;
}
