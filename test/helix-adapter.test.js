import { describe, expect, test } from "bun:test";
import { DEFAULT_THEMES } from "../src/defaults.js";
import { helixAdapter, helixThemeFiles, helixThemeToml } from "../src/adapters/helix.js";

describe("Helix adapter", () => {
  test("maps portable roles to hexadecimal Helix scopes", () => {
    const adapted = helixAdapter(DEFAULT_THEMES[0].theme);
    expect(adapted.variant).toBe("dark");
    expect(adapted.scopes["argiope.html.tag"]).toMatch(/^#[0-9A-F]{6}$/);
    expect(adapted.scopes["argiope.svg.tag"]).not.toBe(adapted.scopes["argiope.html.tag"]);
    expect(adapted.scopes["argiope.css.property"]).toMatch(/^#[0-9A-F]{6}$/);
    expect(adapted.scopes["argiope.embedded.variable"])
      .not.toBe(adapted.scopes["argiope.javascript.variable"]);
    expect(adapted.ui["ui.background"].bg).toMatch(/^#[0-9A-F]{6}$/);
    expect(adapted.scopes["ui.text"]).toBeUndefined();
    expect(JSON.stringify(adapted)).not.toContain("oklch(");
  });

  test("emits all built-in variants as deterministic TOML", () => {
    const files = helixThemeFiles(DEFAULT_THEMES);
    expect(Object.keys(files)).toEqual([
      "argiope-aurantia.toml", "argiope-versicolor.toml", "argiope-aurantia-neon.toml",
      "argiope-versicolor-neon.toml", "argiope-ocyaloides.toml", "argiope-trifasciata.toml",
    ]);
    const toml = helixThemeToml(DEFAULT_THEMES[0].theme);
    expect(toml).toContain('"argiope.html.tag" = "#');
    expect(toml).toContain("[palette]");
    expect(toml).not.toContain("variant =");
  });
});
