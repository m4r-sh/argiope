import { converter, formatHex } from "culori";
import { TEXTMATE_HOSTS, TEXTMATE_LANGUAGES } from "../textmate/languages.js";

const toOklch = converter("oklch");
const hex = value => formatHex(value).toUpperCase();

// These are deliberately ordinary TextMate descendants.  The Argiope wrapper
// selects the language-family palette without depending on a particular
// embedded grammar's private scopes.
export const TEXTMATE_SCOPE_ROLES = {
  javascript: {
    variable: ["variable"],
    property: ["variable.other.property", "variable.other.member"],
    constant: ["constant.language", "variable.other.constant"],
    string: ["string"],
    escape: ["constant.character.escape"],
    number: ["constant.numeric"],
    type: ["entity.name.type", "support.type"],
    function: ["entity.name.function", "support.function"],
    call: ["entity.name.function.call", "variable.function"],
    operator: ["keyword.operator"],
    keyword: ["storage", "keyword"],
    control: ["keyword.control"],
    return: ["keyword.control.return"],
    punctuation: ["punctuation"],
    bracket: ["punctuation.section", "punctuation.definition"],
    comment: ["comment"],
  },
  html: {
    tag: ["entity.name.tag", "entity.other.attribute-name"],
    property: ["entity.other.attribute-name"],
    string: ["string"],
    constant: ["constant"],
    punctuation: ["punctuation", "meta.tag punctuation"],
    bracket: ["punctuation.definition.tag"],
    comment: ["comment"],
  },
  svg: {
    tag: ["entity.name.tag", "entity.other.attribute-name"],
    property: ["entity.other.attribute-name"],
    string: ["string"],
    constant: ["constant"],
    punctuation: ["punctuation", "meta.tag punctuation"],
    bracket: ["punctuation.definition.tag"],
    comment: ["comment"],
  },
  css: {
    tag: ["entity.other.attribute-name.class", "entity.name.tag"],
    property: ["support.type.property-name", "meta.property-name"],
    string: ["string"],
    // CSS keywords such as `bold`, `block`, and `inherit` are named
    // `support.constant.property-value.css` by Shiki's bundled grammar.
    constant: ["constant", "constant.numeric", "support.constant"],
    function: ["entity.name.function"],
    keyword: ["keyword"],
    punctuation: ["punctuation"],
    bracket: ["punctuation.section.block", "punctuation.definition"],
    comment: ["comment"],
  },
  markdown: {
    heading: ["markup.heading"],
    list: ["markup.list"],
    link: ["markup.underline.link", "string.other.link"],
    string: ["string"],
    punctuation: ["punctuation"],
    bracket: ["punctuation.definition"],
  },
  glsl: {
    variable: ["variable"], type: ["storage.type", "entity.name.type"],
    function: ["entity.name.function", "support.function"], constant: ["constant"],
    string: ["string"], number: ["constant.numeric"], keyword: ["keyword"],
    control: ["keyword.control"], operator: ["keyword.operator"],
    punctuation: ["punctuation"], bracket: ["punctuation.section", "punctuation.definition"],
    comment: ["comment"],
  },
  wgsl: {
    variable: ["variable"], type: ["storage.type", "entity.name.type"],
    function: ["entity.name.function", "support.function"], constant: ["constant"],
    string: ["string"], number: ["constant.numeric"], keyword: ["keyword"],
    control: ["keyword.control"], operator: ["keyword.operator"],
    punctuation: ["punctuation"], bracket: ["punctuation.section", "punctuation.definition"],
    comment: ["comment"],
  },
};

// Child grammars name concrete constructs (for example an HTML tag), while
// palette definitions use the portable token vocabulary.
const PORTABLE_ROLE = {
  tag: "type",
  heading: "type",
  list: "punctuation",
  link: "call",
};

const JAVASCRIPT_HOST_SCOPES = ["source.js", "source.ts"];

const escapedDelimiter = "\\\\(?:`|\\$\\{)";
const interpolationStart = "(?<!\\\\)(?:\\\\\\\\)*(\\$\\{)";
const templateEnd = "(?<!\\\\)(?:\\\\\\\\)*`";

