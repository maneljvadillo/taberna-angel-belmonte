"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Aparición suave al entrar en pantalla. Un único gesto (subir y revelar) que
 * se repite en toda la web para que las secciones se sientan de la misma pieza.
 * `framer-motion` desactiva la animación por su cuenta si el sistema pide menos
 * movimiento, siempre que se use `initial`/`whileInView` como aquí.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
