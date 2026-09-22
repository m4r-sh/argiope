import { converter, formatHex } from "culori";
import { languageColors, semanticColors, validateLanguages } from "../semantic.js";

const toOklch = converter("oklch");

const BASE_SCOPES = {
  // Plain text is supplied by ui.text below; it is not a syntax scope.
  plain: [],
  variable: ["variable"],
  property: ["variable.other.member", "attribute"],
  constant: ["constant"],
  string: ["string"],
  escape: ["constant.character.escape"],
  number: ["constant.numeric"],
  type: ["type"],
  function: ["function"],
  call: ["function.call"],
  operator: ["operator"],
  keyword: ["keyword"],
  control: ["keyword.control"],
  return: ["keyword.control.return"],
  punctuation: ["punctuation"],
  bracket: ["punctuation.bracket"],
  comment: ["comment"],
};

// Query captures use these names rather than Helix's global scopes so an
// injection can retain its own palette family even when it shares a parser.
export const HELIX_CAPTURE_ROLES = {
  html: {
    tag: "type",
    property: "property",
    string: "string",
    constant: "constant",
    punctuation: "punctuation",
    bracket: "bracket",
    comment: "comment",
  },
  svg: {
    tag: "type",
    property: "property",
    string: "string",
    constant: "constant",
    punctuation: "punctuation",
    bracket: "bracket",
    comment: "comment",
  },
  css: {
    tag: "type",
    property: "property",
    string: "string",
    constant: "constant",
    function: "function",
    keyword: "keyword",
    punctuation: "punctuation",
    bracket: "bracket",
    comment: "comment",
  },
  markdown: {
    heading: "type",
    list: "punctuation",
    link: "call",
    string: "string",
    punctuation: "punctuation",
    bracket: "bracket",
  },
  glsl: {
    variable: "variable",
    type: "type",
    function: "function",
    constant: "constant",
    string: "string",
    number: "number",
    keyword: "keyword",
    control: "control",
    operator: "operator",
    punctuation: "punctuation",
    bracket: "bracket",
    comment: "comment",
  },
  wgsl: {
    variable: "variable",
    type: "type",
    function: "function",
    constant: "constant",
    string: "string",
    number: "number",
    keyword: "keyword",
    control: "control",
    operator: "operator",
    punctuation: "punctuation",
    bracket: "bracket",
    comment: "comment",
  },
  javascript: {
    variable: "variable",
    property: "property",
    constant: "constant",
    string: "string",
    escape: "escape",
    number: "number",
    type: "type",
    function: "function",
    call: "call",
    operator: "operator",
    keyword: "keyword",
    control: "control",
    return: "return",
    punctuation: "punctuation",
    bracket: "bracket",
    comment: "comment",
  },
  embedded: {
    variable: "variable",
    property: "property",
    constant: "constant",
    string: "string",
    number: "number",
    type: "type",
    function: "function",
    keyword: "keyword",
    control: "control",
    operator: "operator",
    punctuation: "punctuation",
    bracket: "bracket",
    comment: "comment",
  },
};

const hex = color => formatHex(color).toUpperCase();
Object.assign(HELIX_CAPTURE_ROLES.embedded, HELIX_CAPTURE_ROLES.javascript);
const quote = value => JSON.stringify(value);

export function helixCapture(language, capture) {
  const role = HELIX_CAPTURE_ROLES[language][capture];
  return `${BASE_SCOPES[role][0]}.argiope.${language}.${capture}`;
}

function languageScopes(language) {
  const scopes = {};
  for (const [capture, role] of Object.entries(HELIX_CAPTURE_ROLES[language])) {
    scopes[`argiope.${language}.${capture}`] = role;
  }
  return scopes;
}

/** Converts an Argiope palette to the small, stable subset of Helix theme TOML. */
export function helixAdapter(theme, { languages = {} } = {}) {
  validateLanguages(theme, languages);
  const background = toOklch(theme.base.bg)?.l >= 0.6 ? "light" : "dark";
  const colors = Object.fromEntries(
    Object.entries(theme.base.all).filter(([, color]) => color).map(([key, color]) => [key, hex(color)]),
  );
  const scopes = {};
  const fallback = semanticColors(theme);

  for (const [role, helixScopes] of Object.entries(BASE_SCOPES)) {
    const color = fallback[role];
    for (const scope of helixScopes) scopes[scope] = hex(color);
  }

  for (const [language, captures] of Object.entries(HELIX_CAPTURE_ROLES)) {
    const palette = languageColors(theme, language, languages);
    for (const [capture, role] of Object.entries(captures)) {
      scopes[`argiope.${language}.${capture}`] = hex(palette[role]);
      scopes[helixCapture(language, capture)] = hex(palette[role]);
    }
  }

  Object.assign(scopes, {
    tag: hex(fallback.type), constructor: hex(fallback.type),
    namespace: hex(fallback.variable), label: hex(fallback.variable),
    "markup.heading": hex(fallback.type), "markup.link": hex(fallback.call),
    "markup.raw": hex(fallback.string), "markup.list": hex(fallback.punctuation),
    "markup.bold": { modifiers: ["bold"] }, "markup.italic": { modifiers: ["italic"] },
    "markup.strikethrough": { modifiers: ["crossed_out"] },
  });

  return {
    variant: background,
    palette: colors,
    scopes,
    ui: {
      "ui.background": { bg: colors.bg },
      "ui.text": { fg: colors.fg },
      "ui.selection": { bg: colors.selection },
      "ui.cursorline": { bg: colors.menu },
      "ui.linenr": { fg: colors.gutterFg },
      "ui.linenr.selected": { fg: colors.fg },
      "ui.statusline": { fg: colors.fg, bg: colors.menu },
      "ui.statusline.inactive": { fg: colors.comment, bg: colors.menu },
      "ui.popup": { bg: colors.menu },
      "ui.menu": { fg: colors.fg, bg: colors.menu },
      "ui.menu.selected": { fg: colors.bg, bg: colors.cyan },
      "ui.window": { fg: colors.nontext },
      "ui.virtual": { fg: colors.comment },
      "ui.virtual.whitespace": { fg: colors.nontext },
    },
  };
}

export function helixThemeToml(theme, options) {
  const adapted = helixAdapter(theme, options);
  const lines = [
    "# Generated by argiope-palettes. Do not edit by hand.",
    "",
  ];

  for (const [scope, color] of Object.entries(adapted.scopes)) {
    lines.push(`${quote(scope)} = ${typeof color === "string" ? quote(color) : `{ modifiers = ${JSON.stringify(color.modifiers)} }`}`);
  }
  for (const [scope, spec] of Object.entries(adapted.ui)) {
    lines.push(`${quote(scope)} = { ${Object.entries(spec).map(([key, color]) => `${key} = ${quote(color)}`).join(", ")} }`);
  }

  lines.push("", "[palette]");
  for (const [name, color] of Object.entries(adapted.palette)) lines.push(`${name} = ${quote(color)}`);
  return `${lines.join("\n")}\n`;
}

export function helixThemeFiles(entries) {
  return Object.fromEntries(entries.map(({ id, theme }) => [`argiope-${id}.toml`, helixThemeToml(theme)]));
}

export { languageScopes };
