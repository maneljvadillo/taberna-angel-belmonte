"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Héroe con expansión por scroll.
 *
 * Adaptado de la plantilla de referencia. Cambios respecto al original:
 *  · `mediaSrc` / `bgImageSrc` aceptan también imports estáticos, para que
 *    Next.js conozca el tamaño real de la imagen y pueda generar el `srcset`
 *    y el placeholder borroso.
 *  · Colores atados a los tokens de la casa en vez del `blue-200` de la demo.
 *  · Respeta `prefers-reduced-motion`: quien lo tenga activado ve el héroe ya
 *    expandido y con el scroll normal, sin secuestro de la rueda.
 *  · El bloqueo del scroll también se abre con teclado (flechas, AvPág, Espacio,
 *    Fin) y con un enlace de salto, para no dejar fuera a quien no usa ratón.
 */

type Fuente = string | StaticImageData;

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: Fuente;
  posterSrc?: string;
  bgImageSrc: Fuente;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const TECLAS_AVANCE = new Set([
  "ArrowDown",
  "PageDown",
  "End",
  " ",
  "Spacebar",
  "Enter",
]);

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number>(0);

  // Al montar, arriba del todo: el efecto solo tiene sentido desde scroll 0.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Quien pide menos movimiento entra directamente al estado final.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const aplicar = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) {
        setScrollProgress(1);
        setMediaFullyExpanded(true);
        setShowContent(true);
      }
    };

    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  const expandirDelTodo = () => {
    setScrollProgress(1);
    setMediaFullyExpanded(true);
    setShowContent(true);
  };

  /**
   * Captura de rueda y gesto mientras el héroe está cerrado.
   *
   * Los listeners se montan SOLO durante el bloqueo y se retiran en cuanto la
   * foto termina de abrirse. En la plantilla original quedaban puestos para
   * siempre con `passive: false`, lo que obliga al navegador a resolver cada
   * scroll en el hilo principal durante el resto de la página.
   *
   * La apertura es de ida: una vez dentro, volver arriba no vuelve a bloquear.
   */
  useEffect(() => {
    if (reducedMotion || mediaFullyExpanded) return;

    const avanzar = (delta: number) => {
      const nuevo = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(nuevo);

      if (nuevo >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (nuevo < 0.75) {
        setShowContent(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      avanzar(e.deltaY * 0.0009);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY.current) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;

      e.preventDefault();
      // Más sensible al volver hacia arriba que al bajar.
      avanzar(deltaY * (deltaY < 0 ? 0.008 : 0.005));
      touchStartY.current = touchY;
    };

    const handleTouchEnd = () => {
      touchStartY.current = 0;
    };

    // Sin ratón ni gesto: cualquier tecla de avance abre el héroe de golpe.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!TECLAS_AVANCE.has(e.key)) return;
      e.preventDefault();
      expandirDelTodo();
    };

    /**
     * Si alguien usa el menú estando el héroe cerrado, el enlace tiene que
     * llevarle a su sección. Se levanta el bloqueo en el acto —antes de que el
     * navegador procese el salto— y además se marca el héroe como abierto.
     */
    const handleAnchorClick = (e: MouseEvent) => {
      const enlace = (e.target as HTMLElement | null)?.closest?.<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!enlace) return;

      document.documentElement.style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
      expandirDelTodo();

      // El salto por defecto se pierde: el navegador lo resuelve mientras la
      // página todavía figura como no desplazable. Se rehace en cuanto termina
      // esta tarea, ya sin bloqueo, calculando el destino a mano para no
      // depender de que el navegador reevalúe el fragmento.
      const id = decodeURIComponent(enlace.hash.slice(1));
      if (!id) return;

      e.preventDefault();

      setTimeout(() => {
        const destinoEl = document.getElementById(id);
        if (!destinoEl) return;

        const margen =
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop
          ) || 0;

        window.scrollTo({
          top: destinoEl.getBoundingClientRect().top + window.scrollY - margen,
          behavior: "smooth",
        });

        history.pushState(null, "", `#${id}`);
      }, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [scrollProgress, mediaFullyExpanded, reducedMotion]);

  /**
   * Mientras el héroe no se ha abierto, la página no debe desplazarse: la rueda
   * y el gesto alimentan el progreso de la animación, no el scroll.
   *
   * Se bloquea con `overflow: hidden` en lugar de devolver la página a 0 en cada
   * evento de scroll (como hacía la plantilla original): ese truco entra en
   * conflicto con el `scroll-behavior: smooth` de la hoja de estilos y deja la
   * página atascada a medio camino.
   */
  useEffect(() => {
    const raiz = document.documentElement;
    const bloqueado = !mediaFullyExpanded && !reducedMotion;

    raiz.style.overflow = bloqueado ? "hidden" : "";
    raiz.style.overscrollBehavior = bloqueado ? "none" : "";

    return () => {
      raiz.style.overflow = "";
      raiz.style.overscrollBehavior = "";
    };
  }, [mediaFullyExpanded, reducedMotion]);

  useEffect(() => {
    const comprobar = () => setIsMobileState(window.innerWidth < 768);
    comprobar();
    window.addEventListener("resize", comprobar);
    return () => window.removeEventListener("resize", comprobar);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  const esVideo = mediaType === "video";
  const srcVideo = typeof mediaSrc === "string" ? mediaSrc : "";

  return (
    <div
      ref={sectionRef}
      className="overflow-x-hidden transition-colors duration-700 ease-in-out"
    >
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          <motion.div
            className="absolute inset-x-0 top-0 z-0 h-[100dvh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
            aria-hidden="true"
          >
            <Image
              src={bgImageSrc}
              alt=""
              width={1920}
              height={1080}
              className="h-screen w-screen"
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-ink/74 via-ink/48 to-ink" />
          </motion.div>

          <div className="contenedor relative z-10 flex flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              <div
                className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0 30px 90px rgba(0, 0, 0, 0.55)",
                }}
              >
                {esVideo ? (
                  srcVideo.includes("youtube.com") ? (
                    <div className="pointer-events-none relative h-full w-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          srcVideo.includes("embed")
                            ? srcVideo +
                              (srcVideo.includes("?") ? "&" : "?") +
                              "autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1"
                            : srcVideo.replace("watch?v=", "embed/") +
                              "?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=" +
                              srcVideo.split("v=")[1]
                        }
                        title={title ?? "Vídeo"}
                        className="h-full w-full rounded-xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-ink/60"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="pointer-events-none relative h-full w-full">
                      <video
                        src={srcVideo}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="h-full w-full rounded-xl object-cover"
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-ink/60"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      src={mediaSrc}
                      alt={title ? `${title} — sala` : "Imagen destacada"}
                      fill
                      className="rounded-xl object-cover"
                      sizes="(max-width: 768px) 95vw, 1600px"
                      priority
                    />
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-ink/80"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.4 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              <div
                className={`relative z-10 flex w-full flex-col items-center justify-center gap-3 text-center transition-none [text-shadow:0_2px_30px_rgba(0,0,0,0.6)] ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                {date && (
                  <p
                    className="antetitulo text-brass max-sm:before:hidden"
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {date}
                  </p>
                )}

                <motion.h1 className="titular text-5xl text-cream sm:text-6xl md:text-7xl lg:text-8xl">
                  <span
                    className="block transition-none"
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {firstWord}
                  </span>
                  <span
                    className="block transition-none"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {restOfTitle}
                  </span>
                </motion.h1>

              </div>

              {scrollToExpand && !mediaFullyExpanded && (
                <button
                  type="button"
                  onClick={expandirDelTodo}
                  className="group absolute bottom-10 z-20 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.24em] text-cream/60 transition-colors hover:text-brass"
                  style={{ opacity: 1 - scrollProgress * 1.6 }}
                >
                  {scrollToExpand}
                  <ChevronDown
                    className="size-4 animate-bounce transition-colors group-hover:text-brass motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>

            <motion.section
              className="flex w-full flex-col px-0 py-10 md:py-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              aria-hidden={!showContent}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
