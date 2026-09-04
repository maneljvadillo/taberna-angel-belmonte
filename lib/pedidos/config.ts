/** Número de mesas con QR. Define qué valores de `/mesa/[numero]` son válidos. */
export const NUMERO_MESAS = Math.min(
  Math.max(Number(process.env.NEXT_PUBLIC_NUMERO_MESAS ?? 20) || 20, 1),
  200
);

export const MAX_LINEAS = 30;
export const MAX_UNIDADES = 20;
export const MAX_NOTA = 280;

export function mesaValida(mesa: string): boolean {
  if (!/^\d{1,3}$/.test(mesa)) return false;
  const n = Number(mesa);
  return n >= 1 && n <= NUMERO_MESAS;
}
