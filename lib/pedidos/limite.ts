/**
 * Freno de peticiones para el alta de pedidos, que es la única ruta abierta.
 *
 * Ventana deslizante en memoria: suficiente para evitar que alguien llene la
 * pantalla de barra desde el móvil, y no pretende ser más que eso. Con varias
 * instancias haría falta llevarlo a Redis, igual que el bus de eventos.
 */
const VENTANA_MS = 5 * 60_000;
const MAX_POR_VENTANA = 12;

const cache = globalThis as unknown as { __limite?: Map<string, number[]> };
const registro = (cache.__limite ??= new Map<string, number[]>());

export function permitido(clave: string): boolean {
  const ahora = Date.now();
  const recientes = (registro.get(clave) ?? []).filter(
    (t) => ahora - t < VENTANA_MS
  );

  if (recientes.length >= MAX_POR_VENTANA) {
    registro.set(clave, recientes);
    return false;
  }

  recientes.push(ahora);
  registro.set(clave, recientes);

  // Limpieza perezosa para que el mapa no crezca sin fin.
  if (registro.size > 5000) {
    for (const [k, v] of registro) {
      if (v.every((t) => ahora - t >= VENTANA_MS)) registro.delete(k);
    }
  }

  return true;
}

export function identificar(req: Request): string {
  const reenviado = req.headers.get("x-forwarded-for");
  return reenviado?.split(",")[0]?.trim() || "desconocido";
}
