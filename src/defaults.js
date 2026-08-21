import { Dict } from "orbz";
import { TOKEN_MAPS, VERSICOLOR_TOKENS } from "./tokens.js";
import { BaseColors } from "./shapes/base-colors.js";
import { ColorRamp } from "./shapes/color-ramp.js";
import { ExplicitLanguagePalette } from "./shapes/explicit-language-palette.js";
import { LanguagePalette } from "./shapes/language-palette.js";
import { PaletteGenerator } from "./shapes/palette-generator.js";
import { PaletteTheme } from "./shapes/palette-theme.js";

const CLASSIC_BASE = {
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
  brightRed: "#ff7070", brightGreen: "#6bff95", brightYellow: "#ffffa3",
  brightBlue: "#d6adff", brightMagenta: "#ff94df", brightCyan: "#a3ffff",
  brightWhite: "#ffffff", menu: "#21222c", visual: "#3d4351",
  gutterFg: "#4b5163", nontext: "#3c4149", white: "#abb2bf", black: "#181920",
};

const NEON_BASE = {
  bg: "#05070b",
  fg: "#f2f5fa",
  selection: "#243657",
  comment: "#8290a8",
  red: "#ff6969",
  orange: "#ffad55",
  yellow: "#f5df5b",
  beige: "#ead9ad",
  goldenYellow: "#ffd447",
  stringGray: "#c8d0dc",
  green: "#62e493",
  purple: "#c29cff",
  cyan: "#53d8ef",
  pink: "#ff82c3",
  brightRed: "#ff8585", brightGreen: "#83f0aa", brightYellow: "#ffed78",
  brightBlue: "#9dbbff", brightMagenta: "#ff9dd1", brightCyan: "#7ce8f7",
  brightWhite: "#ffffff", menu: "#0e1420", visual: "#30466d",
  gutterFg: "#5d6b82", nontext: "#354158", white: "#d4dae4", black: "#000000",
};

const OCYALOIDES_BASE = {
  bg: "#151719",
  fg: "#c7c9c8",
  selection: "#292d31",
  comment: "#6f7477",
  red: "#b77e7e",
  orange: "#c39a70",
  yellow: "#b8ad79",
  beige: "#aaa79d",
  goldenYellow: "#c0a45f",
  stringGray: "#9da1a2",
  green: "#84a68f",
  purple: "#9b91ad",
  cyan: "#819fa5",
  pink: "#b18199",
  brightRed: "#c58b8b", brightGreen: "#92b39d", brightYellow: "#c5bb87",
  brightBlue: "#959eaf", brightMagenta: "#bd91a7", brightCyan: "#8dabb0",
  brightWhite: "#e1e2df", menu: "#1d2023", visual: "#34393d",
  gutterFg: "#50565a", nontext: "#3b4043", white: "#adb1b1", black: "#0e0f10",
};

const TRIFASCIATA_BASE = {
  bg: "#f7f5ef",
  fg: "#25282d",
  selection: "#dbe5f3",
  comment: "#9c9c9c",
  red: "#ad0000",
  orange: "#994f00",
  yellow: "#756c00",
  beige: "#704f00",
  goldenYellow: "#8a6700",
  stringGray: "#59616b",
  green: "#00702f",
  purple: "#5700ad",
  cyan: "#00667a",
  pink: "#a3005c",
  brightRed: "#cc0000", brightGreen: "#008a39", brightYellow: "#8f8300",
  brightBlue: "#0041c2", brightMagenta: "#c20088", brightCyan: "#007b94",
  brightWhite: "#ffffff", menu: "#ebe8df", visual: "#cbd9eb",
  gutterFg: "#9a9da0", nontext: "#b7b7b2", white: "#4f555d", black: "#17191c",
  cursor: "#faeb42", visualSelection: "#f9f3b4",
};

