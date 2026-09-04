import type { StaticImageData } from "next/image";

import comedor from "@/assets/media/comedor.webp";
import cigalas from "@/assets/media/cigalas.webp";
import navajas from "@/assets/media/navajas.webp";
import huevosRotos from "@/assets/media/huevos-rotos.webp";
import alcachofas from "@/assets/media/alcachofas-calamares.webp";
import cordero from "@/assets/media/cordero.webp";
import mejillones from "@/assets/media/mejillones.webp";
import tartarAtun from "@/assets/media/tartar-atun.webp";
import croquetas from "@/assets/media/croquetas.webp";
import foieHigos from "@/assets/media/foie-higos.webp";
import salpicon from "@/assets/media/salpicon.webp";
import tartaLimon from "@/assets/media/tarta-limon.webp";

export type Foto = {
  imagen: StaticImageData;
  /** Texto alternativo: describe la escena, no repite el nombre del negocio. */
  alt: string;
  /** Pie visible en el visor ampliado. */
  pie: string;
  /** Proporción de la tarjeta dentro de su columna. */
  alto: "corta" | "alta" | "muy-alta";
};

export const galeria: Foto[] = [
  {
    imagen: comedor,
    alt: "Comedor de la taberna con paredes verdes, vigas de pino, apliques de latón y mesas vestidas de blanco",
    pie: "El comedor, antes del servicio",
    alto: "corta",
  },
  {
    imagen: cigalas,
    alt: "Cigalas abiertas a la plancha servidas en fuente blanca",
    pie: "Cigalas de la lonja",
    alto: "alta",
  },
  {
    imagen: alcachofas,
    alt: "Alcachofas salteadas con calamares y ajos en plato hondo",
    pie: "Alcachofas con calamares",
    alto: "corta",
  },
  {
    imagen: huevosRotos,
    alt: "Huevos rotos con patata y lonchas de jamón ibérico por encima",
    pie: "Huevos rotos con ibérico",
    alto: "alta",
  },
  {
    imagen: navajas,
    alt: "Navajas a la plancha con aceite, ajo y perejil",
    pie: "Navajas a la plancha",
    alto: "corta",
  },
  {
    imagen: cordero,
    alt: "Chuletitas de cordero a la brasa con compota de manzana",
    pie: "Chuletitas de cordero",
    alto: "alta",
  },
  {
    imagen: tartarAtun,
    alt: "Tartar de atún rojo en molde redondo, coronado con caviar",
    pie: "Tartar de atún rojo",
    alto: "corta",
  },
  {
    imagen: mejillones,
    alt: "Mejillones abiertos al vapor, servidos en su concha",
    pie: "Mejillones al vapor",
    alto: "alta",
  },
  {
    imagen: croquetas,
    alt: "Croquetas caseras recién fritas en plato blanco",
    pie: "Croquetas de la casa",
    alto: "corta",
  },
  {
    imagen: foieHigos,
    alt: "Foie a la plancha con higos caramelizados y reducción de vino",
    pie: "Foie con higos",
    alto: "alta",
  },
  {
    imagen: salpicon,
    alt: "Salpicón de marisco frío con picadillo de pimiento y cebolla",
    pie: "Salpicón de marisco",
    alto: "corta",
  },
  {
    imagen: tartaLimon,
    alt: "Porción de tarta de limón con merengue quemado y fresa fresca",
    pie: "Tarta de limón merengada",
    alto: "alta",
  },
];
