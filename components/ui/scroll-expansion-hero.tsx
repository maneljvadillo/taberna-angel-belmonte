"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Héroe con expansión por scroll.
 *
 * La foto crece a medida que se baja y **vuelve a encogerse al subir**: la
 * animación va atada a la posición real del scroll, no a un contador propio.
 *
 * Cómo funciona: la sección ocupa un "carril" de 200vh dentro del cual hay un
 * bloque `sticky` de una pantalla. Mientras se recorren los 100vh sobrantes, el
 * bloque queda fijo y `scrollYProgress` va de 0 a 1; al subir, recorre el mismo
 * camino al revés. No hay listeners de rueda ni `overflow: hidden` sobre el
 * documento: el navegador scrollea como siempre.
 *
 * (La versión anterior interceptaba la rueda y abría la foto de una vez y para
 * siempre. De ahí que al volver arriba la foto se quedara expandida en lugar de
 * deshacer el movimiento.)
 *
 * Las fotos del centro se van turnando con un fundido. Con
 * `prefers-reduced-motion` no rotan y el héroe se muestra ya expandido.
 */

type Fuente = string | StaticImageData;

export type FotoHeroe = {
  imagen: Fuente;
  /** Solo documenta la foto en el código: el carrusel es decorativo y va
   *  marcado `aria-hidden` (los mismos platos están descritos en la galería). */
  alt: string;
};

interface ScrollExpandMediaProps {
  /** Fotos que se van turnando en el centro. Con una sola, no rota. */
  fotos: FotoHeroe[];
  bgImageSrc: Fuente;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  /** Cada cuánto cambia la foto, en milisegundos. */
  intervaloFotos?: number;
  children?: ReactNode;
}

/**
 * Alto del carril: deja una pantalla entera de scroll para abrir la foto.
 *
 * En `dvh`, la misma unidad que el bloque `sticky` de dentro. Con `200vh` fuera
 * y `100dvh` dentro no cuadraban en el móvil: `vh` mide la pantalla como si la
 * barra de direcciones estuviera escondida y `dvh` mide la de verdad, así que el
 * recorrido del carril y el alto del bloque discrepaban justo en el gesto en el
 * que el navegador recoge la barra.
 */
const ALTO_CARRIL = "200dvh";

/** Lo que tarda una foto en relevar a la anterior, en segundos. */
const FUNDIDO = 1.2;

