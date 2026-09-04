import Image from "next/image";

import { avisoCarta, carta } from "@/lib/menu";

/**
 * La carta de cocina tal y como se lee en la mesa.
 *
 * Se renderiza en servidor y no lleva nada interactivo: quien la abre está
 * sentado, con una barra de cobertura regular y ganas de leer, no de esperar.
 */
export function CartaComida() {
  return (
    <div className="pb-10">
      <nav aria-label="Secciones de la carta" className="px-5 pt-6">
        <ul className="flex flex-wrap gap-2">
          {carta.map((s) => (
            <li key={s.id}>
              <a
                href={`#comida-${s.id}`}
                className="inline-block rounded-full border border-line px-4 py-2 text-sm text-cream/80 transition-colors hover:border-brass hover:text-brass"
              >
                {s.titulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {carta.map((seccion) => (
        <section
          key={seccion.id}
          id={`comida-${seccion.id}`}
          aria-labelledby={`comida-${seccion.id}-titulo`}
          className="mt-10 scroll-mt-32"
        >
          <div className="relative mx-5 h-28 overflow-hidden rounded-xl">
            <Image
              src={seccion.imagen}
              alt={seccion.imagenAlt}
              fill
              placeholder="blur"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/50 to-ink/10" />
            <h2
              id={`comida-${seccion.id}-titulo`}
              className="titular absolute inset-x-5 bottom-3 text-2xl text-cream"
            >
              {seccion.titulo}
            </h2>
          </div>

          <p className="px-5 pt-4 font-display text-base font-light italic leading-relaxed text-sand">
            {seccion.entradilla}
          </p>

          <ul className="mt-2 px-5">
            {seccion.platos.map((plato) => (
              <li key={plato.nombre} className="border-b border-line py-4">
                {plato.destacado && (
                  <p className="mb-1 text-[0.6rem] uppercase tracking-[0.18em] text-brass">
                    De la casa
                  </p>
                )}
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg font-normal text-cream">
                    {plato.nombre}
                  </h3>
                  {plato.precio && (
                    <span
                      aria-label={`${plato.precio} euros`}
                      className="shrink-0 font-display text-base text-brass tabular-nums"
                    >
                      {plato.precio} €
                    </span>
                  )}
                </div>
                <p className="parrafo mt-1.5 text-sm">{plato.descripcion}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mx-5 mt-8 rounded-xl border border-line bg-ink-raised p-4 text-xs leading-relaxed text-sand">
        {avisoCarta}
      </p>
    </div>
  );
}