const GENERATORS = {
  classic: {
    saturation: 0.66,
    lMin: 0.32,
    lMax: 0.88,
    neutralSaturation: 0.08,
    neutralLMin: 0.45,
    neutralLMax: 0.86 
  },
  neon: {
    saturation: 0.88,
    lMin: 0.55,
    lMax: 0.95,
    neutralSaturation: 0.08,
    neutralLMin: 0.55,
    neutralLMax: 0.93 
  },
  ocyaloides: {
    saturation: 0.38,
    lMin: 0.4,
    lMax: 0.82,
    neutralSaturation: 0.025,
    neutralLMin: 0.44,
    neutralLMax: 0.78 
  },
  trifasciata: {
    saturation: 1,
    lMin: 0.18,
    lMax: 0.52,
    neutralSaturation: 0,
    neutralLMin: 0.3,
    neutralLMax: 0.56,
    fullSaturation: true 
  },
};

function language(generatorState, state) {
  return LanguagePalette({
    generator: PaletteGenerator(generatorState),
    ...state,
  });
}

function explicitJavaScript(base) {
  return ExplicitLanguagePalette({
    label: "JavaScript",
    prefix: "j",
    ramp: ColorRamp({
      darkest: base.red,
      dim: base.orange,
      muted: base.stringGray,
      soft: base.beige,
      main: base.fg,
      accent: base.green,
      bright: base.goldenYellow,
      light: base.cyan,
      gray_dim: base.comment,
      gray: base.fg,
      gray_light: base.purple,
      gray_warm: base.pink,
    }),
    tokens: VERSICOLOR_TOKENS,
  });
}

function includedLanguages(generatorState, options = {}) {
  const reverse = options.reverse === true;
  const grayJavaScript = options.grayJavaScript === true;
  return Dict({
    javascript: options.javascript ?? language(generatorState, {
      label: "JavaScript", prefix: "j", hue: grayJavaScript ? 255 : 79,
      neutralHue: 255, baseHueSpread: grayJavaScript ? 0 : 67,
      saturationScale: grayJavaScript ? options.grayScale ?? 0.08 : 1,
      reverse, tokens: TOKEN_MAPS.javascript,
    }),
    html: language(generatorState, {
      label: "HTML", prefix: "h", hue: options.htmlHue ?? 210, neutralHue: 220,
      reverse, tokens: TOKEN_MAPS.html,
    }),
    css: language(generatorState, {
      label: "CSS", prefix: "c", hue: 150, neutralHue: 160,
      reverse, tokens: TOKEN_MAPS.css,
    }),
    markdown: language(generatorState, {
      label: "Markdown", prefix: "m", hue: 355, neutralHue: 350,
      reverse, tokens: TOKEN_MAPS.markdown,
    }),
    svg: language(generatorState, {
      label: "SVG", prefix: "s", hue: 245, neutralHue: 250,
      reverse, tokens: TOKEN_MAPS.svg,
    }),
    glsl: language(generatorState, {
      label: "GLSL", prefix: "g", hue: 285, neutralHue: 285,
      reverse, tokens: TOKEN_MAPS.glsl,
    }),
    wgsl: language(generatorState, {
      label: "WGSL", prefix: "w", hue: 310, neutralHue: 305,
      reverse, tokens: TOKEN_MAPS.wgsl,
    }),
    embedded: language(generatorState, {
      label: "Embedded JavaScript", prefix: "e", hue: 255, neutralHue: 255,
      saturationScale: options.embeddedGray ? options.grayScale ?? 0.08 : 1,
      reverse, tokens: TOKEN_MAPS.javascript,
    }),
  });
}

export function createTheme({ name, strategy = "monochrome", base, generator, languages }) {
  return PaletteTheme({
    name,
    strategy,
    base: BaseColors(base),
    languages,
  });
}

function builtIn(id, spec) {
  const generator = GENERATORS[spec.generator];
  const javascript = spec.strategy === "versicolor"
    ? explicitJavaScript(spec.base)
    : undefined;
  return {
    id,
    builtIn: true,
    theme: createTheme({
      name: spec.name,
      strategy: spec.strategy,
      base: spec.base,
      generator,
      languages: includedLanguages(generator, { ...spec.languages, javascript }),
    }),
  };
}

