import { converter, formatHex } from "culori";

const toOklch = converter("oklch");

export const ZED_LANGUAGES = [
  "javascript", "embedded", "html", "svg", "css", "markdown", "glsl", "wgsl",
];

// Zed's documented captures, plus the nested variants used by the vendored
// upstream queries. Query generation adds these under `argiope.<language>`.
export const ZED_CAPTURE_ROLES = {
  attribute: "property",
  boolean: "constant",
  comment: "comment",
  constant: "constant",
  constructor: "type",
  embedded: "string",
  emphasis: "string",
  enum: "type",
  function: "function",
  hint: "comment",
  keyword: "keyword",
  label: "type",
  link_text: "call",
  link_uri: "call",
  namespace: "type",
  number: "number",
  operator: "operator",
  preproc: "keyword",
  primary: "type",
  property: "property",
  punctuation: "punctuation",
  selector: "type",
  storageclass: "keyword",
  string: "string",
  tag: "type",
  text: "string",
  title: "type",
  type: "type",
  variable: "variable",
  variant: "type",
};

const STANDARD_CAPTURES = Object.keys(ZED_CAPTURE_ROLES);
const hex = color => formatHex(color).toUpperCase();

export function zedRoleForCapture(capture) {
  const parts = capture.split(".");
  if (parts.includes("bracket")) return "bracket";
  if (parts.includes("delimiter") || parts.includes("list_marker")) return "punctuation";
  if (parts.includes("operator")) return "operator";
  if (parts.includes("control")) return "control";
  if (parts.includes("return")) return "return";
  if (parts.includes("escape")) return "escape";
  if (parts.includes("call") || parts.includes("method")) return "call";
  return ZED_CAPTURE_ROLES[parts[0]] ?? "plain";
}

function syntaxStyle(palette, capture) {
  const role = zedRoleForCapture(capture);
  return { color: hex(palette.colors[palette.tokens[role]]) };
}

/** Convert an Argiope palette into a Zed theme family member. */
export function zedAdapter(theme, { capturesByLanguage = {} } = {}) {
  const appearance = toOklch(theme.base.bg)?.l >= 0.6 ? "light" : "dark";
  const base = Object.fromEntries(
    Object.entries(theme.base.all).filter(([, color]) => color).map(([name, color]) => [name, hex(color)]),
  );
  const javascript = theme.languages.at("javascript");
  const syntax = Object.fromEntries(
    STANDARD_CAPTURES.map(capture => [capture, syntaxStyle(javascript, capture)]),
  );

  for (const language of ZED_LANGUAGES) {
    const palette = theme.languages.at(language);
    const captures = capturesByLanguage[language] ?? STANDARD_CAPTURES;
    for (const capture of captures) {
      syntax[`argiope.${language}.${capture}`] = syntaxStyle(palette, capture);
    }
  }

  return {
    name: theme.name,
    appearance,
    style: {
      background: base.bg,
      "editor.background": base.bg,
      "editor.foreground": base.fg,
      "editor.gutter.background": base.bg,
      "editor.active_line.background": base.menu,
      "editor.line_number": base.gutterFg,
      "editor.active_line_number": base.fg,
      "editor.indent_guide": base.nontext,
      "editor.indent_guide_active": base.comment,
      "editor.invisible": base.nontext,
      "elevated_surface.background": base.menu,
      "surface.background": base.menu,
      "element.background": base.menu,
      "element.hover": base.visual,
      "element.selected": base.selection,
      "border": base.nontext,
      "border.variant": base.nontext,
      "border.focused": base.cyan,
      "border.selected": base.cyan,
      "text": base.fg,
      "text.muted": base.comment,
      "text.placeholder": base.nontext,
      "icon": base.fg,
      "icon.muted": base.comment,
      "icon.accent": base.cyan,
      "status_bar.background": base.menu,
      "tab_bar.background": base.bg,
      "tab.active_background": base.menu,
      "tab.inactive_background": base.bg,
      "terminal.background": base.bg,
      "terminal.foreground": base.fg,
      "terminal.bright_foreground": base.brightWhite,
      "terminal.dim_foreground": base.comment,
      "terminal.ansi.black": base.black,
      "terminal.ansi.red": base.red,
      "terminal.ansi.green": base.green,
      "terminal.ansi.yellow": base.yellow,
      "terminal.ansi.blue": base.purple,
      "terminal.ansi.magenta": base.pink,
      "terminal.ansi.cyan": base.cyan,
      "terminal.ansi.white": base.white,
      "terminal.ansi.bright_black": base.comment,
      "terminal.ansi.bright_red": base.brightRed,
      "terminal.ansi.bright_green": base.brightGreen,
      "terminal.ansi.bright_yellow": base.brightYellow,
      "terminal.ansi.bright_blue": base.brightBlue,
      "terminal.ansi.bright_magenta": base.brightMagenta,
      "terminal.ansi.bright_cyan": base.brightCyan,
      "terminal.ansi.bright_white": base.brightWhite,
      syntax,
    },
  };
}

export function zedThemeFamily(entries, options = {}) {
  return {
    "$schema": "https://zed.dev/schema/themes/v0.2.0.json",
    name: "Argiope",
    author: "m4rsh",
    themes: entries.map(({ theme }) => zedAdapter(theme, options)),
  };
}

export function zedThemeJson(entries, options = {}) {
  return `${JSON.stringify(zedThemeFamily(entries, options), null, 2)}\n`;
}

export function validateZedThemeFamily(family) {
  if (!family || typeof family !== "object") throw new Error("Zed theme must be an object");
  if (typeof family.author !== "string" || typeof family.name !== "string") {
    throw new Error("Zed theme family requires name and author");
  }
  if (!Array.isArray(family.themes) || family.themes.length === 0) {
    throw new Error("Zed theme family requires at least one theme");
  }
  for (const theme of family.themes) {
    if (!theme || !["light", "dark"].includes(theme.appearance) || typeof theme.name !== "string") {
      throw new Error("Zed theme requires a name and light or dark appearance");
    }
    if (!theme.style || typeof theme.style !== "object" || !theme.style.syntax) {
      throw new Error(`Zed theme ${theme.name} requires style.syntax`);
    }
    for (const [key, value] of Object.entries(theme.style)) {
      if (key === "syntax") continue;
      if (typeof value === "string" && !/^#[0-9A-F]{6}$/.test(value)) {
        throw new Error(`Zed theme ${theme.name} has a non-normalized color at ${key}`);
      }
    }
    for (const [capture, style] of Object.entries(theme.style.syntax)) {
      if (!style || !/^#[0-9A-F]{6}$/.test(style.color)) {
        throw new Error(`Zed theme ${theme.name} has an invalid syntax style for ${capture}`);
      }
    }
  }
  return family;
}
