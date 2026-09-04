import { EventEmitter } from "node:events";

import type { Pedido } from "./tipos";

/**
 * Bus de eventos en proceso: conecta el alta de un pedido con las pantallas de
 * barra que están escuchando por SSE.
 *
 * Al ser en proceso, solo funciona con **un** proceso Node sirviendo la web. Si
 * algún día hay varias instancias detrás de un balanceador, esto se sustituye
 * por Redis pub/sub y el resto del código no se entera.
 */
const cache = globalThis as unknown as { __eventosPedidos?: EventEmitter };

function bus(): EventEmitter {
  if (!cache.__eventosPedidos) {
    const emisor = new EventEmitter();
    // Cada pantalla de barra abierta es un oyente; el límite por defecto (10)
    // se queda corto y Node avisaría de una fuga que no existe.
    emisor.setMaxListeners(100);
    cache.__eventosPedidos = emisor;
  }
  return cache.__eventosPedidos;
}

export type EventoPedido =
  | { tipo: "nuevo"; pedido: Pedido }
  | { tipo: "actualizado"; pedido: Pedido };

export function publicar(evento: EventoPedido): void {
  bus().emit("pedido", evento);
}

export function suscribir(fn: (evento: EventoPedido) => void): () => void {
  bus().on("pedido", fn);
  return () => {
    bus().off("pedido", fn);
  };
}
