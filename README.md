# Taberna Ángel Belmonte — web

Rediseño de la web de [Taberna Ángel Belmonte](https://tabernaangelbelmonte.com),
en Andorra la Vella, más una **carta digital con QR en cada mesa** desde la que
el cliente pide las bebidas y el pedido entra en directo en una pantalla de barra.

```bash
npm install
cp .env.example .env.local     # y pon una BARRA_TOKEN
npm run dev
```

| Ruta | Qué es | Para quién |
|---|---|---|
| `/` | El escaparate: héroe, la casa, la carta, galería, cómo visitarnos | Público |
| `/carta` | La carta en el móvil, sin pedido | Público, indexable |
| `/mesa/7` | Lo mismo con la mesa puesta: desde aquí se piden las bebidas | El QR de la mesa |
| `/barra` | Los pedidos en directo, con aviso sonoro | Barra, con clave |
| `/qr` | Genera e imprime el QR de cada mesa | Uso interno |

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19, sin `src/`) |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS v4 (tokens en `app/globals.css`) |
| Componentes | Convención shadcn/ui — `components/ui`, alias `@/*`, `cn()` |
| Animación | framer-motion |
| Iconos | lucide-react |
| Imágenes | sharp en compilación + `next/image` al servir |
| Pedidos | SQLite (`node:sqlite`, sin dependencias) + SSE |
| QR | `qrcode` |

Se eligió **Next.js** y no Astro porque el componente de referencia del héroe es
un componente cliente de React que depende de `next/image` y framer-motion, y
porque los pedidos necesitan servidor.

## ⚠️ Dónde desplegar

El escaparate es estático, pero **los pedidos necesitan un proceso Node de larga
vida con disco propio**: un VPS, Railway, Render, Fly.io o `next start` en una
máquina.

En un despliegue *serverless* (Vercel por defecto) cada petición cae en una
función distinta, sin disco compartido ni memoria común: ni la base de datos
SQLite ni el flujo de eventos en directo funcionarían. Si hace falta ir por ahí,
solo hay que reescribir `lib/pedidos/almacen.ts` (a Postgres o Turso) y
`lib/pedidos/eventos.ts` (a Redis pub/sub); el resto del código no se entera,
porque solo conoce esas dos interfaces.

Monta un volumen persistente y apunta ahí `PEDIDOS_DB`, o los pedidos se pierden
en cada despliegue.

## Variables de entorno

Ver [`.env.example`](.env.example).

| Variable | Obligatoria | Qué hace |
|---|---|---|
| `BARRA_TOKEN` | Sí | Clave de la pantalla de barra, mínimo 12 caracteres. **Sin ella, `/barra` y las rutas de pedidos responden 503**: es preferible que la pantalla no funcione a que quede abierta |
| `NEXT_PUBLIC_NUMERO_MESAS` | No (20) | Cuántas mesas hay. Decide qué valores de `/mesa/[numero]` acepta el servidor |
| `PEDIDOS_DB` | No | Ruta del fichero SQLite. Por defecto `./data/pedidos.db` |

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo (optimiza las imágenes antes) |
| `npm run build` | Producción (idem) |
| `npm run images` | Reoptimiza `assets/originals` → `assets/media` |
| `npm run images:fetch` | Descarga las fotos que falten desde la web actual |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Cómo funcionan los pedidos

```
Móvil del cliente          Servidor                    Pantalla de barra
─────────────────          ────────                    ─────────────────
/mesa/7
  elige bebidas
  «Pedir a barra»  ──POST──▶ /api/pedidos
                             valida mesa, bebidas y
                             cantidades
                             pone nombres y precios
                             guarda en SQLite
                             publica el evento  ──SSE──▶ suena el aviso
                                                         aparece la comanda
                                                         Preparando → Servido
                              ◀──PATCH─────────────────  se actualiza
```

Tres decisiones que conviene no deshacer:

- **Los precios los pone el servidor.** El móvil solo manda identificadores y
  cantidades. Si mandara precios, cualquiera podría pedirse un gin-tonic a cero
  euros editando la petición. Está probado: enviar `precioCentimos: 1` en un
  gin-tonic se ignora y se cobran los 9,00 € de la carta.
