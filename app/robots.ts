import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Herramientas internas y páginas de mesa: no son para buscadores.
      disallow: ["/barra", "/qr", "/mesa/", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
