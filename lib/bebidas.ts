/**
 * Carta de bebidas para el pedido desde la mesa.
 *
 * ⚠️ LOS PRECIOS SON PROVISIONALES. Los ha puesto el desarrollador para poder
 * montar y probar la pantalla; NO son los de la casa. Mientras
 * `PRECIOS_PROVISIONALES` sea `true`, la carta digital lo advierte en pantalla
 * y la pantalla de barra marca los pedidos como «precios sin confirmar».
 *
 * Para publicar: repasa nombres y precios con la taberna, corrige esta lista y
 * pon `PRECIOS_PROVISIONALES = false`.
 */
export const PRECIOS_PROVISIONALES = true;

export type Bebida = {
  /** Identificador estable. No lo cambies una vez haya pedidos hechos. */
  id: string;
  nombre: string;
  descripcion?: string;
  /** En céntimos de euro, para no arrastrar errores de coma flotante. */
  precioCentimos: number;
};

export type GrupoBebidas = {
  id: string;
  titulo: string;
  bebidas: Bebida[];
};

export const bebidas: GrupoBebidas[] = [
  {
    id: "cervezas",
    titulo: "Cervezas",
    bebidas: [
      { id: "cana", nombre: "Caña", precioCentimos: 250 },
      { id: "doble", nombre: "Doble", precioCentimos: 350 },
      { id: "tercio", nombre: "Tercio", precioCentimos: 380 },
      { id: "clara", nombre: "Clara", precioCentimos: 280 },
      { id: "cerveza-sin", nombre: "Cerveza sin alcohol", precioCentimos: 300 },
    ],
  },
  {
    id: "vinos",
    titulo: "Vinos por copa",
    bebidas: [
      { id: "tinto-casa", nombre: "Tinto de la casa", precioCentimos: 300 },
      { id: "blanco-casa", nombre: "Blanco de la casa", precioCentimos: 300 },
      { id: "rioja-crianza", nombre: "Rioja crianza", precioCentimos: 420 },
      { id: "verdejo", nombre: "Verdejo", precioCentimos: 400 },
      { id: "albarino", nombre: "Albariño", precioCentimos: 450 },
      { id: "cava", nombre: "Cava", precioCentimos: 420 },
    ],
  },
  {
    id: "aperitivos",
    titulo: "Vermut y aperitivos",
    bebidas: [
      { id: "vermut-rojo", nombre: "Vermut rojo", descripcion: "Con su hielo, aceituna y naranja", precioCentimos: 400 },
      { id: "vermut-blanco", nombre: "Vermut blanco", precioCentimos: 400 },
      { id: "tinto-verano", nombre: "Tinto de verano", precioCentimos: 350 },
    ],
  },
  {
    id: "refrescos",
    titulo: "Refrescos y aguas",
    bebidas: [
      { id: "agua-50", nombre: "Agua mineral 50 cl", precioCentimos: 220 },
      { id: "agua-gas", nombre: "Agua con gas", precioCentimos: 280 },
      { id: "cola", nombre: "Coca-Cola", precioCentimos: 300 },
      { id: "cola-zero", nombre: "Coca-Cola Zero", precioCentimos: 300 },
      { id: "naranja", nombre: "Refresco de naranja", precioCentimos: 300 },
      { id: "limon", nombre: "Refresco de limón", precioCentimos: 300 },
      { id: "tonica", nombre: "Tónica", precioCentimos: 300 },
      { id: "zumo", nombre: "Zumo natural de naranja", precioCentimos: 380 },
    ],
  },
  {
    id: "cafes",
    titulo: "Cafés e infusiones",
    bebidas: [
      { id: "cafe-solo", nombre: "Café solo", precioCentimos: 180 },
      { id: "cortado", nombre: "Cortado", precioCentimos: 190 },
      { id: "cafe-leche", nombre: "Café con leche", precioCentimos: 210 },
      { id: "descafeinado", nombre: "Descafeinado", precioCentimos: 200 },
      { id: "carajillo", nombre: "Carajillo", precioCentimos: 320 },
      { id: "infusion", nombre: "Infusión", precioCentimos: 200 },
    ],
  },
  {
    id: "copas",
    titulo: "Copas y licores",
    bebidas: [
      { id: "orujo", nombre: "Orujo de hierbas", precioCentimos: 350 },
      { id: "pacharan", nombre: "Pacharán", precioCentimos: 350 },
      { id: "gin-tonic", nombre: "Gin-tonic", precioCentimos: 900 },
      { id: "ron-cola", nombre: "Ron con cola", precioCentimos: 850 },
      { id: "whisky", nombre: "Whisky", precioCentimos: 800 },
    ],
  },
];

/** Índice plano por id, para resolver un pedido en el servidor. */
export const bebidasPorId = new Map(
  bebidas.flatMap((g) => g.bebidas.map((b) => [b.id, b] as const))
);

/** 250 → «2,50 €» */
export function formatearEuros(centimos: number): string {
  return `${(centimos / 100).toFixed(2).replace(".", ",")} €`;
}
