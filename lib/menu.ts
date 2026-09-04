import type { StaticImageData } from "next/image";

import imgEntrantes from "@/assets/media/jamon-iberico.webp";
import imgMar from "@/assets/media/gambas-rojas.webp";
import imgPescados from "@/assets/media/bacalao-gratinado.webp";
import imgCarnes from "@/assets/media/steak-tartar.webp";
import imgPostres from "@/assets/media/tiramisu.webp";

/**
 * La carta.
 *
 * Los platos están leídos de las propias fotografías de la casa (la mediateca
 * de tabernaangelbelmonte.com) y contrastados con lo que citan las reseñas.
 * Los nombres son los que corresponden a lo que se ve en cada foto; conviene
 * que la taberna los repase antes de publicar, por si en la casa se llaman de
 * otra forma. Ver README § La carta.
 */

export type Plato = {
  nombre: string;
  descripcion: string;
  /**
   * Precio en euros como texto («24», «18,50»). Opcional a propósito: hoy no
   * publicamos precios de cocina. Rellena el campo y aparece solo en los platos
   * que lo tengan. Ver README § Cómo añadir precios.
   */
  precio?: string;
  /** Sugerencia destacada de la sección. */
  destacado?: boolean;
};

export type SeccionCarta = {
  id: string;
  titulo: string;
  entradilla: string;
  imagen: StaticImageData;
  imagenAlt: string;
  platos: Plato[];
};

