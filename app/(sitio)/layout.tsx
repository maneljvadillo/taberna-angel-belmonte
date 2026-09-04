import { RestaurantJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Envoltorio del sitio de escaparate.
 *
 * La carta de mesa, la pantalla de barra y la hoja de códigos QR quedan fuera
 * de este grupo a propósito: son herramientas, no escaparate, y no deben
 * arrastrar la cabecera, el pie ni el peso de la página principal.
 */
export default function SitioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
      <RestaurantJsonLd />
    </>
  );
}
