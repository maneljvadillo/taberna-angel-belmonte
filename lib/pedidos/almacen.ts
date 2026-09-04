import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { mkdirSync } from "node:fs";

import type { EstadoPedido, Pedido } from "./tipos";

/**
 * Almacén de pedidos sobre SQLite (`node:sqlite`, incluido en Node ≥ 22: sin
 * dependencias ni compilación nativa).
 *
 * IMPORTANTE: esto da por hecho **un proceso Node de larga vida** con disco
 * propio (un VPS, Railway, Render, Fly, o `next start` en una máquina). En un
 * despliegue sin servidor —Vercel por defecto— cada petición cae en una función
 * distinta, sin disco compartido ni memoria común: ni la base de datos ni el
 * flujo de eventos funcionarían. Ver README § Dónde desplegar.
 *
 * Si algún día hay que ir a serverless, lo único que cambia es este archivo:
 * el resto del código solo conoce las funciones de aquí abajo.
 */

const RUTA_DB =
  process.env.PEDIDOS_DB ?? path.join(process.cwd(), "data", "pedidos.db");

// En desarrollo, el recargado en caliente reevalúa los módulos: sin esta caché
// se abrirían conexiones nuevas a cada cambio.
const cache = globalThis as unknown as { __db?: DatabaseSync };

function db(): DatabaseSync {
  if (cache.__db) return cache.__db;

  mkdirSync(path.dirname(RUTA_DB), { recursive: true });

  const conexion = new DatabaseSync(RUTA_DB);
  conexion.exec("PRAGMA journal_mode = WAL");
  conexion.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id                     TEXT PRIMARY KEY,
      mesa                   TEXT NOT NULL,
      lineas                 TEXT NOT NULL,
      total_centimos         INTEGER NOT NULL,
      nota                   TEXT,
      estado                 TEXT NOT NULL,
      creado_en              TEXT NOT NULL,
      actualizado_en         TEXT NOT NULL,
      precios_provisionales  INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos (estado, creado_en);
  `);

  cache.__db = conexion;
  return conexion;
}

type Fila = {
  id: string;
  mesa: string;
  lineas: string;
  total_centimos: number;
  nota: string | null;
  estado: string;
  creado_en: string;
  actualizado_en: string;
  precios_provisionales: number;
};

const aPedido = (f: Fila): Pedido => ({
  id: f.id,
  mesa: f.mesa,
  lineas: JSON.parse(f.lineas),
  totalCentimos: f.total_centimos,
  nota: f.nota,
  estado: f.estado as EstadoPedido,
  creadoEn: f.creado_en,
  actualizadoEn: f.actualizado_en,
  preciosProvisionales: Boolean(f.precios_provisionales),
});

export function guardarPedido(pedido: Pedido): Pedido {
  db()
    .prepare(
      `INSERT INTO pedidos
         (id, mesa, lineas, total_centimos, nota, estado, creado_en, actualizado_en, precios_provisionales)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      pedido.id,
      pedido.mesa,
      JSON.stringify(pedido.lineas),
      pedido.totalCentimos,
      pedido.nota,
      pedido.estado,
      pedido.creadoEn,
      pedido.actualizadoEn,
      pedido.preciosProvisionales ? 1 : 0
    );

  return pedido;
}

/** Pedidos recientes, del más nuevo al más viejo. */
export function listarPedidos({
  desdeHoras = 12,
  limite = 100,
}: { desdeHoras?: number; limite?: number } = {}): Pedido[] {
  const desde = new Date(Date.now() - desdeHoras * 3600_000).toISOString();

  return (
    db()
      .prepare(
        `SELECT * FROM pedidos WHERE creado_en >= ? ORDER BY creado_en DESC LIMIT ?`
      )
      .all(desde, limite) as unknown as Fila[]
  ).map(aPedido);
}

export function obtenerPedido(id: string): Pedido | null {
  const fila = db()
    .prepare(`SELECT * FROM pedidos WHERE id = ?`)
    .get(id) as unknown as Fila | undefined;

  return fila ? aPedido(fila) : null;
}

export function cambiarEstado(id: string, estado: EstadoPedido): Pedido | null {
  const ahora = new Date().toISOString();

  db()
    .prepare(`UPDATE pedidos SET estado = ?, actualizado_en = ? WHERE id = ?`)
    .run(estado, ahora, id);

  return obtenerPedido(id);
}

/** Contadores para el encabezado de la pantalla de barra. */
export function contarPorEstado(): Record<string, number> {
  const filas = db()
    .prepare(
      `SELECT estado, COUNT(*) AS n FROM pedidos
        WHERE creado_en >= ? GROUP BY estado`
    )
    .all(new Date(Date.now() - 12 * 3600_000).toISOString()) as unknown as {
    estado: string;
    n: number;
  }[];

  return Object.fromEntries(filas.map((f) => [f.estado, f.n]));
}
