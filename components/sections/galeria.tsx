"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { galeria } from "@/lib/gallery";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Cada foto conserva su propia proporción. Con columnas CSS, las tarjetas
 * fluyen una debajo de otra sin dejar los huecos que deja una retícula cuando
 * las alturas de una misma fila no coinciden.
 */
const PROPORCIONES: Record<string, string> = {
  corta: "aspect-4/3",
  alta: "aspect-4/5",
  "muy-alta": "aspect-3/4",
};

export function Galeria() {
  const [abierta, setAbierta] = useState<number | null>(null);

  const mover = useCallback((salto: number) => {
    setAbierta((actual) =>
      actual === null ? null : (actual + salto + galeria.length) % galeria.length
    );
  }, []);

  useEffect(() => {
    if (abierta === null) return;

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(null);
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", alPulsar);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", alPulsar);
    };
  }, [abierta, mover]);

  const foto = abierta === null ? null : galeria[abierta];

  return (
    <section
      id="galeria"
      className="grano relative overflow-hidden border-t border-line bg-ink py-24 md:py-36"
      aria-labelledby="galeria-titulo"
    >
      <div className="contenedor">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal>
              <p className="antetitulo">03 — Galería</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="galeria-titulo"
                className="titular mt-7 text-4xl text-cream sm:text-5xl lg:text-6xl"
              >
                La taberna,
                <br />
                por dentro
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <p className="parrafo max-w-sm text-sm">
              Publicamos el día a día en Instagram: sugerencias, producto de la
              mañana y lo que se cuece en el pase.{" "}
              <a
                href={site.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass underline decoration-brass/40 underline-offset-4 transition-colors hover:decoration-brass"
              >
                {site.redes.instagramHandle}
              </a>
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 gap-4 [column-gap:1rem] sm:columns-2 lg:columns-3">
          {galeria.map((foto, i) => (
            <li key={foto.pie} className="mb-4 break-inside-avoid">
              <Reveal delay={(i % 3) * 0.06}>
              <button
                type="button"
                onClick={() => setAbierta(i)}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-xl bg-ink-raised",
                  PROPORCIONES[foto.alto]
                )}
              >
                <Image
                  src={foto.imagen}
                  alt={foto.alt}
                  fill
                  placeholder="blur"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute inset-0 bg-ink/20 transition-colors duration-500 group-hover:bg-ink/45" />

                <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-sm text-cream">{foto.pie}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brass text-ink">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="sr-only">Ampliar: {foto.pie}</span>
              </button>
              </Reveal>
            </li>
          ))}
        </ul>

      </div>

      {/* Visor ampliado */}
      <AnimatePresence>
        {foto && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={foto.pie}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm md:p-10"
            onClick={() => setAbierta(null)}
          >
            <button
              type="button"
              onClick={() => setAbierta(null)}
              className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-brass hover:text-brass md:right-8 md:top-8"
              aria-label="Cerrar"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                mover(-1);
              }}
              className="absolute left-3 z-10 grid size-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-brass hover:text-brass md:left-8"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                mover(1);
              }}
              className="absolute right-3 z-10 grid size-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-brass hover:text-brass md:right-8 md:top-auto"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>

            <motion.figure
              key={foto.pie}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-full w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={foto.imagen}
                alt={foto.alt}
                placeholder="blur"
                className="max-h-[75dvh] w-full rounded-xl object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
              />
              <figcaption className="mt-5 text-center text-sm text-sand">
                {foto.pie}
                <span className="mx-3 text-line">·</span>
                {(abierta ?? 0) + 1} / {galeria.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
