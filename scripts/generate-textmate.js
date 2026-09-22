import { mkdir } from "node:fs/promises";
import { textmateGrammarFiles, textmateThemeFiles, textmatePaletteData } from "../src/adapters/textmate.js";
import { DEFAULT_THEMES } from "../src/defaults.js";

const root = new URL("../dist/textmate/", import.meta.url);
const grammars = textmateGrammarFiles();
const themes = textmateThemeFiles(DEFAULT_THEMES);

await mkdir(new URL("themes/", root), { recursive: true });
await Bun.write(new URL("palettes.json", root), `${JSON.stringify(textmatePaletteData(DEFAULT_THEMES), null, 2)}\n`);
for (const [name, grammar] of Object.entries(grammars)) {
  await Bun.write(new URL(name, root), `${JSON.stringify(grammar, null, 2)}\n`);
}
for (const [name, theme] of Object.entries(themes)) {
  await Bun.write(new URL(`themes/${name}`, root), `${JSON.stringify(theme, null, 2)}\n`);
}
console.log(`Wrote ${root.pathname}`);
