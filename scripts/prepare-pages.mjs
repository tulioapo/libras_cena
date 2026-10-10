import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// A single self-contained page also works under GitHub Pages' repository path.
const docs = fileURLToPath(new URL("../docs/", import.meta.url));
await mkdir(docs, { recursive: true });
await copyFile(new URL("../dist/libras-em-cena.html", import.meta.url), `${docs}index.html`);
await writeFile(`${docs}.nojekyll`, "");
console.log("Site pronto para GitHub Pages: docs/index.html. Fonte: branch prototipo-navegavel, pasta /docs.");
