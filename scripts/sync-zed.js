import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const checkout = resolve(Bun.argv[2] ?? resolve(root, "editors", "zed"));
const source = resolve(root, "dist", "zed");
const languages = [
  "argiope-javascript", "argiope-javascript-embedded", "argiope-html", "argiope-svg",
  "argiope-css", "argiope-markdown", "argiope-glsl", "argiope-wgsl",
];

if (!existsSync(resolve(checkout, "extension.toml"))) {
  throw new Error("argiope: Zed checkout not found; initialize editors/zed or pass a checkout path");
}
if (!existsSync(source)) {
  throw new Error("argiope: generated Zed files not found; run `bun run build:zed` first");
}

await mkdir(resolve(checkout, "themes"), { recursive: true });
await cp(resolve(source, "themes", "argiope.json"), resolve(checkout, "themes", "argiope.json"));
for (const language of languages) {
  await mkdir(resolve(checkout, "languages", language), { recursive: true });
  await cp(resolve(source, "languages", language), resolve(checkout, "languages", language), { recursive: true });
}
console.log(`argiope: synced generated Zed files into ${checkout}`);
