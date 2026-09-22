import { expect, test } from "bun:test";
import { DEFAULT_THEMES } from "../src/defaults.js";
import { textmateAdapter, textmatePaletteData } from "../src/adapters/textmate.js";
import customization from "../editors/vscode/customizations.cjs";

test("VS Code toggles and resets preserve user rules and other themes", () => {
  const themes = DEFAULT_THEMES.map(({ theme }) => textmateAdapter(theme));
  const palettes = textmatePaletteData(DEFAULT_THEMES);
  const current = {
    comments: "#123456",
    "[Other Theme]": { strings: "#654321" },
    "[Argiope Aurantia]": { textMateRules: [{ scope: "comment", settings: { fontStyle: "italic" } }] },
  };
  const disabled = customization.updateCustomizations(current, themes, palettes, { css: false });
  expect(disabled["[Other Theme]"]).toEqual(current["[Other Theme]"]);
  expect(disabled["[Argiope Aurantia]"].textMateRules[0]).toEqual(current["[Argiope Aurantia]"].textMateRules[0]);
  const css = disabled["[Argiope Aurantia]"].textMateRules.find(rule => rule.name === "argiope-managed:argiope:css:string");
  expect(css.settings.foreground).toBe(palettes["Argiope Aurantia"].fallback.string);
  expect(customization.updateCustomizations(disabled, themes, palettes, { css: false })).toEqual(disabled);
  expect(customization.updateCustomizations(disabled, themes, palettes, {})).toEqual(current);
  expect(customization.updateCustomizations(disabled, themes, palettes, { css: true })).toEqual(current);
});
