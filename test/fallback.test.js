import { describe, expect, test } from "bun:test";
import { DEFAULT_THEMES } from "../scripts/themes.js";
import { neovimAdapter } from "../core/adapters/neovim.js";
import { helixAdapter, helixCapture } from "../core/adapters/helix.js";
import { textmateAdapter, textmatePaletteData } from "../core/adapters/textmate.js";
import customization from "../core/adapters/textmate-options.cjs";

describe("portable fallback and language assignments", () => {
  for (const { id, theme } of DEFAULT_THEMES) {
    test(`${id} uses the same generic syntax colors in all editors`, () => {
      const nvim = neovimAdapter(theme);
      const helix = helixAdapter(theme);
      const textmate = textmateAdapter(theme);
      for (const [scope, role] of [["string", "string"], ["keyword", "keyword"], ["comment", "comment"]]) {
        expect(helix.scopes[scope]).toBe(nvim.fallback[role]);
        expect(textmate.tokenColors.find(rule => rule.scope.includes(scope)).settings.foreground).toBe(nvim.fallback[role]);
      }
    });

    test(`${id} disables a family without losing token colors or changing other families`, () => {
      const normal = textmateAdapter(theme);
      const data = textmatePaletteData([{ theme }]);
      const options = { css: false, glsl: "html" };
      const configured = textmateAdapter(theme, { languages: options });
      expect(customization.customizeTheme(normal, data, options)).toEqual(configured);
      const helix = helixAdapter(theme, { languages: options });
      expect(helix.scopes[helixCapture("css", "string")]).toBe(data[theme.name].fallback.string);
      expect(helix.scopes[helixCapture("glsl", "type")]).toBe(data[theme.name].families.html.type);
      expect(configured.tokenColors.find(rule => rule.name === "argiope:html:type"))
        .toEqual(normal.tokenColors.find(rule => rule.name === "argiope:html:type"));
    });
  }

  test("rejects invalid assignments consistently", () => {
    const theme = DEFAULT_THEMES[0].theme;
    for (const languages of [{ css: "missing" }, { css: 7 }, { missing: false }]) {
      expect(() => textmateAdapter(theme, { languages })).toThrow();
      expect(() => helixAdapter(theme, { languages })).toThrow();
      expect(() => customization.customizeTheme(textmateAdapter(theme), textmatePaletteData([{ theme }]), languages)).toThrow();
    }
  });
});

test("runtime customization preserves specialized role fallbacks", () => {
  for (const { theme } of DEFAULT_THEMES) {
    for (const javascript of [false, "html"]) {
      expect(customization.customizeTheme(textmateAdapter(theme), textmatePaletteData([{ theme }]), { javascript }))
        .toEqual(textmateAdapter(theme, { languages: { javascript } }));
    }
  }
});
