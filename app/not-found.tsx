import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="grano relative flex min-h-[70dvh] items-center overflow-hidden bg-ink">
      <div className="contenedor text-center">
        <p className="antetitulo justify-center">Error 404</p>
        <h1 className="titular mt-6 text-4xl text-cream sm:text-5xl">
          Esta mesa no existe
        </h1>
        <p className="parrafo mx-auto mt-5 max-w-md">
          La página que buscabas no está aquí. Vuelve al inicio y sigue por la
          carta.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-brass px-8 py-4 font-medium text-ink transition-colors hover:bg-cream"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
