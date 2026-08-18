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

describe("nested palette Shapes", () => {
  test("stores included languages in an orbz Dict", () => {
    const theme = DEFAULT_THEMES[0].theme;
    expect(theme.languages.keys()).toEqual([
      "javascript", "html", "css", "markdown", "embedded",
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
});
