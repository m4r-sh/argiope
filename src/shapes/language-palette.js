import { Shape } from "orbz";
import { adjustedSaturation, deriveRamp, transformColor } from "../color-math.js";
import { PaletteGenerator } from "./palette-generator.js";

export const LanguagePalette = Shape({
  [Shape.name]: "ArgiopeLanguagePalette",
  generator: PaletteGenerator,
  label: "Language",
  prefix: "x",
  hue: 0,
  neutralHue: 0,
  baseHueSpread: 0,
  spread: 100,
  hueSpread: 0,
  saturationScale: 1,
  saturationOffset: 0,
  luminanceOffset: 0,
  reverse: false,
  tokens: {},
  baseTokens: {},

  get baselineSaturation() {
    return this.generator.saturation * this.saturationScale;
  },

  get effectiveSaturation() {
    return adjustedSaturation(this.baselineSaturation, this.saturationOffset);
  },

  get colors() {
    return deriveRamp(this.generator, this);
  },

  get tokenColors() {
    return Object.fromEntries(
      Object.entries(this.tokens).map(([token, shade]) => [token, this.colors[shade]]),
    );
  },

  resolveTokenColors(baseColors, useBaseTokens = false) {
    if (!useBaseTokens || Object.keys(this.baseTokens).length === 0) {
      return this.tokenColors;
    }
    return Object.fromEntries(
      Object.entries(this.baseTokens).map(([token, tone]) => [
        token,
        transformColor(baseColors[tone], this.saturationOffset, this.luminanceOffset),
      ]),
    );
  },
});
