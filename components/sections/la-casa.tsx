import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

import comedor from "@/assets/media/comedor.webp";
import producto from "@/assets/media/navajas.webp";

// Etiquetas cortas a propósito: en cuatro columnas estrechas, cualquier cosa
// más larga se parte en tres líneas y desordena la banda.
const cifras = [
  { valor: "2000", etiqueta: "Apertura" },
  { valor: "+30", etiqueta: "Años de oficio" },
  { valor: "2", etiqueta: "Plantas" },
  { valor: "7/7", etiqueta: "Días abiertos" },
];

export function LaCasa() {
  return (
    <section
      id="la-casa"
      className="grano relative overflow-hidden border-t border-line bg-ink py-24 md:py-36"
      aria-labelledby="la-casa-titulo"
    >
      <div className="contenedor grid items-start gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="antetitulo">01 — La casa</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="la-casa-titulo"
              className="titular mt-7 text-4xl text-cream sm:text-5xl lg:text-6xl"
            >
              Treinta años de oficio
              <br />
              en una casa de piedra
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-9 space-y-6 text-base md:text-lg">
              <p className="parrafo">
                La taberna abrió sus puertas al empezar el nuevo milenio, pero el
                oficio venía de mucho antes: más de treinta años entre fogones,
                mercados y lonjas antes de poner el nombre en la puerta de la
                calle Ciutat de Consuegra.
              </p>
              <p className="parrafo">
                Ocupamos una casa tradicional repartida en dos plantas, en pleno
                centro de Andorra la Vella. Arriba y abajo se come lo mismo: cocina
                de mercado, sin florituras, con el producto escogido pieza a pieza
                y presentado como toca.
              </p>
              <p className="parrafo">
                Aquí el pescado manda. Andorra no tiene costa, así que lo que llega
                cada mañana condiciona lo que se sirve por la tarde. Si algo no está
                bien, no sale de la cocina.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
              {cifras.map((cifra) => (
                <div key={cifra.etiqueta} className="bg-ink-raised px-5 py-7">
                  <dt className="sr-only">{cifra.etiqueta}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-light text-brass">
                      {cifra.valor}
                    </span>
                    <span className="mt-2 block text-xs uppercase tracking-[0.14em] text-sand">
                      {cifra.etiqueta}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
            <Image
              src={comedor}
              alt="Comedor de la taberna: paredes verdes, vigas de pino a la vista, apliques de latón y mesas vestidas de blanco"
              fill
              placeholder="blur"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

          <div className="relative -mt-16 ml-auto w-3/4 overflow-hidden rounded-2xl border-4 border-ink shadow-2xl sm:-mt-20">
            <Image
              src={producto}
              alt="Navajas a la plancha con aceite, ajo y perejil, recién salidas de cocina"
              placeholder="blur"
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 66vw, 27vw"
            />
          </div>

          <p className="mt-8 border-l border-brass/40 pl-5 font-display text-lg font-light italic text-sand">
            {site.lemaEs}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