function tagPattern({ tag }) {
  const spelling = tag.replace(".", "\\\\.");
  // The boundary rejects property names and longer identifiers; the trailing
  // backtick ensures that only a tagged template is injected. `raw.js` is the
  // sole intentional member expression because its dot is part of `tag`.
  return `(?<![\\w$.])(${spelling})(\\s*)(\`)`;
}

function interpolation(hostScope) {
  return {
    name: "meta.interpolation.argiope",
    begin: interpolationStart,
    beginCaptures: { "1": { name: "punctuation.section.interpolation.begin.argiope" } },
    end: "(})",
    endCaptures: { "1": { name: "punctuation.section.interpolation.end.argiope" } },
    patterns: [
      // Nested braces get their own balanced region.  The host grammar remains
      // first so braces in strings and comments are consumed by that grammar.
      { include: hostScope },
      {
        begin: "\\{",
        beginCaptures: { "0": { name: "punctuation.section.interpolation.begin.argiope" } },
        end: "\\}",
        endCaptures: { "0": { name: "punctuation.section.interpolation.end.argiope" } },
        patterns: [{ include: hostScope }],
      },
    ],
  };
}

function embeddedRule(language, hostScope) {
  return {
    name: `meta.embedded.argiope.${language.id}`,
    contentName: language.scope,
    begin: tagPattern(language),
    beginCaptures: {
      "1": { name: `entity.name.function.tagged-template.argiope.${language.id}` },
      "3": { name: "punctuation.definition.string.begin.argiope" },
    },
    end: templateEnd,
    endCaptures: { "0": { name: "punctuation.definition.string.end.argiope" } },
    patterns: [
      { name: "constant.character.escape.argiope", match: escapedDelimiter },
      interpolation(hostScope),
      { include: language.scope },
    ],
  };
}

function repository(hostScope) {
  return Object.fromEntries(TEXTMATE_LANGUAGES.map(language => [
    `argiope-${language.id}`,
    embeddedRule(language, hostScope),
  ]));
}

function argiopePatterns() {
  return TEXTMATE_LANGUAGES.map(language => ({ include: `#argiope-${language.id}` }));
}

function hostShields() {
  // The standalone Shiki probe has no host fallback (that fallback consumes a
  // whole statement before a later tag can be seen). These small shields make
  // the probe obey the important host boundaries before it looks for a tag.
  return [
    { name: "comment.line.double-slash.argiope-probe", begin: "//", end: "$" },
    { name: "comment.block.argiope-probe", begin: "/\\*", end: "\\*/" },
    {
      name: "string.quoted.double.argiope-probe",
      begin: '"', end: '(?<!\\\\)"',
      patterns: [{ match: "\\\\.", name: "constant.character.escape.argiope-probe" }],
    },
    {
      name: "string.quoted.single.argiope-probe",
      begin: "'", end: "(?<!\\\\)'",
      patterns: [{ match: "\\\\.", name: "constant.character.escape.argiope-probe" }],
    },
    {
      name: "string.template.argiope-probe",
      begin: "`", end: templateEnd,
      patterns: [{ match: escapedDelimiter, name: "constant.character.escape.argiope-probe" }],
    },
    {
      name: "string.regexp.argiope-probe",
      begin: "/(?![*/])", end: "/[dgimsuvy]*",
      patterns: [{ match: "\\\\.", name: "constant.character.escape.argiope-probe" }],
    },
  ];
}

/**
 * A VS Code and Shiki injection grammar. Shiki's built-in tagged-template
 * grammars use the TypeScript template-expression rule for both hosts: it is
 * a superset of JavaScript and keeps interpolation safely balanced. `injectTo`
 * is Shiki's equivalent of VS Code's manifest registration; VS Code simply
 * ignores the extra grammar metadata.
 */
