import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const extension = resolve(root, "editors", "vscode");
const manifest = JSON.parse(readFileSync(resolve(extension, "package.json"), "utf8"));

describe("VS Code extension manifest", () => {
  test("registers the Argiope injection against JavaScript and TypeScript", () => {
    const [grammar] = manifest.contributes.grammars;
    expect(manifest.publisher).toBe("m4rsh");
    expect(grammar.scopeName).toBe("source.argiope.injection");
    expect(grammar.injectTo).toEqual(["source.js", "source.ts"]);
    expect(existsSync(resolve(extension, grammar.path))).toBe(true);
    expect(grammar.embeddedLanguages).toEqual({
      "meta.embedded.argiope.html": "html",
      "meta.embedded.argiope.svg": "xml",
      "meta.embedded.argiope.css": "css",
      "meta.embedded.argiope.markdown": "markdown",
      "meta.embedded.argiope.javascript": "javascript",
      "meta.embedded.argiope.glsl": "glsl",
      "meta.embedded.argiope.wgsl": "wgsl",
      "meta.interpolation.argiope": "typescript",
    });
    expect(Object.values(grammar.tokenTypes)).toEqual(Array(8).fill("other"));
  });

  test("contributes all generated Argiope themes", () => {
    expect(manifest.contributes.themes).toHaveLength(6);
    for (const theme of manifest.contributes.themes) {
      expect(theme.label).toStartWith("Argiope ");
      expect(["vs", "vs-dark"]).toContain(theme.uiTheme);
      expect(existsSync(resolve(extension, theme.path))).toBe(true);
    }
  });
});
