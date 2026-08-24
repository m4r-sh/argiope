import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const checkout = resolve(Bun.argv[2] ?? resolve(root, "editors", "textmate"));
const source = resolve(root, "dist", "textmate");
const syntaxes = resolve(checkout, "syntaxes");
const themes = resolve(checkout, "themes");
const headlessGrammars = [
  "argiope.injection.tmLanguage.json",
];

if (!existsSync(resolve(checkout, "README.md"))) {
  throw new Error("argiope: TextMate checkout not found; initialize editors/textmate or pass a checkout path");
}
if (!existsSync(source)) {
  throw new Error("argiope: generated TextMate files not found; run `bun run build:textmate` first");
}

await mkdir(syntaxes, { recursive: true });
await mkdir(themes, { recursive: true });
for (const entry of await readdir(syntaxes)) {
  if (/^argiope(?:[.-].*)?\.tmLanguage\.json$/.test(entry)) await rm(resolve(syntaxes, entry), { force: true });
}
for (const entry of await readdir(themes)) {
  if (entry.startsWith("argiope-") && entry.endsWith(".json")) await rm(resolve(themes, entry), { force: true });
}
for (const entry of headlessGrammars) await cp(resolve(source, entry), resolve(syntaxes, entry));
await cp(resolve(source, "themes"), themes, { recursive: true });
console.log(`argiope: synced ${source} -> ${checkout}`);
