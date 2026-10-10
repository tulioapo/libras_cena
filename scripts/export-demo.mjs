import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Package the real production build for testers who do not have Node.js.
const dist = fileURLToPath(new URL("../dist/", import.meta.url));
let html = await readFile(join(dist, "index.html"), "utf8");
const jsMatch = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const cssMatch = html.match(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/);
if (!jsMatch || !cssMatch)
  throw new Error("Build de produção não encontrado. Execute npm run build.");
const asset = (path) => join(dist, path.replace(/^\/+/, ""));
const [js, css, favicon] = await Promise.all([
  readFile(asset(jsMatch[1]), "utf8"),
  readFile(asset(cssMatch[1]), "utf8"),
  readFile(join(dist, "favicon.svg")),
]);
const images = {};
for (const filename of await readdir(join(dist, "images"))) {
  if (!filename.endsWith(".webp")) continue;
  images[filename.slice(0, -5)] =
    `data:image/webp;base64,${(await readFile(join(dist, "images", filename))).toString("base64")}`;
}
html = html.replace(
  jsMatch[0],
  () =>
    `<script>window.__LIBRAS_IMAGE_DATA__=${JSON.stringify(images)};</script><script type="module">${js.replace(/<\/script/gi, "<\\/script")}</script>`,
);
html = html.replace(cssMatch[0], () => `<style>${css}</style>`);
html = html.replace(
  'href="/favicon.svg"',
  `href="data:image/svg+xml;base64,${favicon.toString("base64")}"`,
);
await writeFile(join(dist, "libras-em-cena.html"), html);
console.log(
  `Demo independente criada: dist/libras-em-cena.html (${Math.round(Buffer.byteLength(html) / 1024)} KB). Abra este arquivo em um navegador.`,
);