- **El alta de pedidos está limitada por IP** (12 cada 5 minutos), porque es la
  única ruta abierta.
- **La barra va por cookie `httpOnly`, no por token en la URL.** `EventSource` no
  admite cabeceras propias, y meter la clave en la URL la dejaría escrita en los
  registros del servidor.

### Seguridad de la pantalla de barra

Es una clave compartida, no un sistema de usuarios: para una tablet fija detrás
de la barra es lo proporcionado. Quien tenga la clave, entra. **Sirve el sitio
por HTTPS** o la clave viaja en claro. Si algún día hay que dar acceso a personas
distintas y poder revocarlo por separado, eso ya es otro trabajo.

## Contenido

### Datos del negocio

Todo sale de `lib/site.ts`, y de ahí lo toma también el JSON-LD. Cambiar un
horario es tocar un solo archivo.

| Dato | Valor | Fuente |
|---|---|---|
| Dirección | Carrer Ciutat de Consuegra, 3 · Casa Campolier · AD500 Andorra la Vella | Web actual |
| Teléfono | +376 822 460 | Web actual |
| Email | info@tabernaangelbelmonte.com | Fichas del negocio |
| Horario | Todos los días 13:00–15:30 y 20:00–22:30 (domingo hasta 22:00) | Restaurant Guru, Citymaps.ad |
| Coordenadas | 42.5074327, 1.5308924 | Nominatim (OpenStreetMap) |

**Conviene que la taberna confirme** el correo y el horario de domingo: proceden
de fichas de terceros, no de ellos.

### La carta

`lib/menu.ts`. Los platos están **leídos de sus propias fotografías** (la
mediateca de su web) y contrastados con lo que citan las reseñas: jamón cortado a
cuchillo, alcachofas con calamares, croquetas, huevos rotos, gambas rojas,
cigalas, almejas, navajas, bacalao gratinado, rape con ajos, steak tartar,
chuletitas de cordero, solomillo al roquefort, foie con higos, tiramisú…

Que la taberna **repase los nombres**: en la casa puede que algún plato se llame
de otra forma.

**No se publican precios de cocina.** No hay ninguna fuente fiable con la carta y
sus importes, y un precio inventado en la web es un problema en la mesa. En su
lugar va un aviso de carta de temporada.

#### Cómo añadir precios

El tipo `Plato` ya tiene el campo. Rellénalo donde corresponda; los platos sin él
siguen apareciendo sin importe:

```ts
{
  nombre: "Foie a la plancha con higos",
  descripcion: "Marcado fuerte, con higo caramelizado y reducción…",
  precio: "24",     // ← se muestra como «24 €»
}
```

### 🔴 La carta de bebidas lleva precios de prueba

`lib/bebidas.ts` tiene una lista completa (cervezas, vinos por copa, vermut,
refrescos, cafés, copas) pero **los precios los puso el desarrollador para poder
montar la pantalla**. No son los de la casa.

Mientras `PRECIOS_PROVISIONALES` sea `true`:
- la carta de bebidas avisa en pantalla al cliente,
- cada comanda llega a la barra marcada como «Precios sin confirmar»,
- y queda guardado así en la base de datos.

**Para publicar:** repasa nombres y precios con la taberna, corrígelos y pon
`PRECIOS_PROVISIONALES = false`.

### Las fotos

36 fotografías propias, descargadas de su web actual. Léase
[CREDITS.md](CREDITS.md): explica de dónde salen, qué hay que confirmar con la
taberna sobre los derechos, por qué no se han podido bajar las de Instagram y
cómo sustituir cualquiera.

## El héroe: qué se cambió de la plantilla

`components/ui/scroll-expansion-hero.tsx` parte del componente de referencia,
pero ya no comparte su mecánica. Cambios:

- **Va atado al scroll real, y por eso es reversible.** La sección ocupa un
  carril de 200vh con un bloque `sticky` de una pantalla dentro; el progreso sale
  de `useScroll`. Al bajar, la foto crece; al subir, se encoge por el mismo
  camino. La plantilla original interceptaba la rueda y abría la foto *de una vez
  y para siempre*: al volver arriba se quedaba expandida, tapando el comedor.
