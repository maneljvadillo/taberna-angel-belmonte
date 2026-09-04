/**
 * Datos reales del negocio. Punto único de verdad para NAP (nombre, dirección,
 * teléfono), horarios, redes y textos de marca. Todo lo que se muestre en la web
 * o en el JSON-LD sale de aquí, para que no haya dos versiones del mismo dato.
 *
 * Fuentes: web actual (tabernaangelbelmonte.com), fichas de Andorra la Vella,
 * Restaurant Guru y Citymaps.ad — ver README.md § Datos del negocio.
 */

export const site = {
  nombre: "Taberna Ángel Belmonte",
  nombreCorto: "Taberna Ángel Belmonte",
  /** Lema original de la casa, en catalán. Se conserva tal cual. */
  lema: "Cuina autèntica al cor d'Andorra",
  lemaEs: "Cocina auténtica en el corazón de Andorra",
  descripcionCorta:
    "Taberna de cocina de mercado y producto del mar en el centro de Andorra la Vella. Más de 30 años de oficio en una casa tradicional de dos plantas.",

  url: "https://tabernaangelbelmonte.com",

  contacto: {
    telefono: "+376 822 460",
    /** Formato E.164 para enlaces tel: y para el JSON-LD. */
    telefonoE164: "+376822460",
    email: "info@tabernaangelbelmonte.com",
  },

  direccion: {
    calle: "Carrer Ciutat de Consuegra, 3",
    edificio: "Casa Campolier",
    codigoPostal: "AD500",
    ciudad: "Andorra la Vella",
    pais: "Andorra",
    paisISO: "AD",
    /** Geocodificadas del propio local con Nominatim (OpenStreetMap). */
    lat: 42.5074327,
    lng: 1.5308924,
  },

  /**
   * Horarios reales: abierto todos los días, mediodía y noche.
   * `cierre` en formato 24h para el JSON-LD.
   */
  horarios: [
    { dias: "Lunes a sábado", comida: "13:00 – 15:30", cena: "20:00 – 22:30" },
    { dias: "Domingo", comida: "13:00 – 15:30", cena: "20:00 – 22:00" },
  ],
  horariosSchema: [
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], abre: "13:00", cierra: "15:30" },
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], abre: "20:00", cierra: "22:30" },
    { dias: ["Sunday"], abre: "13:00", cierra: "15:30" },
    { dias: ["Sunday"], abre: "20:00", cierra: "22:00" },
  ],
  notaHorario: "Abierto todos los días, mediodía y noche.",

  rangoPrecio: "€€€",
  cocinas: ["Mediterránea", "Española", "Marisco", "Cocina de mercado"],

  servicios: [
    "Reserva recomendada",
    "Terraza",
    "Acceso con ascensor",
    "Admite mascotas",
    "Wi-Fi",
    "Equipo multilingüe",
  ],

  redes: {
    instagram: "https://www.instagram.com/taberna_angel_belmonte/",
    instagramHandle: "@taberna_angel_belmonte",
    facebook: "https://www.facebook.com/p/Taberna-%C3%81ngel-Belmonte-100064168299442/",
  },

  /** Enlace a mapa externo (se abre fuera del sitio, sin cargar scripts de terceros). */
  mapaUrl:
    "https://www.openstreetmap.org/?mlat=42.5074327&mlon=1.5308924#map=18/42.5074327/1.5308924",
  comoLlegarUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Carrer+Ciutat+de+Consuegra+3,+Andorra+la+Vella",
} as const;

export const navegacion = [
  { href: "#la-casa", label: "La casa" },
  { href: "#carta", label: "La carta" },
  { href: "#galeria", label: "Galería" },
  { href: "#visitanos", label: "Visítanos" },
] as const;
