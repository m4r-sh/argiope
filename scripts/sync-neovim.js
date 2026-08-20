import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const checkout = resolve(Bun.argv[2] ?? resolve(root, "editors", "neovim"));
const source = resolve(root, "dist", "argiope-themes.lua");
const destination = resolve(
  checkout,
  "lua",
  "argiope",
  "generated",
  "themes.lua",
);

if (!existsSync(resolve(checkout, "lua", "argiope", "palette.lua"))) {
  throw new Error(
    `argiope: Neovim checkout not found at ${checkout}; initialize the ` +
      "editors/neovim submodule or pass a checkout path",
  );
}

const generated = Bun.file(source);
if (!await generated.exists()) {
  throw new Error(
    `argiope: generated Neovim palette not found at ${source}; run ` +
      "bun run build:neovim first",
  );
}

await Bun.write(destination, generated);
console.log(`argiope: synced ${source} -> ${destination}`);
