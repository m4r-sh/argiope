import { Shape } from "orbz";

export const ColorRamp = Shape({
  [Shape.name]: "ArgiopeColorRamp",
  darkest: "#000000",
  dim: "#000000",
  muted: "#000000",
  soft: "#000000",
  main: "#000000",
  accent: "#000000",
  bright: "#000000",
  light: "#000000",
  gray_dim: "#000000",
  gray: "#000000",
  gray_light: "#000000",
  gray_warm: "#000000",

  get all() {
    return Object.fromEntries(Object.keys(this).map(key => [key, this[key]]));
  },
});
