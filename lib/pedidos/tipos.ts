export const ESTADOS = ["nuevo", "preparando", "servido", "cancelado"] as const;
export type EstadoPedido = (typeof ESTADOS)[number];

export type LineaPedido = {
  bebidaId: string;
  /** Copia del nombre en el momento del pedido: si mañana cambia la carta,
   *  el ticket antiguo sigue diciendo lo que se pidió. */
  nombre: string;
  precioCentimos: number;
  unidades: number;
};

export type Pedido = {
  id: string;
  mesa: string;
  lineas: LineaPedido[];
  totalCentimos: number;
  nota: string | null;
  estado: EstadoPedido;
  /** ISO 8601 en UTC. */
  creadoEn: string;
  actualizadoEn: string;
  /** Los precios estaban sin confirmar cuando se tomó el pedido. */
  preciosProvisionales: boolean;
};

/** Lo que manda el móvil del cliente: solo ids y unidades, nunca precios. */
export type PedidoEntrante = {
  mesa: string;
  lineas: { bebidaId: string; unidades: number }[];
  nota?: string;
};
