"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  CircleAlert,
  Loader2,
  Undo2,
  Wifi,
  WifiOff,
} from "lucide-react";

import { formatearEuros } from "@/lib/bebidas";
import type { EstadoPedido, Pedido } from "@/lib/pedidos/tipos";
import { cn } from "@/lib/utils";

type Conexion = "conectando" | "en-linea" | "caida";

export function PantallaBarra() {
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [conexion, setConexion] = useState<Conexion>("conectando");
  const [sonido, setSonido] = useState(true);
  const audio = useRef<AudioContext | null>(null);

  /* --- Aviso sonoro ------------------------------------------------------ */
  // Se sintetiza con la Web Audio API en vez de cargar un archivo: son dos
  // tonos, no merece una petición de red ni un asset que mantener.
  const avisar = useCallback(() => {
    if (!sonido || !audio.current) return;
    const ctx = audio.current;
    const ahora = ctx.currentTime;

    [880, 1320].forEach((hz, i) => {
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = hz;
      vol.gain.setValueAtTime(0.0001, ahora + i * 0.18);
      vol.gain.exponentialRampToValueAtTime(0.25, ahora + i * 0.18 + 0.02);
      vol.gain.exponentialRampToValueAtTime(0.0001, ahora + i * 0.18 + 0.16);
      osc.connect(vol).connect(ctx.destination);
      osc.start(ahora + i * 0.18);
      osc.stop(ahora + i * 0.18 + 0.2);
    });
  }, [sonido]);

  /* --- Carga inicial y resincronización ---------------------------------- */
  // Subir este contador vuelve a lanzar el efecto de carga: es la forma de
  // pedir una resincronización sin duplicar la lógica de la petición.
  const [recargas, setRecargas] = useState(0);
  const recargar = useCallback(() => setRecargas((n) => n + 1), []);

  // Carga inicial. El trabajo va dentro de una función asíncrona y los estados
  // se fijan tras el `await`, no en el cuerpo del efecto.
  useEffect(() => {
    let vivo = true;

    (async () => {
      const res = await fetch("/api/pedidos", { cache: "no-store" }).catch(
        () => null
      );
      if (!vivo) return;

      if (!res?.ok) {
        setAutorizado(false);
        return;
      }

      const datos = await res.json();
      if (!vivo) return;

      setPedidos(datos.pedidos);
      setAutorizado(true);
    })();

    return () => {
      vivo = false;
    };
  }, [recargas]);

  /* --- Flujo en directo -------------------------------------------------- */
  useEffect(() => {
    if (!autorizado) return;

    const fuente = new EventSource("/api/pedidos/stream");

    fuente.addEventListener("listo", () => setConexion("en-linea"));
    fuente.addEventListener("latido", () => setConexion("en-linea"));

    fuente.addEventListener("pedido", (e) => {
      const { tipo, pedido } = JSON.parse((e as MessageEvent).data) as {
        tipo: "nuevo" | "actualizado";
        pedido: Pedido;
      };

      setPedidos((lista) => {
        const resto = lista.filter((p) => p.id !== pedido.id);
        return [pedido, ...resto];
      });

      if (tipo === "nuevo") avisar();
    });

    // `EventSource` reintenta por su cuenta; aquí solo se refleja el estado.
    fuente.onerror = () => setConexion("caida");

    return () => fuente.close();
  }, [autorizado, avisar]);

  /* --- La pantalla de barra no debe apagarse sola ------------------------ */
  useEffect(() => {
    if (!autorizado || !("wakeLock" in navigator)) return;

    let bloqueo: WakeLockSentinel | null = null;
    const pedir = async () => {
      try {
        bloqueo = await navigator.wakeLock.request("screen");
      } catch {
        /* el navegador puede negarlo; no es crítico */
      }
    };

    pedir();
    const alVolver = () => document.visibilityState === "visible" && pedir();
    document.addEventListener("visibilitychange", alVolver);

    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      bloqueo?.release().catch(() => {});
    };
  }, [autorizado]);

  async function cambiar(id: string, estado: EstadoPedido) {
    // Optimista: en barra no se puede esperar a la red con la copa en la mano.
    setPedidos((lista) =>
      lista.map((p) => (p.id === id ? { ...p, estado } : p))
    );

    const res = await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });

    if (!res.ok) recargar();
  }

  if (autorizado === null) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-ink text-sand">
        <Loader2 className="size-6 animate-spin" aria-hidden="true" />
        <span className="sr-only">Cargando</span>
      </div>
    );
  }

  if (!autorizado) {
    return (
      <FormularioClave
        onEntrar={() => {
          audio.current ??= new AudioContext();
          audio.current.resume();
          recargar();
        }}
      />
    );
  }

  const nuevos = pedidos.filter((p) => p.estado === "nuevo");
  const enCurso = pedidos.filter((p) => p.estado === "preparando");
  const cerrados = pedidos.filter(
    (p) => p.estado === "servido" || p.estado === "cancelado"
  );

  return (
    <div className="min-h-[100dvh] bg-ink pb-16">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/95 backdrop-blur-md">
        <div className="contenedor flex h-16 items-center justify-between gap-4">
          <h1 className="font-display text-lg font-light tracking-[0.12em] text-cream">
            BARRA
          </h1>

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center gap-2 text-xs",
                conexion === "en-linea" ? "text-brass" : "text-ember"
              )}
            >
              {conexion === "en-linea" ? (
                <Wifi className="size-3.5" aria-hidden="true" />
              ) : (
                <WifiOff className="size-3.5" aria-hidden="true" />
              )}
              {conexion === "en-linea" ? "En directo" : "Reconectando…"}
            </span>

            <button
              type="button"
              onClick={() => setSonido((s) => !s)}
              aria-pressed={sonido}
              className="grid size-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-brass hover:text-brass"
              aria-label={sonido ? "Silenciar el aviso" : "Activar el aviso"}
            >
              {sonido ? (
                <Bell className="size-4" aria-hidden="true" />
              ) : (
                <BellOff className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="contenedor py-8">
        <Columna titulo="Nuevos" pedidos={nuevos} vacio="Nada pendiente.">
          {(p) => (
            <>
              <Accion onClick={() => cambiar(p.id, "preparando")} principal>
                Preparando
              </Accion>
              <Accion onClick={() => cambiar(p.id, "cancelado")}>Cancelar</Accion>
            </>
          )}
        </Columna>

        {enCurso.length > 0 && (
          <Columna titulo="En preparación" pedidos={enCurso} vacio="">
            {(p) => (
              <>
                <Accion onClick={() => cambiar(p.id, "servido")} principal>
                  <Check className="size-4" aria-hidden="true" />
                  Servido
                </Accion>
                <Accion onClick={() => cambiar(p.id, "nuevo")}>
                  <Undo2 className="size-4" aria-hidden="true" />
                  Devolver
                </Accion>
              </>
            )}
          </Columna>
        )}

        {cerrados.length > 0 && (
          <section className="mt-14">
            <h2 className="antetitulo">Cerrados hoy · {cerrados.length}</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {cerrados.slice(0, 25).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-4 py-3 text-sm text-sand"
                >
                  <span className="w-16 shrink-0 text-cream">Mesa {p.mesa}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {p.lineas.map((l) => `${l.unidades}× ${l.nombre}`).join(", ")}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatearEuros(p.totalCentimos)}
                  </span>
                  <span
                    className={cn(
                      "w-20 shrink-0 text-right text-xs",
                      p.estado === "cancelado" ? "text-ember" : "text-brass"
                    )}
                  >
                    {p.estado === "cancelado" ? "Cancelado" : "Servido"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------- */

function Columna({
  titulo,
  pedidos,
  vacio,
  children,
}: {
  titulo: string;
  pedidos: Pedido[];
  vacio: string;
  children: (p: Pedido) => React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="antetitulo">
        {titulo} · {pedidos.length}
      </h2>

      {pedidos.length === 0 ? (
        vacio && <p className="mt-5 text-sm text-sand">{vacio}</p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pedidos.map((p) => (
            <li
              key={p.id}
              className="flex flex-col rounded-2xl border border-line bg-ink-raised p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-3xl font-light text-cream">
                  Mesa {p.mesa}
                </p>
                <time
                  dateTime={p.creadoEn}
                  className="text-xs text-sand tabular-nums"
                >
                  {hora(p.creadoEn)}
                </time>
              </div>

              <ul className="mt-4 space-y-1.5">
                {p.lineas.map((l) => (
                  <li key={l.bebidaId} className="flex gap-3 text-cream">
                    <span className="w-8 shrink-0 font-display text-xl text-brass tabular-nums">
                      {l.unidades}×
                    </span>
                    <span className="min-w-0 flex-1">{l.nombre}</span>
                  </li>
                ))}
              </ul>

              {p.nota && (
                <p className="mt-4 rounded-lg border border-brass/40 bg-brass/5 p-3 text-sm text-cream">
                  {p.nota}
                </p>
              )}

              <p className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span className="text-sand">Total</span>
                <span className="font-display text-lg text-cream tabular-nums">
                  {formatearEuros(p.totalCentimos)}
                </span>
              </p>

              {p.preciosProvisionales && (
                <p className="mt-2 flex items-center gap-2 text-xs text-ember">
                  <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                  Precios sin confirmar
                </p>
              )}

              <div className="mt-5 flex gap-2">{children(p)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Accion({
  children,
  onClick,
  principal,
}: {
  children: React.ReactNode;
  onClick: () => void;
  principal?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
        principal
          ? "bg-brass text-ink hover:bg-cream"
          : "border border-line text-sand hover:border-ember hover:text-ember"
      )}
    >
      {children}
    </button>
  );
}

function FormularioClave({ onEntrar }: { onEntrar: () => void }) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const res = await fetch("/api/barra/sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave }),
    });

    setEnviando(false);

    if (!res.ok) {
      const datos = await res.json().catch(() => ({}));
      setError(datos?.error ?? "No se ha podido entrar.");
      return;
    }

    onEntrar();
  }

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-ink px-6">
      <form onSubmit={entrar} className="w-full max-w-sm">
        <p className="antetitulo">Pantalla de barra</p>
        <h1 className="titular mt-5 text-3xl text-cream">
          Introduce la clave
        </h1>

        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete="current-password"
          required
          aria-label="Clave de barra"
          className="mt-8 w-full rounded-xl border border-line bg-ink-raised px-4 py-4 text-cream focus:border-brass focus:outline-none"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-ember">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brass font-medium text-ink transition-colors hover:bg-cream disabled:opacity-60"
        >
          {enviando && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Entrar
        </button>
      </form>
    </div>
  );
}

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
