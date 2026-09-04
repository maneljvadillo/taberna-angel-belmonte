"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer } from "lucide-react";

import { NUMERO_MESAS } from "@/lib/pedidos/config";
import { site } from "@/lib/site";

/**
 * Hoja de códigos QR para las mesas, lista para imprimir y recortar.
 *
 * Los códigos van en negro sobre papel claro aunque el resto del sitio sea
 * oscuro: un QR en negativo lo leen mal muchas cámaras, y sobre todo gasta una
 * barbaridad de tinta.
 */
export function HojaQR() {
  const [base, setBase] = useState<string>(site.url);
  const [mesas, setMesas] = useState(NUMERO_MESAS);
  const [codigos, setCodigos] = useState<{ mesa: number; png: string }[]>([]);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      const limpia = base.trim().replace(/\/+$/, "");
      const total = Math.min(Math.max(mesas, 1), 200);

      const generados = await Promise.all(
        Array.from({ length: total }, async (_, i) => ({
          mesa: i + 1,
          png: await QRCode.toDataURL(`${limpia}/mesa/${i + 1}`, {
            width: 640,
            margin: 1,
            errorCorrectionLevel: "M",
            color: { dark: "#0b1410ff", light: "#ffffffff" },
          }),
        }))
      );

      if (!cancelado) setCodigos(generados);
    })();

    return () => {
      cancelado = true;
    };
  }, [base, mesas]);

  return (
    <div className="min-h-[100dvh] bg-ink">
      {/* Controles: no se imprimen. */}
      <div className="contenedor py-10 print:hidden">
        <p className="antetitulo">Herramienta interna</p>
        <h1 className="titular mt-5 text-4xl text-cream">
          Códigos QR para las mesas
        </h1>
        <p className="parrafo mt-4 max-w-xl">
          Cada código abre <code className="text-brass">/mesa/&lt;número&gt;</code>:
          la carta y el pedido de bebidas, con la mesa ya puesta. Imprime, recorta
          y pega uno en cada mesa.
        </p>

        <div className="mt-8 flex flex-wrap items-end gap-6">
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.18em] text-brass">
              Dirección del sitio publicado
            </span>
            <input
              value={base}
              onChange={(e) => setBase(e.target.value)}
              inputMode="url"
              className="mt-2 w-80 max-w-full rounded-xl border border-line bg-ink-raised px-4 py-3 text-cream focus:border-brass focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="block text-xs uppercase tracking-[0.18em] text-brass">
              Mesas
            </span>
            <input
              type="number"
              min={1}
              max={200}
              value={mesas}
              onChange={(e) => setMesas(Number(e.target.value) || 1)}
              className="mt-2 w-28 rounded-xl border border-line bg-ink-raised px-4 py-3 text-cream tabular-nums focus:border-brass focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brass px-7 font-medium text-ink transition-colors hover:bg-cream"
          >
            <Printer className="size-4" aria-hidden="true" />
            Imprimir
          </button>
        </div>

        <p className="mt-6 max-w-xl text-sm text-sand">
          Si el número de mesas cambia de forma permanente, ajusta también
          <code className="mx-1.5 text-cream">NEXT_PUBLIC_NUMERO_MESAS</code>
          en el entorno: es lo que decide qué mesas acepta el servidor.
        </p>
      </div>

      <div className="contenedor grid grid-cols-2 gap-6 pb-16 print:gap-0 print:pb-0">
        {codigos.map(({ mesa, png }) => (
          <figure
            key={mesa}
            className="flex break-inside-avoid flex-col items-center rounded-2xl bg-white p-8 text-center print:rounded-none print:border print:border-neutral-300"
          >
            <figcaption className="order-2 mt-5">
              <p className="text-[0.55rem] font-medium uppercase tracking-[0.4em] text-neutral-500">
                Taberna
              </p>
              <p className="mt-1 font-display text-lg font-light tracking-[0.12em] text-neutral-900">
                ÁNGEL BELMONTE
              </p>
              <p className="mt-5 font-display text-5xl font-light text-neutral-900">
                Mesa {mesa}
              </p>
              <p className="mt-4 text-sm text-neutral-600">
                Escanea para ver la carta
                <br />y pedir las bebidas
              </p>
            </figcaption>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={png}
              alt={`Código QR de la mesa ${mesa}`}
              width={220}
              height={220}
              className="order-1 size-[220px]"
            />
          </figure>
        ))}
      </div>

      <style>{`
        @media print {
          @page { margin: 12mm; }
          body { background: #fff; }
        }
      `}</style>
    </div>
  );
}
