import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import { site } from "@/lib/site";

import "./globals.css";

// Serif de titulares: la voz de la casa. Se carga también en cursiva porque
// las citas y entradillas la usan.
const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-display",
});

// Sans de lectura: neutra, buena en tamaños pequeños (horarios, carta, pie).
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nombre} — Restaurante en ${site.direccion.ciudad}`,
    template: `%s · ${site.nombre}`,
  },
  description: site.descripcionCorta,
  applicationName: site.nombre,
  keywords: [
    "restaurante Andorra la Vella",
    "taberna Andorra",
    "marisco Andorra",
    "cocina de mercado Andorra",
    "dónde comer en Andorra",
    "Ángel Belmonte",
  ],
  authors: [{ name: site.nombre, url: site.url }],
  creator: site.nombre,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: site.url,
    siteName: site.nombre,
    title: `${site.nombre} — ${site.lemaEs}`,
    description: site.descripcionCorta,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nombre} — ${site.lemaEs}`,
    description: site.descripcionCorta,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "restaurant",
};

export const viewport: Viewport = {
  themeColor: "#0b1410",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
