"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Pestana = "carta" | "bebidas";

/**
 * Marco de la vista de mesa: cabecera fina y dos pestañas.
 *
 * `comida` llega como nodo ya renderizado en servidor, de modo que la carta no
 * pasa por el bundle de cliente: en la mesa solo se descarga JavaScript para lo
 * que de verdad es interactivo, el pedido de bebidas.
 */
export function VistaMesa({
  mesa,
  comida,
  bebidas,
}: {
  mesa: string | null;
  comida: ReactNode;
  bebidas: ReactNode;
}) {
  const [pestana, setPestana] = useState<Pestana>("carta");

  return (
    <div className="mx-auto min-h-[100dvh] max-w-lg bg-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <p className="leading-none">
            <span className="block text-[0.55rem] font-medium uppercase tracking-[0.4em] text-brass">
              Taberna
            </span>
            <span className="mt-1 block font-display text-base font-light tracking-[0.12em] text-cream">
              ÁNGEL BELMONTE
            </span>
          </p>

          {mesa && (
            <p className="rounded-full border border-brass/50 px-3.5 py-1.5 text-sm text-brass">
              Mesa {mesa}
            </p>
          )}
        </div>

        <div role="tablist" aria-label="Carta y bebidas" className="flex px-5">
          {(
            [
              ["carta", "La carta"],
              ["bebidas", "Pedir bebidas"],
            ] as const
          ).map(([id, etiqueta]) => (
            <button
              key={id}
              role="tab"
              id={`pestana-${id}`}
              aria-selected={pestana === id}
              aria-controls={`panel-${id}`}
              onClick={() => setPestana(id)}
              className={cn(
                "relative min-h-12 flex-1 text-sm font-medium transition-colors",
                pestana === id ? "text-brass" : "text-sand"
              )}
            >
              {etiqueta}
              <span
                className={cn(
                  "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors",
                  pestana === id ? "bg-brass" : "bg-transparent"
                )}
              />
            </button>
          ))}
        </div>
      </header>

      <div
        role="tabpanel"
        id="panel-carta"
        aria-labelledby="pestana-carta"
        hidden={pestana !== "carta"}
      >
        {comida}
      </div>

      <div
        role="tabpanel"
        id="panel-bebidas"
        aria-labelledby="pestana-bebidas"
        hidden={pestana !== "bebidas"}
      >
        {bebidas}
      </div>
    </div>
  );
}
