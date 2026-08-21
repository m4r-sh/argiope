import { describe, expect, test } from "bun:test";
import { Dict } from "orbz";
import {
  DEFAULT_THEMES,
  cloneTheme,
  hydrateTheme,
  migrateLegacyTheme,
  serializeTheme,
} from "../src/defaults.js";
import { LanguagePalette } from "../src/shapes/language-palette.js";
import { PaletteGenerator } from "../src/shapes/palette-generator.js";
import {
  neovimAdapter,
  neovimBuiltinsLua,
  neovimSetupLua,
} from "../src/adapters/neovim.js";

describe("nested palette Shapes", () => {
  test("stores included languages in an orbz Dict", () => {
    const theme = DEFAULT_THEMES[0].theme;
    expect(theme.languages.keys()).toEqual([
      "javascript", "html", "css", "markdown", "svg", "glsl", "wgsl",
      "embedded",
    ]);
    expect(theme.languages.at("javascript").generator.saturation).toBe(0.66);
  });

  test("round-trips nested Shapes through portable JSON", () => {
    const state = serializeTheme(DEFAULT_THEMES[2].theme);
    const restored = hydrateTheme(state);
    expect(restored.name).toBe("Argiope Aurantia Neon");
    expect(restored.languages.at("javascript").colors.main).toStartWith("oklch(");
    expect(serializeTheme(restored)).toEqual(state);
  });

  test("clones defaults before editing", () => {
    const source = DEFAULT_THEMES[0].theme;
    const clone = cloneTheme(source);
    clone.languages.at("css").hue = 42;
    expect(source.languages.at("css").hue).toBe(150);
    expect(clone.languages.at("css").hue).toBe(42);
  });

  test("preserves Trifasciata's gray JavaScript palette", () => {
    const theme = DEFAULT_THEMES.find(entry => entry.id === "trifasciata").theme;
    expect(theme.languages.at("javascript").effectiveSaturation).toBe(0);
    expect(theme.languages.at("javascript").colors.main).toContain(" 0.0000 ");
  });

  test("derives CSS for languages added to the Dict", () => {
    const theme = cloneTheme(DEFAULT_THEMES[0].theme);
    theme.languages = Dict({
      ...Object.fromEntries(theme.languageEntries),
      json: LanguagePalette({
        label: "JSON",
        prefix: "json",
        hue: 25,
        generator: PaletteGenerator({ saturation: 0.5 }),
        tokens: { property: "main" },
      }),
    });
    expect(theme.cssVariables["--json-property"]).toStartWith("oklch(");
    expect(theme.cssVariables["--json-property"]).toBe(theme.languages.at("json").colors.main);
  });

  test("gives SVG and shader languages distinct generated families", () => {
    const defaultTheme = DEFAULT_THEMES[0].theme;
    expect(defaultTheme.languages.at("svg").hue)
      .toBeGreaterThan(defaultTheme.languages.at("html").hue);

    for (const { theme } of DEFAULT_THEMES) {
      const html = theme.languages.at("html");
      const svg = theme.languages.at("svg");
      const glsl = theme.languages.at("glsl");
      const wgsl = theme.languages.at("wgsl");

      expect(svg.colors.main).not.toBe(html.colors.main);
      expect(glsl.hue).toBeGreaterThanOrEqual(270);
      expect(glsl.hue).toBeLessThanOrEqual(320);
      expect(wgsl.hue).toBeGreaterThanOrEqual(270);
      expect(wgsl.hue).toBeLessThanOrEqual(320);
      expect(glsl.colors.main).not.toBe(wgsl.colors.main);
    }
  });

  test("migrates sparse legacy themes with usable defaults", () => {
    const restored = hydrateTheme(migrateLegacyTheme({
      name: "Legacy",
      javascriptHue: 42,
      javascriptSaturationScale: 1,
    }));
    expect(restored.name).toBe("Legacy");
    expect(restored.base.bg).toBe("#080a16");
    expect(restored.languages.at("javascript").hue).toBe(42);
    expect(restored.languages.at("javascript").colors.main).toStartWith("oklch(");
  });

  test("adapts resolved colors to the Argiope Neovim contract", () => {
    const theme = DEFAULT_THEMES[0].theme;
    const adapted = neovimAdapter(theme);
    expect(adapted.base.golden_yellow).toMatch(/^#[0-9A-F]{6}$/);
    expect(adapted.languages.javascript.roles.variable).toBe("main");
    expect(adapted.languages.javascript.colors.main).toMatch(/^#[0-9A-F]{6}$/);
    expect(adapted.languages.javascript_embedded).toBeDefined();
    expect(adapted.languages.svg.roles.property).toBe("main");
    expect(adapted.languages.glsl.colors.main).toMatch(/^#[0-9A-F]{6}$/);
    expect(adapted.languages.wgsl.colors.main).toMatch(/^#[0-9A-F]{6}$/);
    expect(JSON.stringify(adapted)).not.toContain("oklch(");
  });

  test("models Versicolor JavaScript as an explicit palette", () => {
    const aurantia = DEFAULT_THEMES.find(entry => entry.id === "aurantia").theme;
    const versicolor = DEFAULT_THEMES.find(entry => entry.id === "versicolor").theme;
    expect(aurantia.languages.at("javascript").kind).toBe("generated");
    expect(versicolor.languages.at("javascript").kind).toBe("explicit");
    expect(versicolor.languages.at("javascript").colors.accent).toBe(versicolor.base.green);
    expect(versicolor.languages.at("javascript").tokens.keyword).toBe("gray_warm");
    expect(hydrateTheme(serializeTheme(versicolor)).languages.at("javascript").kind).toBe("explicit");
  });

  test("emits directly pasteable Lua with optional inheritance", () => {
    const lua = neovimSetupLua(DEFAULT_THEMES[0].theme, {
      id: "my-aurantia",
      extends: "aurantia",
    });
    expect(lua).toContain('require("argiope").setup({');
    expect(lua).toContain('["my-aurantia"] = {');
    expect(lua).toContain('extends = "aurantia"');
    expect(lua).toContain("javascript_embedded = {");
    expect(lua).toContain('["function"] =');
    expect(lua).toContain('["return"] =');
  });

  test("emits complete built-in definitions without extends", () => {
    const lua = neovimBuiltinsLua(DEFAULT_THEMES);
    expect(lua).toContain('["aurantia-neon"] = {');
    expect(lua).toContain("trifasciata = {");
    expect(lua).toContain("schema = 1");
    expect(lua).toContain("themes = {");
    expect(lua).not.toContain("extends =");
  });
});