export const DEFAULT_THEMES = [
  builtIn("aurantia", { name: "Argiope Aurantia", base: CLASSIC_BASE, generator: "classic" }),
  builtIn("versicolor", { name: "Argiope Versicolor", strategy: "versicolor", base: CLASSIC_BASE, generator: "classic" }),
  builtIn("aurantia-neon", { name: "Argiope Aurantia Neon", base: NEON_BASE, generator: "neon" }),
  builtIn("versicolor-neon", { name: "Argiope Versicolor Neon", strategy: "versicolor", base: NEON_BASE, generator: "neon" }),
  builtIn("ocyaloides", { name: "Argiope Ocyaloides", base: OCYALOIDES_BASE, generator: "ocyaloides", languages: { grayJavaScript: true, embeddedGray: true, grayScale: 0.08 } }),
  builtIn("trifasciata", { name: "Argiope Trifasciata", base: TRIFASCIATA_BASE, generator: "trifasciata", languages: { reverse: true, grayJavaScript: true, embeddedGray: true, grayScale: 0, htmlHue: 260 } }),
];

export function hydrateTheme(state) {
  const languageEntries = Object.fromEntries(
    Object.entries(state.languages).map(([key, value]) => {
      if (value.kind === "explicit") {
        const { ramp, ...palette } = value;
        return [key, ExplicitLanguagePalette({
          ...palette,
          ramp: ColorRamp(ramp),
        })];
      }
      const { generator, ...palette } = value;
      return [key, LanguagePalette({
        ...palette,
        generator: PaletteGenerator(generator),
      })];
    }),
  );
  const { base, languages, ...theme } = state;
  return PaletteTheme({
    ...theme,
    base: BaseColors(base),
    languages: Dict(languageEntries),
  });
}

export const serializeTheme = theme => JSON.parse(JSON.stringify(theme));
export const cloneTheme = theme => hydrateTheme(serializeTheme(theme));

export function migrateLegacyTheme(state) {
  const baseKeys = [
    "bg", "fg", "selection", "comment", "red", "orange", "yellow", "beige",
    "goldenYellow", "stringGray", "green", "purple", "cyan", "pink",
    "brightRed", "brightGreen", "brightYellow", "brightBlue", "brightMagenta",
    "brightCyan", "brightWhite", "menu", "visual", "gutterFg", "nontext",
    "white", "black", "cursor", "visualSelection",
  ];
  const base = Object.fromEntries(baseKeys.map(key => [key, state[key] ?? CLASSIC_BASE[key]]));
  const classicGenerator = GENERATORS.classic;
  const generator = {
    saturation: state.rampSaturation ?? classicGenerator.saturation,
    lMin: state.rampLMin ?? classicGenerator.lMin,
    lMax: state.rampLMax ?? classicGenerator.lMax,
    neutralSaturation: state.neutralSaturation ?? classicGenerator.neutralSaturation,
    neutralLMin: state.neutralLMin ?? classicGenerator.neutralLMin,
    neutralLMax: state.neutralLMax ?? classicGenerator.neutralLMax,
    fullSaturation: state.fullSaturation ?? false,
  };
  const languages = includedLanguages(generator, {
    reverse: state.reverseRamps,
    grayJavaScript: state.javascriptSaturationScale < 1,
    embeddedGray: state.embeddedSaturationScale < 1,
    grayScale: state.javascriptSaturationScale,
    htmlHue: state.htmlHue,
  });
  if (state.strategy === "versicolor") {
    languages.set("javascript", explicitJavaScript(base));
  }
  for (const key of languages.keys()) {
    const palette = languages.at(key);
    palette.hue = state[`${key}Hue`] ?? palette.hue;
    palette.neutralHue = state[`${key}NeutralHue`] ?? palette.neutralHue;
    palette.baseHueSpread = state[`${key}BaseHueSpread`] ?? palette.baseHueSpread;
    palette.spread = state[`${key}Spread`] ?? palette.spread;
    palette.hueSpread = state[`${key}HueSpread`] ?? palette.hueSpread;
    palette.saturationScale = state[`${key}SaturationScale`] ?? palette.saturationScale;
    palette.saturationOffset = state[`${key}SaturationOffset`] ?? palette.saturationOffset;
    palette.luminanceOffset = state[`${key}LuminanceOffset`] ?? palette.luminanceOffset;
  }
  return serializeTheme(createTheme({
    name: state.name ?? "Imported theme",
    strategy: state.strategy ?? "monochrome",
    base,
    generator,
    languages,
  }));
}
