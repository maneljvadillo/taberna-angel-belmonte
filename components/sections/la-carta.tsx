"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { avisoCarta, carta } from "@/lib/menu";
import { cn } from "@/lib/utils";

export function LaCarta() {
  const [activa, setActiva] = useState(0);
  const pestañas = useRef<(HTMLButtonElement | null)[]>([]);
  const seccion = carta[activa];

  // Navegación con flechas dentro del grupo de pestañas (patrón ARIA tabs).
  const alPulsar = (e: React.KeyboardEvent) => {
    const salto =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!salto) return;
    e.preventDefault();
    const siguiente = (activa + salto + carta.length) % carta.length;
    setActiva(siguiente);
    pestañas.current[siguiente]?.focus();
  };

  return (
    <section
      id="carta"
      className="relative border-t border-line bg-ink-raised py-24 md:py-36"
      aria-labelledby="carta-titulo"
    >
      <div className="contenedor">
        <div className="max-w-2xl">
          <Reveal>
            <p className="antetitulo">02 — La carta</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="carta-titulo"
              className="titular mt-7 text-4xl text-cream sm:text-5xl lg:text-6xl"
            >
              Lo que sale hoy
              <br />
              de la cocina
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="parrafo mt-7 text-lg">
              Cocina de mercado: la lista es la de siempre, el producto es el de
              esta mañana. Estas son las casas fuertes de la taberna.
            </p>
          </Reveal>
        </div>

        {/* Pestañas de sección */}
        <Reveal delay={0.15}>
          <div
            role="tablist"
            aria-label="Secciones de la carta"
            onKeyDown={alPulsar}
            className="mt-14 flex gap-2 overflow-x-auto border-b border-line pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {carta.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  pestañas.current[i] = el;
                }}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={i === activa}
                aria-controls={`panel-${s.id}`}
                tabIndex={i === activa ? 0 : -1}
                onClick={() => setActiva(i)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap px-5 py-4 text-sm font-medium transition-colors",
                  i === activa
                    ? "text-brass"
                    : "text-sand hover:text-cream"
                )}
              >
                {s.titulo}
                {i === activa && (
                  <motion.span
                    layoutId="carta-subrayado"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brass"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={`panel-${seccion.id}`}
          aria-labelledby={`tab-${seccion.id}`}
          className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.62fr] lg:gap-20"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={seccion.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="max-w-xl font-display text-xl font-light italic leading-relaxed text-sand">
                {seccion.entradilla}
              </p>

              <ul className="mt-10">
                {seccion.platos.map((plato) => (
                  <li
                    key={plato.nombre}
                    className="border-b border-line py-6 first:border-t"
                  >
                    {plato.destacado && (
                      <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-brass">
                        De la casa
                      </p>
                    )}
                    <div className="flex items-baseline justify-between gap-6">
                      <h3 className="font-display text-xl font-normal text-cream md:text-2xl">
                        {plato.nombre}
                      </h3>

                      {plato.precio && (
                        <span
                          aria-label={`${plato.precio} euros`}
                          className="shrink-0 font-display text-lg text-brass tabular-nums"
                        >
                          {plato.precio} €
                        </span>
                      )}
                    </div>
                    <p className="parrafo mt-2.5 max-w-xl text-[0.95rem]">
                      {plato.descripcion}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Imagen de la sección: acompaña sin robar protagonismo a la lista. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={seccion.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-3/4 overflow-hidden rounded-2xl"
              >
                <Image
                  src={seccion.imagen}
                  alt={seccion.imagenAlt}
                  fill
                  placeholder="blur"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 34vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" />
                <p className="absolute inset-x-6 bottom-6 font-display text-2xl font-light text-cream">
                  {seccion.titulo}
                </p>
              </motion.div>
            </AnimatePresence>

            <p className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-ink/60 p-5 text-sm leading-relaxed text-sand">
              <Info className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden="true" />
              {avisoCarta}
            </p>

            <Link
              href="/carta"
              className="mt-4 inline-flex items-center gap-2 text-sm text-brass underline decoration-brass/40 underline-offset-4 transition-colors hover:decoration-brass"
            >
              Abrir la carta en el móvil
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