export const carta: SeccionCarta[] = [
  {
    id: "para-empezar",
    titulo: "Para empezar",
    entradilla:
      "Lo que llega a la mesa antes de que hayas terminado de decidir. Producto por delante y poca cosa más.",
    imagen: imgEntrantes,
    imagenAlt:
      "Plato de jamón ibérico cortado a cuchillo, extendido en lonchas finas",
    platos: [
      {
        nombre: "Jamón ibérico cortado a cuchillo",
        descripcion:
          "Se corta al momento y se sirve extendido, para que llegue a la mesa a la temperatura justa.",
        destacado: true,
      },
      {
        nombre: "Alcachofas con calamares",
        descripcion:
          "Dos productos de temporada en el mismo plato: la alcachofa confitada y el calamar marcado fuerte.",
        destacado: true,
      },
      {
        nombre: "Alcachofas con almejas",
        descripcion:
          "La otra manera de hacerlas en casa: con almejas y su jugo, para mojar pan.",
      },
      {
        nombre: "Croquetas caseras",
        descripcion:
          "Bechamel hecha aquí, empanadas y fritas al pedirlas. Cremosas por dentro.",
      },
      {
        nombre: "Huevos rotos con ibérico",
        descripcion:
          "Patata, huevo camperón y jamón por encima. Se rompe en la mesa y se come sin ceremonia.",
      },
      {
        nombre: "Habitas salteadas con jamón",
        descripcion: "Habita tierna, salteada corto, con su punto de ibérico.",
      },
      {
        nombre: "Boletus a la plancha",
        descripcion:
          "En temporada. A la plancha con aceite y ajo, para que se note la seta.",
      },
      {
        nombre: "Tartar de atún rojo",
        descripcion: "Aliñado en cocina, con su punto de picante y caviar encima.",
      },
    ],
  },
  {
    id: "del-mar",
    titulo: "Del mar",
    entradilla:
      "Andorra no tiene costa, pero el género llega cada mañana. Lo que hay depende de la lonja, no de la carta.",
    imagen: imgMar,
    imagenAlt:
      "Gambas rojas a la plancha servidas enteras en fuente blanca",
    platos: [
      {
        nombre: "Gambas rojas a la plancha",
        descripcion:
          "Poco fuego, sal en escamas y nada más. La cabeza es la mitad del plato.",
        destacado: true,
      },
      {
        nombre: "Cigalas",
        descripcion: "A la plancha, abiertas por la mitad. Según el tamaño del día.",
      },
      {
        nombre: "Almejas a la marinera",
        descripcion:
          "Al ajo y vino blanco, con su jugo. Se comen con pan y sin prisa.",
        destacado: true,
      },
      {
        nombre: "Mejillones al vapor",
        descripcion: "Abiertos al vapor con laurel y limón. Sencillo y bien hecho.",
      },
      {
        nombre: "Navajas a la plancha",
        descripcion: "Con aceite, ajo y perejil. Se hacen en un minuto y se notan.",
      },
      {
        nombre: "Salpicón de marisco",
        descripcion: "Frío, con su picadillo de pimiento y cebolla y un buen vinagre.",
      },
      {
        nombre: "Calamares a la romana",
        descripcion: "Rebozados finos y fritos al momento, con su limón al lado.",
      },
      {
        nombre: "Rabas",
        descripcion: "De la casa: crujientes por fuera y tiernas dentro.",
      },
    ],
  },
  {
    id: "pescados",
    titulo: "Pescados",
    entradilla:
      "La pieza se escoge por la mañana y se cobra según peso. Pregunta qué ha entrado hoy.",
    imagen: imgPescados,
    imagenAlt:
      "Lomos de bacalao gratinados, cubiertos de una capa dorada al horno",
    platos: [
      {
        nombre: "Rape a la plancha con ajos",
        descripcion:
          "Carne firme, ajos dorados y su aceite. Uno de los fijos de la casa.",
        destacado: true,
      },
      {
        nombre: "Bacalao gratinado",
        descripcion: "Desalado aquí, al horno y gratinado con su cobertura.",
        destacado: true,
      },
      {
        nombre: "Bacalao con pisto",
        descripcion: "Guisado con tomate, pimiento y aceituna. Plato de cuchara y tenedor.",
      },
      {
        nombre: "Pescado del día a la espalda",
        descripcion:
          "Abierto y marcado a la plancha, con su refrito de ajo y almendra.",
      },
    ],
  },
  {
    id: "carnes",
    titulo: "Carnes",
    entradilla:
      "Brasa, plancha y horno. Piezas escogidas, punto al gusto y guarniciones que no estorban.",
    imagen: imgCarnes,
    imagenAlt:
      "Steak tartar preparado en molde redondo, aliñado y servido en plato blanco",
    platos: [
      {
        nombre: "Filete americano (steak tartar)",
        descripcion:
          "Picado y aliñado a mano, ajustado a cómo te guste de fuerte. Se prepara al momento.",
        destacado: true,
      },
      {
        nombre: "Entrecot a la brasa",
        descripcion:
          "Sal en escamas y punto al gusto. Fuera crujiente, dentro jugoso.",
      },
      {
        nombre: "Chuletitas de cordero",
        descripcion:
          "A la brasa, con su compota. Se comen con la mano y sin disimular.",
        destacado: true,
      },
      {
        nombre: "Solomillo al roquefort",
        descripcion: "Con su salsa de queso azul montada en cocina.",
      },
      {
        nombre: "Solomillo con foie",
        descripcion: "Con reducción de vino tinto y una lámina de foie encima.",
      },
      {
        nombre: "Foie a la plancha con higos",
        descripcion:
          "Marcado fuerte, con higo caramelizado y reducción. Poca cosa y mucho plato.",
      },
      {
        nombre: "Albóndigas de la casa",
        descripcion: "Guisadas despacio en su salsa. De las de repetir pan.",
      },
    ],
  },
  {
    id: "postres",
    titulo: "Postres",
    entradilla:
      "Se hacen aquí. Es el momento en que la gente decide si pide otro café o se queda un rato más.",
    imagen: imgPostres,
    imagenAlt:
      "Tiramisú servido en copa de cristal con cacao espolvoreado por encima",
    platos: [
      {
        nombre: "Tiramisú de la casa",
        descripcion:
          "Servido en copa, con el cacao puesto al salir de cocina.",
        destacado: true,
      },
      {
        nombre: "Tarta de limón merengada",
        descripcion: "Base de galleta, crema de limón y merengue quemado por encima.",
      },
      {
        nombre: "Crema quemada con helado",
        descripcion: "El azúcar tostado al momento, con una bola de vainilla al lado.",
      },
      {
        nombre: "Fresas con helado",
        descripcion: "Fresa de temporada, helado y un hilo de chocolate.",
      },
      {
        nombre: "Helados artesanos",
        descripcion:
          "Los sabores cambian con la temporada; pregunta cuáles hay hoy.",
      },
      {
        nombre: "Mousse de mango",
        descripcion: "Suave, en copa y con fruta fresca encima.",
      },
    ],
  },
];

/**
 * Aviso que acompaña a la carta. La casa trabaja con producto de mercado, así
 * que la disponibilidad y el precio cambian a diario.
 */
export const avisoCarta =
  "Carta de temporada: los platos y el producto cambian según el mercado del día. Pregúntanos por las sugerencias y por el precio de las piezas de pescado y marisco, que se cobran según peso.";
