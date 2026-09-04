import { site } from "@/lib/site";

/**
 * Datos estructurados schema.org/Restaurant.
 *
 * Es lo que permite que Google muestre horario, teléfono, dirección y rango de
 * precio directamente en el resultado de búsqueda y en Maps. Todos los valores
 * salen de `lib/site.ts`, así que no pueden desincronizarse de lo que se ve en
 * pantalla.
 */
export function RestaurantJsonLd() {
  const datos = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurante`,
    name: site.nombre,
    description: site.descripcionCorta,
    url: site.url,
    telephone: site.contacto.telefonoE164,
    email: site.contacto.email,
    priceRange: site.rangoPrecio,
    servesCuisine: [...site.cocinas],
    currenciesAccepted: "EUR",
    acceptsReservations: "True",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.direccion.calle,
      postalCode: site.direccion.codigoPostal,
      addressLocality: site.direccion.ciudad,
      addressCountry: site.direccion.paisISO,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.direccion.lat,
      longitude: site.direccion.lng,
    },
    openingHoursSpecification: site.horariosSchema.map((tramo) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...tramo.dias],
      opens: tramo.abre,
      closes: tramo.cierra,
    })),
    hasMenu: `${site.url}/#carta`,
    sameAs: [site.redes.instagram, site.redes.facebook],
  };

  return (
    <script
      type="application/ld+json"
      // El JSON se genera aquí, no viene de fuera: no hay contenido de terceros.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
