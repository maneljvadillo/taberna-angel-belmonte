#!/usr/bin/env node
/**
 * Descarga las fotografías de la taberna a `assets/originals/`.
 *
 * No sobrescribe lo que ya exista: si dejas ahí una foto mejor con el mismo
 * nombre, este script la respeta.
 *
 *   npm run images:fetch
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FOTOS_ORIGEN } from "./fotos-origen.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGINALS = path.join(ROOT, "assets", "originals");
const existe = (p) => access(p).then(() => true, () => false);

await mkdir(ORIGINALS, { recursive: true });

let descargadas = 0;
let conservadas = 0;

for (const [nombre, url] of Object.entries(FOTOS_ORIGEN)) {
  const destino = path.join(ORIGINALS, `${nombre}.jpg`);

  if (await existe(destino)) {
    conservadas += 1;
    continue;
  }

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ✗  ${nombre}: HTTP ${res.status}`);
    process.exitCode = 1;
    continue;
  }

  await writeFile(destino, Buffer.from(await res.arrayBuffer()));
  descargadas += 1;
  console.log(`  ↓  ${nombre}.jpg`);
}

console.log(`\n${descargadas} descargadas, ${conservadas} conservadas → assets/originals/`);
