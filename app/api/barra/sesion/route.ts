import { cookies } from "next/headers";

import { COOKIE_BARRA, barraConfigurada, comprobarClave } from "@/lib/pedidos/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DURACION = 60 * 60 * 24 * 30; // 30 días: es una pantalla fija en barra.

/** Inicia sesión en la pantalla de barra a partir de la clave compartida. */
export async function POST(req: Request) {
  if (!barraConfigurada()) {
    return Response.json(
      { error: "BARRA_TOKEN no está configurada en el servidor." },
      { status: 503 }
    );
  }

  const { clave } = (await req.json().catch(() => ({}))) as { clave?: string };

  if (!clave || !comprobarClave(clave)) {
    return Response.json({ error: "Clave incorrecta." }, { status: 401 });
  }

  // httpOnly para que ningún script de la página pueda leerla; así `EventSource`
  // se autentica solo, sin pasar la clave por la URL (donde acabaría en los
  // registros del servidor).
  (await cookies()).set(COOKIE_BARRA, clave, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION,
  });

  return Response.json({ ok: true });
}

/** Cierra la sesión de barra. */
export async function DELETE() {
  (await cookies()).delete(COOKIE_BARRA);
  return Response.json({ ok: true });
}
