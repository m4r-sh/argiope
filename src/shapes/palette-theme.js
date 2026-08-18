import { Dict, Shape } from "orbz";
import { BaseColors } from "./base-colors.js";

export const PaletteTheme = Shape({
  [Shape.name]: "ArgiopePaletteTheme",
  base: BaseColors,
  languages: Dict,
  name: "Untitled Argiope",
  strategy: "monochrome",
  primaryLanguage: "javascript",

  get languageEntries() {
    return this.languages.keys().map(key => [key, this.languages.at(key)]);
  },

  get families() {
    return Object.fromEntries(
      this.languageEntries.map(([key, language]) => [key, language.colors]),
    );
  },

  get tokenColors() {
    const variables = {};
    for (const [, language] of this.languageEntries) {
      const colors = language.resolveTokenColors(
        this.base.all,
        this.strategy === "versicolor",
      );
      for (const [token, color] of Object.entries(colors)) {
        variables[`--${language.prefix}-${token}`] = color;
      }
    }
    return variables;
  },

  get cssVariables() {
    const primary = this.languages.at(this.primaryLanguage);
    return {
      "--editor-bg": this.base.bg,
      "--editor-fg": this.base.fg,
      "--editor-selection": this.base.selection,
      "--editor-comment": this.base.comment,
      "--chrome-bg": "oklch(14% 0.025 270)",
      "--chrome-panel": "oklch(17% 0.025 270)",
      "--chrome-line": "oklch(29% 0.025 270)",
      "--chrome-muted": "oklch(67% 0.025 250)",
      "--chrome-accent": this.strategy === "versicolor"
        ? this.base.pink
        : primary.colors.accent,
      ...this.tokenColors,
    };
  },

  get cssText() {
    const declarations = Object.entries(this.cssVariables)
      .map(([name, value]) => `  ${name}: ${value};`)
      .join("\n");
    return `:root {\n${declarations}\n}`;
  },
});
