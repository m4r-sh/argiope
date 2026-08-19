import { Shape } from "orbz";

export const BaseColors = Shape({
  [Shape.name]: "ArgiopeBaseColors",
  bg: "#080a16",
  fg: "#f8f8f2",
  selection: "#141739",
  comment: "#526284",
  red: "#ff5757",
  orange: "#ffb86b",
  yellow: "#f1fa89",
  beige: "#dbc99f",
  goldenYellow: "#f6ce55",
  stringGray: "#a4aab7",
  green: "#52fa7c",
  purple: "#bf95f9",
  cyan: "#8be8fd",
  pink: "#ff7ac6",
  brightRed: "#ff7070",
  brightGreen: "#6bff95",
  brightYellow: "#ffffa3",
  brightBlue: "#d6adff",
  brightMagenta: "#ff94df",
  brightCyan: "#a3ffff",
  brightWhite: "#ffffff",
  menu: "#21222c",
  visual: "#3d4351",
  gutterFg: "#4b5163",
  nontext: "#3c4149",
  white: "#abb2bf",
  black: "#181920",
  cursor: null,
  visualSelection: null,

  get all() {
    return Object.fromEntries(Object.keys(this).map(key => [key, this[key]]));
  },
});
