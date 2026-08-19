import { Shape } from "orbz";
import { adjustedSaturation, deriveRamp } from "../color-math.js";
import { PaletteGenerator } from "./palette-generator.js";

export const LanguagePalette = Shape({
  [Shape.name]: "ArgiopeLanguagePalette",
  kind: "generated",
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

  resolveTokenColors() {
    return this.tokenColors;
  },
});

export const GeneratedLanguagePalette = LanguagePalette;
