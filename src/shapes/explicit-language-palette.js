import { Shape } from "orbz";
import { ColorRamp } from "./color-ramp.js";

export const ExplicitLanguagePalette = Shape({
  [Shape.name]: "ArgiopeExplicitLanguagePalette",
  kind: "explicit",
  label: "Language",
  prefix: "x",
  ramp: ColorRamp,
  tokens: {},

  get colors() {
    return this.ramp.all;
  },

  get tokenColors() {
    return Object.fromEntries(
      Object.entries(this.tokens).map(([token, shade]) => [token, this.colors[shade]]),
    );
  },

  resolveTokenColors() {
    return this.tokenColors;
  },
});