- **Sin secuestro del scroll.** Ni listeners de rueda con `passive: false`, ni
  `overflow: hidden` sobre el documento, ni el parche para que los enlaces del
  menú siguieran funcionando con la página bloqueada: nada de eso hace falta si
  el navegador scrollea como siempre. Se fue con ello la mitad del componente.
- **Las fotos del centro se van turnando** con un fundido de 1,2 s. La saliente
  se queda opaca por debajo hasta que la entrante está del todo puesta —si se
  cruzaran a media opacidad, el fondo oscuro se colaría entre las dos y la
  tarjeta parpadearía en cada relevo—, y se suelta con `onAnimationComplete`, no
  con un temporizador: si el fundido se queda a medias (pestaña en segundo
  plano), soltarla por reloj dejaría la tarjeta en blanco.
- **El relevo se para mientras la pestaña está oculta**, que es cuando el
  navegador congela el pintado.
- **Colores** atados a los tokens de la casa, en vez del `blue-200` de la demo.
- **Las fotos son imports estáticos**, así Next conoce el tamaño real de cada
  una, genera el `srcset` y el desenfoque de carga, y no hay saltos de
  maquetación.
- **`prefers-reduced-motion`:** quien lo tenga activado ve el héroe ya abierto,
  con una sola foto y sin carril de scroll.
- **Se cayó la rama de vídeo** de la plantilla: no se usaba.

## SEO y accesibilidad

- Metadatos completos con Open Graph y Twitter Card; `canonical`; `sitemap.xml` y
  `robots.txt` generados. `/barra`, `/qr`, `/mesa/` y `/api/` van excluidos.
- JSON-LD `schema.org/Restaurant` con dirección, coordenadas, horarios por tramo,
  rango de precio, cocinas y perfiles sociales.
- HTML semántico: un solo `<h1>`, secciones con `aria-labelledby`, horarios en
  `<table>` con encabezados de fila y columna, dirección en `<address>`.
- Enlace de salto, foco visible, menú móvil con `inert` y cierre con `Escape`,
  pestañas navegables con flechas, visor de galería con `Escape` y flechas.
- En la mesa, los botones de cantidad miden 44 px: se aciertan con el pulgar y
  con la copa en la mano.
- Texto alternativo descriptivo en todas las fotos; las decorativas con `alt=""`.
- Se respeta `prefers-reduced-motion` en toda la página.

## Rendimiento

- Las fotos pasan por sharp antes de entrar (2000 px de ancho máximo, WebP
  calidad 80, sin metadatos): **5,9 MB → 2,7 MB, un 54 % menos**. Encima,
  `next/image` recorta por breakpoint y sirve AVIF a quien lo acepte.
- Importación estática de las imágenes: dimensiones conocidas en compilación, sin
  saltos de maquetación y desenfoque de carga automático.
- El escaparate y las 20 páginas de mesa se prerrenderizan; solo las cuatro rutas
  de `/api` son dinámicas.
- En la vista de mesa, la carta de cocina se renderiza en servidor: al móvil solo
  baja JavaScript de lo que de verdad es interactivo, el pedido de bebidas.
- Cabeceras de seguridad en `next.config.ts`.

## Pendiente antes de publicar

- [ ] **Confirmar con la taberna los derechos de las fotos** ([CREDITS.md](CREDITS.md)).
- [ ] **Poner los precios reales de las bebidas** y `PRECIOS_PROVISIONALES = false`.
- [ ] Que repasen los nombres de los platos de la carta.
- [ ] Confirmar el correo y el horario de domingo.
- [ ] Generar `BARRA_TOKEN` (`openssl rand -base64 24`) y servir por HTTPS.
- [ ] Decidir el número real de mesas y ajustar `NEXT_PUBLIC_NUMERO_MESAS`.
- [ ] Imprimir los QR desde `/qr` con la dirección definitiva del sitio.
- [ ] Probar el circuito completo en la taberna, con su wifi y su tablet.
- [ ] Añadir los precios de cocina, si se quieren publicar.
- [ ] Decidir si hace falta catalán, francés e inglés: la web actual los tiene. El
      texto ya está separado en `lib/`, así que el salto a `next-intl` es acotado.
- [ ] Aviso legal y política de privacidad.
