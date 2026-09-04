import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";

import { navegacion, site } from "@/lib/site";

export function SiteFooter() {
  const año = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink" aria-labelledby="pie-titulo">
      <h2 id="pie-titulo" className="sr-only">
        Información de contacto y enlaces
      </h2>

      <div className="contenedor grid gap-12 py-16 md:grid-cols-3 md:py-20">
        <div>
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.42em] text-brass">
            Taberna
          </p>
          <p className="mt-1.5 font-display text-2xl font-light tracking-[0.12em] text-cream">
            ÁNGEL BELMONTE
          </p>
          <p className="mt-6 max-w-xs font-display text-lg font-light italic text-sand">
            {site.lema}
          </p>

          <div className="mt-8 flex gap-3">
            <a
              href={site.redes.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-10 place-items-center rounded-full border border-line text-sand transition-colors hover:border-brass hover:text-brass"
              aria-label={`Instagram de ${site.nombre}`}
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={site.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-10 place-items-center rounded-full border border-line text-sand transition-colors hover:border-brass hover:text-brass"
              aria-label={`Facebook de ${site.nombre}`}
            >
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="antetitulo">Dónde</p>
          <address className="mt-5 space-y-1 not-italic text-sm text-cream/75">
            <p>{site.direccion.calle}</p>
            <p>{site.direccion.edificio}</p>
            <p>
              {site.direccion.codigoPostal} {site.direccion.ciudad},{" "}
              {site.direccion.pais}
            </p>
          </address>

          <div className="mt-6 space-y-2.5 text-sm">
            <a
              href={`tel:${site.contacto.telefonoE164}`}
              className="flex items-center gap-2.5 text-cream transition-colors hover:text-brass"
            >
              <Phone className="size-3.5 text-brass" aria-hidden="true" />
              {site.contacto.telefono}
            </a>
            <a
              href={`mailto:${site.contacto.email}`}
              className="flex items-center gap-2.5 text-cream transition-colors hover:text-brass"
            >
              <Mail className="size-3.5 text-brass" aria-hidden="true" />
              {site.contacto.email}
            </a>
          </div>
        </div>

        <div>
          <p className="antetitulo">Cuándo</p>
          <ul className="mt-5 space-y-3 text-sm">
            {site.horarios.map((fila) => (
              <li key={fila.dias}>
                <span className="block text-sand">{fila.dias}</span>
                <span className="text-cream tabular-nums">
                  {fila.comida} · {fila.cena}
                </span>
              </li>
            ))}
          </ul>

          <nav aria-label="Pie de página" className="mt-8">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {navegacion.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sand transition-colors hover:text-brass"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/carta"
                  className="text-brass underline decoration-brass/40 underline-offset-4 transition-colors hover:decoration-brass"
                >
                  Carta para el móvil
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="contenedor flex flex-col gap-2 py-7 text-xs text-sand/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {año} {site.nombre}. Todos los derechos reservados.
          </p>
          <p>
            {site.direccion.ciudad}, {site.direccion.pais}
          </p>
        </div>
      </div>
    </footer>
  );
}
