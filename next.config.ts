import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fuentes ya son WebP optimizados (ver scripts/optimize-images.mjs);
    // Next sirve además AVIF a quien lo acepte y recorta por breakpoint.
    formats: ["image/avif", "image/webp"],
    // Cachea las variantes generadas un mes: son fotos que no cambian.
    minimumCacheTTL: 2678400,
  },

  // Cabeceras de seguridad básicas para un sitio estático de escaparate.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
