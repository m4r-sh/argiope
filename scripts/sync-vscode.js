import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const checkout = resolve(Bun.argv[2] ?? resolve(root, "editors", "vscode"));
const source = resolve(root, "dist", "textmate");
const syntaxes = resolve(checkout, "syntaxes");
const themes = resolve(checkout, "themes");
const manifestPath = resolve(checkout, "package.json");
const grammarFile = "argiope.injection.tmLanguage.json";

if (!existsSync(manifestPath)) {
  throw new Error("argiope: VS Code checkout not found; initialize editors/vscode or pass a checkout path");
}
if (!existsSync(source)) {
  throw new Error("argiope: generated TextMate files not found; run `bun run build:textmate` first");
}

await mkdir(syntaxes, { recursive: true });
await mkdir(themes, { recursive: true });
for (const entry of await readdir(syntaxes)) {
  if (entry === grammarFile) await rm(resolve(syntaxes, entry), { force: true });
}
for (const entry of await readdir(themes)) {
  if (entry.startsWith("argiope-") && entry.endsWith(".json")) await rm(resolve(themes, entry), { force: true });
}
await cp(resolve(source, grammarFile), resolve(syntaxes, grammarFile));
await cp(resolve(source, "argiope.interpolation.tmLanguage.json"), resolve(syntaxes, "argiope.interpolation.tmLanguage.json"));
await cp(resolve(source, "themes"), themes, { recursive: true });
await cp(resolve(source, "palettes.json"), resolve(checkout, "palettes.json"));
await cp(resolve(root, "src/adapters/textmate-options.cjs"), resolve(checkout, "textmate-options.cjs"));

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const themeFiles = (await readdir(themes)).filter(entry => /^argiope-.+\.json$/.test(entry)).sort();
const generatedThemes = await Promise.all(themeFiles.map(async (file) => {
  const theme = JSON.parse(await readFile(resolve(themes, file), "utf8"));
  return {
    label: theme.name,
    uiTheme: theme.type === "light" ? "vs" : "vs-dark",
    path: `./themes/${file}`,
  };
}));
const embeddedLanguages = {
  "meta.embedded.argiope.html": "html",
  "meta.embedded.argiope.svg": "xml",
  "meta.embedded.argiope.css": "css",
  "meta.embedded.argiope.markdown": "markdown",
  "meta.embedded.argiope.javascript": "javascript",
  "meta.embedded.argiope.glsl": "glsl",
  "meta.embedded.argiope.wgsl": "wgsl",
  "meta.interpolation.argiope": "typescript",
};

manifest.contributes = {
  ...manifest.contributes,
  grammars: [{
    scopeName: "source.argiope.injection",
    path: `./syntaxes/${grammarFile}`,
    injectTo: ["source.js", "source.ts"],
    embeddedLanguages,
    tokenTypes: Object.fromEntries(Object.keys(embeddedLanguages).map(scope => [scope, "other"])),
  }, {
    scopeName: "source.argiope.interpolation",
    path: "./syntaxes/argiope.interpolation.tmLanguage.json",
    injectTo: ["source.js", "source.ts"],
  }],
  themes: generatedThemes,
};
await Bun.write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`argiope: synced ${source} -> ${checkout}`);
