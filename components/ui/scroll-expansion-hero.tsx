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

/** Alto del carril: 200vh deja 100vh de scroll para abrir la foto. */
const ALTO_CARRIL = "200vh";

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

  const [esMovil, setEsMovil] = useState(false);
  const [indice, setIndice] = useState(0);
  const [saliente, setSaliente] = useState<number | null>(null);

  useEffect(() => {
    const comprobar = () => setEsMovil(window.innerWidth < 768);
    comprobar();
    window.addEventListener("resize", comprobar);
    return () => window.removeEventListener("resize", comprobar);
  }, []);

  // Turno de fotos. Quien pide menos movimiento se queda con la primera.
  useEffect(() => {
    if (reducedMotion || fotos.length < 2) return;

    const id = setInterval(() => {
      setIndice((i) => {
        setSaliente(i);
        return (i + 1) % fotos.length;
      });
    }, intervaloFotos);
    return () => clearInterval(id);
  }, [reducedMotion, fotos.length, intervaloFotos]);

  // La foto que se va se queda opaca —y por debajo— hasta que la nueva ha
  // terminado de entrar. Si ambas se cruzaran a media opacidad, el fondo oscuro
  // se colaría entre las dos y la tarjeta parpadearía en cada relevo.
  useEffect(() => {
    if (saliente === null) return;

    const id = setTimeout(() => setSaliente(null), FUNDIDO * 1000);
    return () => clearTimeout(id);
  }, [saliente]);

  const { scrollYProgress } = useScroll({
    target: carrilRef,
    // 0 cuando el carril toca arriba; 1 cuando el bloque sticky se suelta.
    offset: ["start start", "end end"],
  });

  // Sin animación de entrada: el héroe arranca —y se queda— abierto del todo.
  const progresoFijo = useMotionValue(1);
  const progreso = reducedMotion ? progresoFijo : scrollYProgress;

  const ancho = useTransform(progreso, [0, 1], [300, esMovil ? 950 : 1550]);
  const alto = useTransform(progreso, [0, 1], [400, esMovil ? 600 : 800]);

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
            className="absolute z-0 overflow-hidden rounded-2xl"
            style={{
              width: ancho,
              height: alto,
              maxWidth: "95vw",
              maxHeight: "85vh",
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
              >
                <Image
                  src={foto.imagen}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 95vw, 1600px"
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
