import { autorizarBarra } from "@/lib/pedidos/auth";
import { cambiarEstado } from "@/lib/pedidos/almacen";
import { publicar } from "@/lib/pedidos/eventos";
import { ESTADOS, type EstadoPedido } from "@/lib/pedidos/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Cambia el estado de un pedido desde la barra. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await autorizarBarra(req);
  if (!auth.ok) {
    return Response.json({ error: auth.mensaje }, { status: auth.estado });
  }

  const { id } = await params;
  const { estado } = (await req.json().catch(() => ({}))) as {
    estado?: string;
  };

  if (!ESTADOS.includes(estado as EstadoPedido)) {
    return Response.json({ error: "Estado no válido." }, { status: 400 });
  }

  const pedido = cambiarEstado(id, estado as EstadoPedido);
  if (!pedido) {
    return Response.json({ error: "Pedido no encontrado." }, { status: 404 });
  }

  publicar({ tipo: "actualizado", pedido });

  return Response.json({ pedido });
}
