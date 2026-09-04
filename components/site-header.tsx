"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { navegacion, site } from "@/lib/site";

export function SiteHeader() {
  const [compacto, setCompacto] = useState(false);
  const [abierto, setAbierto] = useState(false);

  // El fondo del header solo aparece cuando ya se ha bajado del héroe.
  useEffect(() => {
    const alScroll = () => setCompacto(window.scrollY > 40);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // Con el menú móvil abierto no se scrollea el fondo.
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, []);

  return (
    <>
      <a
        href="#contenido"
        className="solo-lectores focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:h-auto focus:w-auto focus:rounded-full focus:bg-brass focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Saltar al contenido
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          compacto
            ? "border-b border-line bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="contenedor flex h-20 items-center justify-between gap-6">
          <a
            href="#inicio"
            className="group shrink-0 leading-none"
            aria-label={`${site.nombre} — inicio`}
          >
            <span className="block text-[0.6rem] font-medium uppercase tracking-[0.42em] text-brass transition-colors group-hover:text-cream">
              Taberna
            </span>
            <span className="mt-1 block font-display text-lg font-light tracking-[0.14em] text-cream md:text-xl">
              ÁNGEL BELMONTE
            </span>
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navegacion.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="relative py-2 text-sm text-cream/70 transition-colors hover:text-cream after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.contacto.telefonoE164}`}
              className="hidden items-center gap-2 rounded-full border border-brass/50 px-5 py-2.5 text-sm font-medium text-brass transition-colors hover:bg-brass hover:text-ink sm:inline-flex"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              Reservar
            </a>

            <button
              type="button"
              onClick={() => setAbierto(true)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line text-cream transition-colors hover:border-brass hover:text-brass lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={abierto}
              aria-controls="menu-movil"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      <div
        id="menu-movil"
        className={cn(
          "fixed inset-0 z-[55] bg-ink transition-opacity duration-300 lg:hidden",
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        inert={!abierto}
      >
        <div className="contenedor flex h-20 items-center justify-end">
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-cream"
            aria-label="Cerrar menú"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Principal (móvil)" className="contenedor mt-6">
          <ul className="flex flex-col gap-2">
            {navegacion.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className="flex items-baseline gap-4 py-5 font-display text-3xl font-light text-cream"
                >
                  <span className="text-xs tracking-[0.2em] text-brass">
                    0{i + 1}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={`tel:${site.contacto.telefonoE164}`}
            className="mt-10 flex items-center justify-center gap-2 rounded-full bg-brass px-6 py-4 font-medium text-ink"
          >
            <Phone className="size-4" aria-hidden="true" />
            {site.contacto.telefono}
          </a>

          <p className="mt-6 text-center text-sm text-sand">
            {site.direccion.calle} · {site.direccion.ciudad}
          </p>
        </nav>
      </div>
    </>
  );
}
