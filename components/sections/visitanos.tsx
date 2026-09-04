import { Check, Clock3, Mail, MapPin, Navigation, Phone } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

const { direccion, contacto, horarios } = site;

/**
 * Recorte del mapa alrededor del local. Se calcula a partir de las coordenadas
 * de `lib/site.ts` para que ambas no puedan quedar desincronizadas.
 */
const MARGEN_LNG = 0.006;
const MARGEN_LAT = 0.003;
const BBOX = [
  direccion.lng - MARGEN_LNG,
  direccion.lat - MARGEN_LAT,
  direccion.lng + MARGEN_LNG,
  direccion.lat + MARGEN_LAT,
].join(",");
const MAPA_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${direccion.lat},${direccion.lng}`;

export function Visitanos() {
  return (
    <section
      id="visitanos"
      className="border-t border-line bg-ink-raised py-24 md:py-36"
      aria-labelledby="visitanos-titulo"
    >
      <div className="contenedor">
        <div className="max-w-2xl">
          <Reveal>
            <p className="antetitulo">04 — Visítanos</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="visitanos-titulo"
              className="titular mt-7 text-4xl text-cream sm:text-5xl lg:text-6xl"
            >
              En el centro,
              <br />
              a dos calles de todo
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="parrafo mt-7 text-lg">
              Estamos en {direccion.edificio}, en la calle{" "}
              {direccion.calle.replace("Carrer ", "")}, en pleno casco de{" "}
              {direccion.ciudad}. Dos plantas de comedor, con ascensor.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="space-y-10">
              {/* Dirección */}
              <div className="border-t border-line pt-8">
                <h3 className="antetitulo">Dirección</h3>
                <address className="mt-5 not-italic">
                  <p className="font-display text-2xl font-light text-cream">
                    {direccion.calle}
                  </p>
                  <p className="mt-1.5 text-sand">
                    {direccion.edificio} · {direccion.codigoPostal}{" "}
                    {direccion.ciudad}, {direccion.pais}
                  </p>
                </address>
                <a
                  href={site.comoLlegarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-brass underline decoration-brass/40 underline-offset-4 transition-colors hover:decoration-brass"
                >
                  <Navigation className="size-3.5" aria-hidden="true" />
                  Cómo llegar
                </a>
              </div>

              {/* Horarios */}
              <div className="border-t border-line pt-8">
                <h3 className="antetitulo">Horarios</h3>
                <table className="mt-5 w-full text-left">
                  <caption className="sr-only">
                    Horario de apertura por días
                  </caption>
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.16em] text-sand/60">
                      <th scope="col" className="pb-3 font-medium">
                        Días
                      </th>
                      <th scope="col" className="pb-3 font-medium">
                        Comidas
                      </th>
                      <th scope="col" className="pb-3 font-medium">
                        Cenas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-display text-lg font-light">
                    {horarios.map((fila) => (
                      <tr key={fila.dias} className="border-t border-line">
                        <th
                          scope="row"
                          className="py-4 pr-4 font-sans text-sm font-normal text-sand"
                        >
                          {fila.dias}
                        </th>
                        <td className="py-4 pr-4 text-cream tabular-nums">
                          {fila.comida}
                        </td>
                        <td className="py-4 text-cream tabular-nums">
                          {fila.cena}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 flex items-center gap-2 text-sm text-sand">
                  <Clock3 className="size-3.5 text-brass" aria-hidden="true" />
                  {site.notaHorario}
                </p>
              </div>

              {/* Servicios */}
              <div className="border-t border-line pt-8">
                <h3 className="antetitulo">En la casa</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {site.servicios.map((servicio) => (
                    <li
                      key={servicio}
                      className="flex items-center gap-2.5 text-sm text-cream/80"
                    >
                      <Check
                        className="size-3.5 shrink-0 text-brass"
                        aria-hidden="true"
                      />
                      {servicio}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-line bg-ink">
              <iframe
                src={MAPA_EMBED}
                title={`Mapa con la ubicación de ${site.nombre} en ${direccion.ciudad}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full border-0 lg:h-[620px]"
              />
            </div>
            <p className="mt-3 text-xs text-sand/70">
              Mapa de OpenStreetMap · datos © colaboradores de OpenStreetMap
            </p>
          </Reveal>
        </div>

        {/* Reservas: la casa reserva por teléfono, así que el CTA lleva ahí. */}
        <Reveal delay={0.05}>
          <div
            id="reservas"
            className="mt-20 grid items-center gap-10 rounded-2xl border border-brass/25 bg-ink p-8 md:grid-cols-[1fr_auto] md:p-12"
          >
            <div>
              <p className="antetitulo">Reservas</p>
              <h3 className="titular mt-5 text-3xl text-cream md:text-4xl">
                Mejor con mesa reservada
              </h3>
              <p className="parrafo mt-4 max-w-lg">
                Trabajamos con reserva telefónica: así podemos apartarte la mesa
                que va mejor y avisarte de las sugerencias del día. Para arroces y
                grupos, dínoslo al llamar.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`tel:${contacto.telefonoE164}`}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-brass px-8 py-4 font-medium text-ink transition-colors hover:bg-cream"
              >
                <Phone className="size-4" aria-hidden="true" />
                {contacto.telefono}
              </a>
              <a
                href={`mailto:${contacto.email}`}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-line px-8 py-4 text-sm text-cream transition-colors hover:border-brass hover:text-brass"
              >
                <Mail className="size-4" aria-hidden="true" />
                {contacto.email}
              </a>
              <p className="mt-1 flex items-center justify-center gap-2 text-xs text-sand">
                <MapPin className="size-3" aria-hidden="true" />
                {direccion.ciudad}, {direccion.pais}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
