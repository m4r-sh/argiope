import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const checkout = resolve(Bun.argv[2] ?? resolve(root, "editors", "helix"));
const source = resolve(root, "dist", "helix");
const themes = resolve(checkout, "themes");
const queries = resolve(checkout, "runtime", "queries");

if (!existsSync(resolve(checkout, "README.md"))) {
  throw new Error(
    "argiope: Helix checkout not found; initialize editors/helix or pass a checkout path",
  );
}
if (!existsSync(source)) {
  throw new Error("argiope: generated Helix files not found; run `bun run build:helix` first");
}

await mkdir(themes, { recursive: true });
await mkdir(queries, { recursive: true });

for (const entry of await readdir(themes)) {
  if (entry.startsWith("argiope-") && entry.endsWith(".toml")) {
    await rm(resolve(themes, entry), { force: true });
  }
}
for (const entry of await readdir(queries)) {
  if (entry.startsWith("argiope-")) {
    await rm(resolve(queries, entry), { recursive: true, force: true });
  }
}

await cp(resolve(source, "themes"), themes, { recursive: true });
await cp(resolve(source, "runtime", "queries"), queries, { recursive: true });
await cp(resolve(source, "languages.toml"), resolve(checkout, "languages.toml"));
console.log(`argiope: synced ${source} -> ${checkout}`);
