"use client";

import { ArrowDown, Clock, MapPin, Phone } from "lucide-react";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { site } from "@/lib/site";

import fondo from "@/assets/media/comedor.webp";
import mesa from "@/assets/media/gambas-rojas.webp";

const señas = [
  { icono: MapPin, texto: `${site.direccion.calle} · ${site.direccion.ciudad}` },
  { icono: Clock, texto: site.notaHorario },
  { icono: Phone, texto: site.contacto.telefono },
];

export function Hero() {
  return (
    <section id="inicio" aria-label="Presentación">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={mesa}
        bgImageSrc={fondo}
        title="Taberna Ángel Belmonte"
        date="Andorra la Vella · desde 2000"
        scrollToExpand="Desliza para entrar"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl font-light italic leading-snug text-brass md:text-3xl">
            «{site.lema}»
          </p>

          <p className="parrafo mx-auto mt-8 max-w-2xl text-lg md:text-xl">
            Una casa de dos plantas en pleno centro de Andorra la Vella donde se
            cocina con producto de mercado y se trata el pescado con el respeto
            que pide. Treinta años de oficio, mesas puestas dos veces al día y
            una carta que cambia con lo que entra por la mañana.
          </p>

          <ul className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-sand sm:flex-row sm:gap-8">
            {señas.map(({ icono: Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2.5">
                <Icono className="size-4 shrink-0 text-brass" aria-hidden="true" />
                {texto}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`tel:${site.contacto.telefonoE164}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brass px-8 py-4 font-medium text-ink transition-colors hover:bg-cream sm:w-auto"
            >
              <Phone className="size-4" aria-hidden="true" />
              Reservar mesa
            </a>
            <a
              href="#carta"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-8 py-4 font-medium text-cream transition-colors hover:border-brass hover:text-brass sm:w-auto"
            >
              Ver la carta
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </ScrollExpandMedia>
    </section>
  );
}
