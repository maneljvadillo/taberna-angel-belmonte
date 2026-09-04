import { autorizarBarra } from "@/lib/pedidos/auth";
import { suscribir } from "@/lib/pedidos/eventos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LATIDO_MS = 25_000;

/**
 * Flujo de eventos hacia la pantalla de barra (SSE).
 *
 * Se eligió SSE y no WebSocket porque el tráfico va en un solo sentido
 * —servidor → barra— y SSE reconecta solo, sin librerías ni servidor aparte.
 *
 * `EventSource` no permite cabeceras propias, así que la autorización va por
 * cookie de sesión (ver `app/api/barra/sesion`).
 */
export async function GET(req: Request) {
  const auth = await autorizarBarra(req);
  if (!auth.ok) {
    return Response.json({ error: auth.mensaje }, { status: auth.estado });
  }

  const codificador = new TextEncoder();

  const flujo = new ReadableStream({
    start(controlador) {
      let cerrado = false;

      const enviar = (evento: string, datos: unknown) => {
        if (cerrado) return;
        try {
          controlador.enqueue(
            codificador.encode(
              `event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`
            )
          );
        } catch {
          cerrado = true;
        }
      };

      enviar("listo", { en: new Date().toISOString() });

      const desuscribir = suscribir((evento) => enviar("pedido", evento));

      // Sin tráfico, los proxys cortan la conexión: un latido periódico la
      // mantiene viva y hace que el navegador detecte antes una caída.
      const latido = setInterval(() => enviar("latido", Date.now()), LATIDO_MS);

      const cerrar = () => {
        if (cerrado) return;
        cerrado = true;
        clearInterval(latido);
        desuscribir();
        try {
          controlador.close();
        } catch {
          /* ya estaba cerrado */
        }
      };

      req.signal.addEventListener("abort", cerrar);
    },
  });

  return new Response(flujo, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Evita que Nginx acumule la respuesta en un búfer y rompa el directo.
      "X-Accel-Buffering": "no",
    },
  });
}
