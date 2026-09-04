# Créditos y derechos de las imágenes

## De dónde salen las fotos

Las **36 fotografías** del sitio son de la propia taberna: están descargadas de
la mediateca de su web actual (`tabernaangelbelmonte.com`, WordPress). El mapa
de qué archivo corresponde a qué original está en
[`scripts/fotos-origen.mjs`](scripts/fotos-origen.mjs), y `npm run images:fetch`
rehace la descarga.

Son fotos de cámara, de cocina y de sala: el comedor de paredes verdes, el jamón
cortado a cuchillo, las gambas rojas, las alcachofas con calamares, el steak
tartar, las chuletitas de cordero, los postres. La paleta del sitio (verde muy
oscuro, latón, crema) está sacada de ese comedor precisamente para que las fotos
no parezcan de otro restaurante.

### ⚠️ Lo que hay que confirmar antes de publicar

**Que la taberna tenga los derechos de uso.** Estar publicadas en su web no
garantiza que la cesión del fotógrafo cubra una web nueva; a veces se contrata
un reportaje para un uso concreto. Es una pregunta de un minuto y evita un
disgusto: *«estas fotos, ¿son vuestras o de un fotógrafo? ¿podemos usarlas en la
web nueva?»*

**Que se puedan conseguir los originales.** Su servidor entrega los archivos ya
reducidos a 1600 px (el comedor, a 1280 px), aunque WordPress diga que son de
5472 px. Para las fotos que van a pantalla completa —sobre todo el comedor del
héroe— convendría pedir los originales de cámara: se verían más nítidas en
pantallas grandes.

## Las fotos de Instagram

El encargo pedía usar el contenido de
[@taberna_angel_belmonte](https://www.instagram.com/taberna_angel_belmonte/).
**No se han podido descargar.** Lo comprobado:

| Vía | Resultado |
|---|---|
| Página pública del perfil | Devuelve HTML, pero ya no incrusta las fotos de las publicaciones: solo iconos de la propia interfaz de Instagram |
| `?__a=1&__d=dis` | 201 con cuerpo vacío |
| `api/v1/users/web_profile_info` | 400 |

Instagram sirve el contenido tras un muro de sesión y sus condiciones de uso
prohíben la descarga automatizada. Además, en Instagram suele haber más fotos de
móvil y de menor resolución que en la mediateca de la web.

**Si aun así interesan fotos concretas del perfil:** que la taberna las descargue
de su propia cuenta (*Configuración → Tu actividad → Descargar tu información*)
y las pase. Entran igual que cualquier otra: ver más abajo.

## Cómo cambiar o añadir una foto

1. Deja el archivo en `assets/originals/` **con el mismo nombre** que el que
   reemplaza (la extensión da igual: `.jpg`, `.png`, `.heic`, `.tif`…).
2. `npm run images`
3. Actualiza el texto alternativo en `lib/gallery.ts` o `lib/menu.ts` para que
   describa la foto nueva.

Ni `images:fetch` ni `images` sobrescriben nunca un original que ya exista.

## Inventario

**Sala:** `comedor`

**Entrantes:** `jamon-iberico` · `croquetas` · `huevos-rotos` · `habitas-jamon` ·
`boletus` · `tartar-atun` · `alcachofas-calamares` · `alcachofas-almejas` ·
`ensalada-langostinos`

**Del mar:** `gambas-rojas` · `cigalas` · `almejas` · `mejillones` · `navajas` ·
`salpicon` · `calamares-romana` · `rabas`

**Pescados:** `bacalao-gratinado` · `bacalao-salsa` · `rape-ajos` ·
`pescado-almendras`

**Carnes:** `steak-tartar` · `entrecot` · `cordero` · `solomillo-roquefort` ·
`solomillo-foie` · `foie-higos` · `albondigas` · `guiso`

**Postres:** `tiramisu` · `tarta-limon` · `crema-quemada` · `fresas-helado` ·
`helados` · `mousse-mango`

`guiso`, `rabas`, `bacalao-salsa`, `pescado-almendras`, `ensalada-langostinos`,
`calamares-romana`, `boletus` y `habitas-jamon` están descargadas y optimizadas
pero hoy no se usan en ninguna sección: quedan disponibles por si crece la carta
o la galería.

## Otras licencias

**Iconos**
- Interfaz: [Lucide](https://lucide.dev) — ISC.
- Instagram y Facebook (`components/ui/brand-icons.tsx`): trazados de
  [Simple Icons](https://simpleicons.org) — CC0 1.0. Los logotipos siguen siendo
  marcas de sus titulares; se usan solo para enlazar a los perfiles oficiales del
  negocio.

**Tipografías**
- Fraunces e Inter, servidas por `next/font` — SIL Open Font License 1.1.

**Códigos QR**
- Generados con [`qrcode`](https://github.com/soldair/node-qrcode) — MIT.

**Mapa**
- OpenStreetMap, incrustado desde `openstreetmap.org`. Datos © colaboradores de
  OpenStreetMap, bajo [ODbL](https://www.openstreetmap.org/copyright). La
  atribución aparece bajo el mapa, como exige la licencia.
- Coordenadas del local obtenidas con Nominatim (OpenStreetMap).
