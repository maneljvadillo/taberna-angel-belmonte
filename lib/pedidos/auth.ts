import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

/**
 * Acceso a la pantalla de barra.
 *
 * Es una clave compartida, no un sistema de usuarios: para una barra con un
 * móvil o una tablet fija es lo proporcionado. Quien tenga la clave, entra.
 *
 * Lo que sí hace falta antes de publicar:
 *   · Poner `BARRA_TOKEN` en el entorno (ver .env.example). Sin esa variable,
 *     todas las rutas protegidas responden 503: es preferible que la pantalla
 *     no funcione a que quede abierta a cualquiera.
 *   · Servir por HTTPS, o la clave viaja en claro.
 */
export const COOKIE_BARRA = "barra_sesion";

function claveConfigurada(): string | null {
  const clave = process.env.BARRA_TOKEN?.trim();
  return clave && clave.length >= 12 ? clave : null;
}

/** Comparación en tiempo constante, para no filtrar la clave por temporización. */
function coincide(recibida: string, esperada: string): boolean {
  const a = Buffer.from(recibida);
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type ResultadoAuth =
  | { ok: true }
  | { ok: false; estado: 401 | 503; mensaje: string };

/** Comprueba la cookie de sesión o la cabecera `x-barra-token`. */
export async function autorizarBarra(req: Request): Promise<ResultadoAuth> {
  const esperada = claveConfigurada();

  if (!esperada) {
    return {
      ok: false,
      estado: 503,
      mensaje:
        "BARRA_TOKEN no está configurada. La pantalla de barra queda desactivada.",
    };
  }

  const cabecera = req.headers.get("x-barra-token");
  if (cabecera && coincide(cabecera, esperada)) return { ok: true };

  const cookie = (await cookies()).get(COOKIE_BARRA)?.value;
  if (cookie && coincide(cookie, esperada)) return { ok: true };

  return { ok: false, estado: 401, mensaje: "Clave de barra incorrecta." };
}

export function comprobarClave(clave: string): boolean {
  const esperada = claveConfigurada();
  return Boolean(esperada && coincide(clave, esperada));
}

export function barraConfigurada(): boolean {
  return claveConfigurada() !== null;
}
