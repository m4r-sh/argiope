import { describe, expect, test } from "bun:test";
import { DEFAULT_THEMES } from "../src/defaults.js";
import {
  validateZedThemeFamily,
  zedAdapter,
  zedThemeFamily,
  zedThemeJson,
} from "../src/adapters/zed.js";

describe("Zed adapter", () => {
  test("maps portable language roles to normalized namespaced syntax captures", () => {
    const adapted = zedAdapter(DEFAULT_THEMES[0].theme, {
      capturesByLanguage: {
        html: ["tag", "attribute"],
        svg: ["tag"],
        css: ["property"],
        javascript: ["variable"],
        embedded: ["variable"],
      },
    });
    expect(adapted.appearance).toBe("dark");
    expect(adapted.style.syntax["argiope.html.tag"].color).toMatch(/^#[0-9A-F]{6}$/);
    expect(adapted.style.syntax["argiope.svg.tag"].color)
      .not.toBe(adapted.style.syntax["argiope.html.tag"].color);
    expect(adapted.style.syntax["argiope.embedded.variable"].color)
      .not.toBe(adapted.style.syntax["argiope.javascript.variable"].color);
    expect(adapted.style["editor.background"]).toMatch(/^#[0-9A-F]{6}$/);
    expect(JSON.stringify(adapted)).not.toContain("oklch(");
  });

  test("emits a deterministic six-theme family that passes the Zed schema subset", () => {
    const family = zedThemeFamily(DEFAULT_THEMES);
    expect(validateZedThemeFamily(family)).toBe(family);
    expect(family.themes.map(theme => theme.name)).toEqual(DEFAULT_THEMES.map(({ theme }) => theme.name));
    const json = zedThemeJson(DEFAULT_THEMES);
    expect(JSON.parse(json).themes).toHaveLength(6);
    expect(json).toContain('"$schema": "https://zed.dev/schema/themes/v0.2.0.json"');
    expect(json.endsWith("\n")).toBe(true);
  });
});
