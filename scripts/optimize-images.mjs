#!/usr/bin/env node
/**
 * Optimiza las imágenes antes de que entren en el bundle.
 *
 *   assets/originals/*.{jpg,jpeg,png,webp,avif,tif}  →  assets/media/*.webp
 *
 * Redimensiona a un ancho máximo razonable para pantallas retina, recomprime a
 * WebP y quita metadatos (EXIF, geolocalización de la cámara). Los componentes
 * importan los `.webp` resultantes de forma estática, así que Next.js conoce el
 * tamaño real de cada imagen (sin saltos de layout), genera el `srcset` por
 * breakpoint y sirve AVIF a los navegadores que lo aceptan.
 *
 * Es incremental: solo reprocesa lo que ha cambiado.
 *
 *   npm run images
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGINALS = path.join(ROOT, "assets", "originals");
const MEDIA = path.join(ROOT, "assets", "media");

const ANCHO_MAXIMO = 2000;
const CALIDAD = 80;
const ENTRADAS_VALIDAS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir(MEDIA, { recursive: true });

let archivos;
try {
  archivos = await readdir(ORIGINALS);
} catch {
  console.error(
    `No existe ${path.relative(ROOT, ORIGINALS)}.\n` +
      `Ejecuta primero: npm run images:placeholders`
  );
  process.exit(1);
}

const fuentes = archivos.filter((f) => ENTRADAS_VALIDAS.has(path.extname(f).toLowerCase()));

if (fuentes.length === 0) {
  console.error(`No hay imágenes en ${path.relative(ROOT, ORIGINALS)}.`);
  process.exit(1);
}

let totalEntrada = 0;
let totalSalida = 0;
let saltadas = 0;

for (const archivo of fuentes.sort()) {
  const origen = path.join(ORIGINALS, archivo);
  const destino = path.join(MEDIA, `${path.basename(archivo, path.extname(archivo))}.webp`);

  const infoOrigen = await stat(origen);
  const infoDestino = await stat(destino).catch(() => null);

  // Incremental: si el .webp es más nuevo que el original, no hay nada que hacer.
  if (infoDestino && infoDestino.mtimeMs >= infoOrigen.mtimeMs) {
    totalEntrada += infoOrigen.size;
    totalSalida += infoDestino.size;
    saltadas += 1;
    continue;
  }

  const buffer = await sharp(origen)
    .rotate() // aplica la orientación EXIF antes de descartar los metadatos
    .resize({ width: ANCHO_MAXIMO, withoutEnlargement: true })
    .webp({ quality: CALIDAD, effort: 6 })
    .toBuffer();

  await writeFile(destino, buffer);

  totalEntrada += infoOrigen.size;
  totalSalida += buffer.length;

  const { width, height } = await sharp(buffer).metadata();
  const ahorro = Math.round((1 - buffer.length / infoOrigen.size) * 100);
  console.log(
    `  ✓  ${path.basename(destino).padEnd(24)} ${String(width).padStart(4)}×${String(height).padEnd(4)}  ` +
      `${kb(infoOrigen.size).padStart(8)} → ${kb(buffer.length).padStart(7)}  (−${ahorro}%)`
  );
}

if (saltadas) console.log(`  ·  ${saltadas} sin cambios`);

console.log(
  `\n${fuentes.length} imágenes · ${kb(totalEntrada)} → ${kb(totalSalida)} ` +
    `(−${Math.round((1 - totalSalida / totalEntrada) * 100)}%) → assets/media/`
);

/* ---------------------------------------------------------------------------
   Imagen para compartir en redes (Open Graph / Twitter Card).

   Next.js recoge `app/opengraph-image.jpg` por convención y añade solo las
   etiquetas `og:image` y `twitter:image`. Se genera una única vez y se sube al
   repositorio, para que el resultado no dependa de las tipografías instaladas
   en la máquina que despliegue.
--------------------------------------------------------------------------- */

const OG_DESTINO = path.join(ROOT, "app", "opengraph-image.jpg");
const OG_ORIGEN = path.join(ORIGINALS, "gambas-rojas.jpg");

if (!(await stat(OG_DESTINO).catch(() => null))) {
  const capa = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect width="1200" height="630" fill="#0b1410" opacity="0.62"/>
      <rect x="0" y="0" width="1200" height="630" fill="none"
            stroke="#c9a063" stroke-opacity="0.5" stroke-width="2" />
      <text x="600" y="286" text-anchor="middle" fill="#c9a063"
            font-family="Helvetica, Arial, sans-serif" font-size="24"
            letter-spacing="11">T A B E R N A</text>
      <text x="600" y="372" text-anchor="middle" fill="#f2ede4"
            font-family="Georgia, 'Times New Roman', serif" font-size="76"
            letter-spacing="4">ÁNGEL BELMONTE</text>
      <text x="600" y="438" text-anchor="middle" fill="#b5a995"
            font-family="Georgia, 'Times New Roman', serif" font-size="27"
            font-style="italic">Cuina autèntica al cor d'Andorra</text>
      <text x="600" y="520" text-anchor="middle" fill="#b5a995"
            font-family="Helvetica, Arial, sans-serif" font-size="17"
            letter-spacing="4">ANDORRA LA VELLA</text>
    </svg>`);

  await sharp(OG_ORIGEN)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .composite([{ input: capa, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(OG_DESTINO);

  console.log("  ✓  app/opengraph-image.jpg  1200×630  (imagen para compartir)");
}
