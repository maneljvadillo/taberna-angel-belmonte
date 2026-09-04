import { randomUUID } from "node:crypto";

import { PRECIOS_PROVISIONALES, bebidasPorId } from "@/lib/bebidas";
import { autorizarBarra } from "@/lib/pedidos/auth";
import { MAX_LINEAS, MAX_NOTA, MAX_UNIDADES, mesaValida } from "@/lib/pedidos/config";
import { publicar } from "@/lib/pedidos/eventos";
import { identificar, permitido } from "@/lib/pedidos/limite";
import { guardarPedido, listarPedidos } from "@/lib/pedidos/almacen";
import type { LineaPedido, Pedido, PedidoEntrante } from "@/lib/pedidos/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Alta de un pedido desde la mesa. Ruta abierta: la usa el móvil del cliente.
 *
 * El cuerpo solo trae identificadores y unidades. **Los nombres y los precios
 * los pone el servidor** a partir de `lib/bebidas.ts`: si vinieran del cliente,
 * cualquiera podría pedir un gin-tonic a cero euros.
 */
export async function POST(req: Request) {
  if (!permitido(identificar(req))) {
    return Response.json(
      { error: "Demasiados pedidos seguidos. Espera un momento o avisa al camarero." },
      { status: 429 }
    );
  }

  let cuerpo: PedidoEntrante;
  try {
    cuerpo = await req.json();
  } catch {
    return Response.json({ error: "Petición mal formada." }, { status: 400 });
  }

  const mesa = String(cuerpo?.mesa ?? "").trim();
  if (!mesaValida(mesa)) {
    return Response.json({ error: "Mesa no válida." }, { status: 400 });
  }

  if (!Array.isArray(cuerpo.lineas) || cuerpo.lineas.length === 0) {
    return Response.json({ error: "El pedido está vacío." }, { status: 400 });
  }

  if (cuerpo.lineas.length > MAX_LINEAS) {
    return Response.json({ error: "Demasiadas líneas en el pedido." }, { status: 400 });
  }

  const lineas: LineaPedido[] = [];

  for (const entrada of cuerpo.lineas) {
    const bebida = bebidasPorId.get(String(entrada?.bebidaId));
    if (!bebida) {
      return Response.json(
        { error: `«${entrada?.bebidaId}» ya no está en la carta.` },
        { status: 400 }
      );
    }

    const unidades = Math.floor(Number(entrada?.unidades));
    if (!Number.isFinite(unidades) || unidades < 1 || unidades > MAX_UNIDADES) {
      return Response.json(
        { error: `Cantidad no válida en «${bebida.nombre}».` },
        { status: 400 }
      );
    }

    lineas.push({
      bebidaId: bebida.id,
      nombre: bebida.nombre,
      precioCentimos: bebida.precioCentimos,
      unidades,
    });
  }

  const ahora = new Date().toISOString();
  const pedido: Pedido = {
    id: randomUUID(),
    mesa,
    lineas,
    totalCentimos: lineas.reduce(
      (t, l) => t + l.precioCentimos * l.unidades,
      0
    ),
    nota: String(cuerpo.nota ?? "").trim().slice(0, MAX_NOTA) || null,
    estado: "nuevo",
    creadoEn: ahora,
    actualizadoEn: ahora,
    preciosProvisionales: PRECIOS_PROVISIONALES,
  };

  guardarPedido(pedido);
  publicar({ tipo: "nuevo", pedido });

  return Response.json({ pedido }, { status: 201 });
}

/** Listado para la pantalla de barra. */
export async function GET(req: Request) {
  const auth = await autorizarBarra(req);
  if (!auth.ok) {
    return Response.json({ error: auth.mensaje }, { status: auth.estado });
  }

  return Response.json({ pedidos: listarPedidos() });
}