export function textmateInjectionGrammar() {
  return {
    $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "Argiope tagged templates",
    scopeName: "source.argiope.injection",
    injectTo: JAVASCRIPT_HOST_SCOPES,
    injectionSelector: "L:source.js -comment -string, L:source.ts -comment -string",
    patterns: [
      ...argiopePatterns(),
      // A child grammar normally delegates back to this injection at `${`.
      // CSS property values consume their entire value before that delegation,
      // so this top-level rule is also needed for CSS substitutions. It uses
      // the host TypeScript/JavaScript grammar rather than the child palette.
      interpolation("source.ts"),
    ],
    repository: repository("source.ts"),
  };
}

/**
 * A Shiki probe grammar. TextMate picks the earliest matching pattern, so a
 * host-grammar fallback would consume an entire JS statement before an Argiope
 * tag later in that statement can match. Leave non-Argiope source unscoped;
 * this grammar's purpose is to exercise template boundaries and child scopes.
 */
export function textmateCompositeGrammar(host) {
  const hostScope = TEXTMATE_HOSTS[host];
  if (!hostScope) throw new Error(`Unsupported TextMate host: ${host}`);
  return {
    $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: `Argiope ${host === "javascript" ? "JavaScript" : "TypeScript"}`,
    scopeName: `source.argiope.${host}`,
    patterns: [...hostShields(), ...argiopePatterns()],
    repository: repository(hostScope),
  };
}

export function textmateGrammarFiles() {
  return {
    "argiope.injection.tmLanguage.json": textmateInjectionGrammar(),
    "argiope-javascript.tmLanguage.json": textmateCompositeGrammar("javascript"),
    "argiope-typescript.tmLanguage.json": textmateCompositeGrammar("typescript"),
  };
}

export function textmateAdapter(theme) {
  const variant = toOklch(theme.base.bg)?.l >= 0.6 ? "light" : "dark";
  const tokenColors = [];
  const javascript = theme.languages.at("javascript");
  for (const [role, scopes] of Object.entries(TEXTMATE_SCOPE_ROLES.javascript)) {
    const shade = javascript.tokens[role];
    if (!shade) continue;
    tokenColors.push({
      // Keep the host palette restricted to JS/TS.  Embedded regions get a
      // separate family-specific rule below.
      scope: JAVASCRIPT_HOST_SCOPES.flatMap(host => scopes.map(scope => `${host} ${scope}`)),
      settings: { foreground: hex(javascript.colors[shade]) },
    });
  }
  for (const [language, roles] of Object.entries(TEXTMATE_SCOPE_ROLES)) {
    const palette = theme.languages.at(language);
    for (const [role, scopes] of Object.entries(roles)) {
      const shade = palette.tokens[PORTABLE_ROLE[role] ?? role];
      if (!shade) continue;
      tokenColors.push({
        scope: scopes.map(scope => `meta.embedded.argiope.${language} ${scope}`),
        settings: { foreground: hex(palette.colors[shade]) },
      });
    }
  }
  // Interpolation is JavaScript within an embedded language. Keep its
  // delimiters deliberately quiet in every variant, including Versicolor
  // whose ordinary JavaScript bracket role is intentionally high-contrast.
  tokenColors.push({
    scope: [
      "meta.interpolation.argiope punctuation.section.interpolation.begin",
      "meta.interpolation.argiope punctuation.section.interpolation.end",
    ],
    settings: { foreground: hex(javascript.colors.gray_dim) },
  });
  return {
    name: theme.name,
    type: variant,
    colors: {
      "editor.background": hex(theme.base.bg),
      "editor.foreground": hex(theme.base.fg),
      "editor.selectionBackground": hex(theme.base.selection),
      "editorLineNumber.foreground": hex(theme.base.gutterFg),
      "editorCursor.foreground": hex(theme.base.cursor ?? theme.base.fg),
      "editorWidget.background": hex(theme.base.menu),
    },
    tokenColors,
  };
}

export function textmateThemeFiles(entries) {
  return Object.fromEntries(entries.map(({ id, theme }) => [
    `argiope-${id}.json`, textmateAdapter(theme),
  ]));
}