const ScrollExpandMedia = ({
  fotos,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  intervaloFotos = 4500,
  children,
}: ScrollExpandMediaProps) => {
  const carrilRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const [ventana, setVentana] = useState({ ancho: 0, alto: 0 });
  const [indice, setIndice] = useState(0);
  const [saliente, setSaliente] = useState<number | null>(null);
  const anteriorRef = useRef(0);

  useEffect(() => {
    const medir = () =>
      setVentana({ ancho: window.innerWidth, alto: window.innerHeight });

    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const esMovil = ventana.ancho > 0 && ventana.ancho < 768;

  /**
   * Turno de fotos. Quien pide menos movimiento se queda con la primera.
   *
   * En segundo plano el reloj se para: el navegador congela el pintado de las
   * pestañas ocultas, así que un relevo lanzado ahí se quedaría a medias.
   */
  useEffect(() => {
    if (reducedMotion || fotos.length < 2) return;

    let id: ReturnType<typeof setInterval> | undefined;

    const arrancar = () => {
      id ??= setInterval(
        () => setIndice((i) => (i + 1) % fotos.length),
        intervaloFotos
      );
    };

    const parar = () => {
      clearInterval(id);
      id = undefined;
    };

    const alCambiarVisibilidad = () =>
      document.hidden ? parar() : arrancar();

    alCambiarVisibilidad();
    document.addEventListener("visibilitychange", alCambiarVisibilidad);

    return () => {
      parar();
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, [reducedMotion, fotos.length, intervaloFotos]);

  // La foto que se va se queda opaca —y por debajo— hasta que la nueva termina
  // de entrar. Si ambas se cruzaran a media opacidad, el fondo oscuro se
  // colaría entre las dos y la tarjeta parpadearía en cada relevo.
  useEffect(() => {
    if (anteriorRef.current === indice) return;

    setSaliente(anteriorRef.current);
    anteriorRef.current = indice;
  }, [indice]);

  const { scrollYProgress } = useScroll({
    target: carrilRef,
    // 0 cuando el carril toca arriba; 1 cuando el bloque sticky se suelta.
    offset: ["start start", "end end"],
  });

  // Sin animación de entrada: el héroe arranca —y se queda— abierto del todo.
  const progresoFijo = useMotionValue(1);
  const progreso = reducedMotion ? progresoFijo : scrollYProgress;

  /**
   * Tamaño final de la foto, medido contra la ventana de verdad.
   *
   * Antes eran dos números fijos en píxeles con un tope de `95vw`. En una
   * pantalla ancha daba igual, pero en un móvil de 375 px el tope entraba a los
   * nueve centésimos del recorrido: a partir de ahí la foto ya no ensanchaba y
   * el gesto terminaba con una tarjeta pequeña flotando en negro, en vez de
   * abrirse a pantalla completa. En móvil ocupa la pantalla entera; en
   * escritorio se deja margen para que se lea como una lámina y no como fondo.
   */
  const anchoFinal = esMovil
    ? ventana.ancho
    : Math.min(ventana.ancho * 0.95, 1550);
  const altoFinal = esMovil
    ? ventana.alto
    : Math.min(ventana.alto * 0.85, 800);

  const ancho = useTransform(progreso, [0, 1], [300, anchoFinal || 300]);
  const alto = useTransform(progreso, [0, 1], [400, altoFinal || 400]);

  // A pantalla completa las esquinas redondeadas dejarían cuatro muescas negras.
  const radio = useTransform(progreso, [0.8, 1], [16, esMovil ? 0 : 16]);

  const opacidadFondo = useTransform(progreso, [0, 1], [1, 0]);
  const opacidadVelo = useTransform(progreso, [0, 1], [0.5, 0.1]);

  const apertura = useTransform(progreso, [0, 1], [0, esMovil ? 180 : 150]);
  const xIzquierda = useMotionTemplate`-${apertura}vw`;
  const xDerecha = useMotionTemplate`${apertura}vw`;

  const opacidadPista = useTransform(progreso, [0, 0.5], [1, 0]);
  const eventosPista = useTransform(opacidadPista, (v) =>
    v < 0.1 ? "none" : "auto"
  );

  /** Lleva al final del carril, o sea, a la foto abierta del todo. */
  const bajar = useCallback(() => {
    const carril = carrilRef.current;
    if (!carril) return;

    window.scrollTo({
      top: carril.offsetTop + carril.offsetHeight - window.innerHeight,
      behavior: "smooth",
    });
  }, []);

  const primeraPalabra = title ? title.split(" ")[0] : "";
  const restoDelTitulo = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div>
      <div
        ref={carrilRef}
        className="relative"
        style={{ height: reducedMotion ? "100dvh" : ALTO_CARRIL }}
      >
        <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            style={{ opacity: opacidadFondo }}
            aria-hidden="true"
          >
            <Image
              src={bgImageSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-ink/74 via-ink/48 to-ink" />
          </motion.div>

          <motion.div
            className="absolute z-0 overflow-hidden"
            style={{
              width: ancho,
              height: alto,
              borderRadius: radio,
              boxShadow: "0 30px 90px rgba(0, 0, 0, 0.55)",
            }}
            aria-hidden="true"
          >
            {fotos.map((foto, i) => (
              <motion.div
                key={typeof foto.imagen === "string" ? foto.imagen : foto.imagen.src}
                className="absolute inset-0"
                style={{ zIndex: i === indice ? 2 : i === saliente ? 1 : 0 }}
                initial={false}
                animate={{ opacity: i === indice || i === saliente ? 1 : 0 }}
                // La entrante se funde; la saliente se apaga de golpe, pero para
                // entonces ya está tapada por la nueva y no se ve el corte.
                transition={{
                  duration: i === indice ? FUNDIDO : 0,
                  ease: "easeInOut",
                }}
                // Se suelta a la saliente cuando la nueva está opaca de verdad,
                // no a los FUNDIDO segundos de reloj: si el fundido se queda a
                // medias, soltarla por tiempo dejaría la tarjeta en blanco.
                onAnimationComplete={() => {
                  if (i === indice) setSaliente(null);
                }}
              >
                <Image
                  src={foto.imagen}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1600px"
                  priority={i === 0}
                />
              </motion.div>
            ))}

            <motion.div
              className="absolute inset-0 z-3 bg-ink"
              style={{ opacity: opacidadVelo }}
            />
          </motion.div>

          <div className="relative z-10 flex w-full flex-col items-center justify-center gap-3 text-center [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]">
            {date && (
              <motion.p
                className="antetitulo text-brass max-sm:before:hidden"
                style={{ x: xIzquierda }}
              >
                {date}
              </motion.p>
            )}

            <h1 className="titular text-5xl text-cream sm:text-6xl md:text-7xl lg:text-8xl">
              <motion.span className="block" style={{ x: xIzquierda }}>
                {primeraPalabra}
              </motion.span>
              <motion.span className="block" style={{ x: xDerecha }}>
                {restoDelTitulo}
              </motion.span>
            </h1>
          </div>

          {scrollToExpand && !reducedMotion && (
            <motion.button
              type="button"
              onClick={bajar}
              className="group absolute bottom-10 z-20 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.24em] text-cream/60 transition-colors hover:text-brass"
              style={{ opacity: opacidadPista, pointerEvents: eventosPista }}
            >
              {scrollToExpand}
              <ChevronDown
                className="size-4 animate-bounce transition-colors group-hover:text-brass motion-reduce:animate-none"
                aria-hidden="true"
              />
            </motion.button>
          )}
        </div>
      </div>

      <motion.div
        className="contenedor py-10 md:py-16 lg:py-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollExpandMedia;
