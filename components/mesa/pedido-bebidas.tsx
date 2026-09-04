"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Minus, Plus, TriangleAlert } from "lucide-react";

import {
  PRECIOS_PROVISIONALES,
  bebidas,
  bebidasPorId,
  formatearEuros,
} from "@/lib/bebidas";
import { MAX_NOTA, MAX_UNIDADES } from "@/lib/pedidos/config";
import { cn } from "@/lib/utils";
import type { Pedido } from "@/lib/pedidos/tipos";

type Estado =
  | { fase: "eligiendo" }
  | { fase: "enviando" }
  | { fase: "enviado"; pedido: Pedido }
  | { fase: "error"; mensaje: string };

export function PedidoBebidas({ mesa }: { mesa: string | null }) {
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [nota, setNota] = useState("");
  const [estado, setEstado] = useState<Estado>({ fase: "eligiendo" });

  const lineas = useMemo(
    () =>
      Object.entries(carrito)
        .filter(([, u]) => u > 0)
        .map(([id, unidades]) => ({ bebida: bebidasPorId.get(id)!, unidades })),
    [carrito]
  );

  const total = lineas.reduce(
    (t, l) => t + l.bebida.precioCentimos * l.unidades,
    0
  );
  const unidadesTotales = lineas.reduce((t, l) => t + l.unidades, 0);

  const ajustar = (id: string, delta: number) =>
    setCarrito((c) => {
      const siguiente = Math.min(
        Math.max((c[id] ?? 0) + delta, 0),
        MAX_UNIDADES
      );
      const copia = { ...c };
      if (siguiente === 0) delete copia[id];
      else copia[id] = siguiente;
      return copia;
    });

  async function enviar() {
    if (!mesa || lineas.length === 0) return;
    setEstado({ fase: "enviando" });

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mesa,
          nota: nota.trim() || undefined,
          lineas: lineas.map((l) => ({
            bebidaId: l.bebida.id,
            unidades: l.unidades,
          })),
        }),
      });

      const datos = await res.json();

      if (!res.ok) {
        setEstado({
          fase: "error",
          mensaje: datos?.error ?? "No se ha podido enviar el pedido.",
        });
        return;
      }

      setCarrito({});
      setNota("");
      setEstado({ fase: "enviado", pedido: datos.pedido });
    } catch {
      setEstado({
        fase: "error",
        mensaje:
          "Sin conexión. Vuelve a intentarlo o pídeselo directamente al camarero.",
      });
    }
  }

  if (estado.fase === "enviado") {
    return <PedidoEnviado pedido={estado.pedido} onOtro={() => setEstado({ fase: "eligiendo" })} />;
  }

  return (
    <div className="pb-40">
      {!mesa && (
        <p className="mx-5 mt-6 flex items-start gap-3 rounded-xl border border-brass/40 bg-ink-raised p-4 text-sm text-sand">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden="true" />
          Para pedir desde el móvil, escanea el código QR que hay en tu mesa. Aquí
          puedes consultar la carta, pero el pedido necesita saber en qué mesa estás.
        </p>
      )}

      {PRECIOS_PROVISIONALES && (
        <p className="mx-5 mt-4 flex items-start gap-3 rounded-xl border border-ember/50 bg-ember/10 p-4 text-sm text-cream">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden="true" />
          <span>
            <strong className="font-medium">Precios sin confirmar.</strong> Esta
            carta de bebidas todavía lleva importes de prueba. No los tomes como
            buenos.
          </span>
        </p>
      )}

      {bebidas.map((grupo) => (
        <section key={grupo.id} className="mt-8" aria-labelledby={`grupo-${grupo.id}`}>
          <h2
            id={`grupo-${grupo.id}`}
            className="px-5 font-display text-xl font-light text-brass"
          >
            {grupo.titulo}
          </h2>

          <ul className="mt-2 px-5">
            {grupo.bebidas.map((bebida) => {
              const unidades = carrito[bebida.id] ?? 0;

              return (
                <li
                  key={bebida.id}
                  className="flex items-center gap-4 border-b border-line py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-cream">{bebida.nombre}</p>
                    {bebida.descripcion && (
                      <p className="mt-0.5 text-xs text-sand">{bebida.descripcion}</p>
                    )}
                    <p className="mt-1 text-sm text-brass tabular-nums">
                      {formatearEuros(bebida.precioCentimos)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => ajustar(bebida.id, -1)}
                      disabled={unidades === 0}
                      aria-label={`Quitar una unidad de ${bebida.nombre}`}
                      className="grid size-11 place-items-center rounded-full border border-line text-cream transition-colors enabled:hover:border-brass enabled:hover:text-brass disabled:opacity-25"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>

                    <span
                      aria-live="polite"
                      aria-label={`${unidades} de ${bebida.nombre}`}
                      className={cn(
                        "w-7 text-center font-display text-lg tabular-nums",
                        unidades > 0 ? "text-brass" : "text-sand/40"
                      )}
                    >
                      {unidades}
                    </span>

                    <button
                      type="button"
                      onClick={() => ajustar(bebida.id, 1)}
                      disabled={unidades >= MAX_UNIDADES || !mesa}
                      aria-label={`Añadir una unidad de ${bebida.nombre}`}
                      className="grid size-11 place-items-center rounded-full border border-brass/60 text-brass transition-colors enabled:hover:bg-brass enabled:hover:text-ink disabled:opacity-25"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {mesa && lineas.length > 0 && (
        <div className="mt-8 px-5">
          <label
            htmlFor="nota-pedido"
            className="block text-xs uppercase tracking-[0.18em] text-brass"
          >
            ¿Algo que debamos saber?
          </label>
          <textarea
            id="nota-pedido"
            value={nota}
            onChange={(e) => setNota(e.target.value.slice(0, MAX_NOTA))}
            rows={2}
            placeholder="Una sin alcohol, el gin-tonic sin hielo…"
            className="mt-2 w-full resize-none rounded-xl border border-line bg-ink-raised p-3 text-sm text-cream placeholder:text-sand/50 focus:border-brass focus:outline-none"
          />
        </div>
      )}

      {estado.fase === "error" && (
        <p
          role="alert"
          className="mx-5 mt-6 rounded-xl border border-ember/60 bg-ember/10 p-4 text-sm text-cream"
        >
          {estado.mensaje}
        </p>
      )}

      {/* Barra de pedido: se queda pegada abajo, al alcance del pulgar. */}
      {mesa && unidadesTotales > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-lg items-center gap-4">
            <div className="min-w-0">
              <p className="text-xs text-sand">
                {unidadesTotales}{" "}
                {unidadesTotales === 1 ? "bebida" : "bebidas"}
              </p>
              <p className="font-display text-2xl text-cream tabular-nums">
                {formatearEuros(total)}
              </p>
            </div>

            <button
              type="button"
              onClick={enviar}
              disabled={estado.fase === "enviando"}
              className="ml-auto inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brass px-6 font-medium text-ink transition-colors hover:bg-cream disabled:opacity-60"
            >
              {estado.fase === "enviando" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Enviando…
                </>
              ) : (
                <>Pedir a barra</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PedidoEnviado({
  pedido,
  onOtro,
}: {
  pedido: Pedido;
  onOtro: () => void;
}) {
  return (
    <div className="px-5 py-12 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-brass text-ink">
        <Check className="size-8" aria-hidden="true" />
      </span>

      <h2 className="titular mt-6 text-3xl text-cream">Pedido enviado</h2>
      <p className="parrafo mx-auto mt-3 max-w-sm text-sm">
        Ha entrado en la barra. Si tardamos más de la cuenta, avísanos y lo
        miramos.
      </p>

      <ul className="mx-auto mt-8 max-w-sm text-left">
        {pedido.lineas.map((linea) => (
          <li
            key={linea.bebidaId}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-sm"
          >
            <span className="text-cream">
              <span className="mr-2 text-brass tabular-nums">
                {linea.unidades}×
              </span>
              {linea.nombre}
            </span>
            <span className="shrink-0 text-sand tabular-nums">
              {formatearEuros(linea.precioCentimos * linea.unidades)}
            </span>
          </li>
        ))}
        <li className="flex items-baseline justify-between gap-4 pt-4">
          <span className="text-sand">Total · mesa {pedido.mesa}</span>
          <span className="font-display text-xl text-cream tabular-nums">
            {formatearEuros(pedido.totalCentimos)}
          </span>
        </li>
      </ul>

      <button
        type="button"
        onClick={onOtro}
        className="mt-10 inline-flex min-h-12 items-center rounded-full border border-line px-7 text-sm text-cream transition-colors hover:border-brass hover:text-brass"
      >
        Pedir algo más
      </button>
    </div>
  );
}
