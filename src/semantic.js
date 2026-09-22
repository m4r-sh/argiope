// The portable fallback is independent of every language family. Adapters
// translate these roles to their editor's standard syntax scopes.
export const SEMANTIC_ROLES = {
  plain: "fg", variable: "cyan", property: "cyan", constant: "purple",
  string: "yellow", escape: "orange", number: "purple", type: "cyan",
  function: "green", call: "green", operator: "pink", keyword: "pink",
  control: "pink", return: "pink", punctuation: "fg", bracket: "fg",
  comment: "comment",
};

export function semanticColors(theme) {
  return Object.fromEntries(Object.entries(SEMANTIC_ROLES)
    .map(([role, key]) => [role, theme.base[key]]));
}

export function languageColors(theme, language, languages = {}) {
  const assignment = languages[language];
  if (assignment === false) return semanticColors(theme);
  const family = typeof assignment === "string" ? assignment : language;
  const palette = theme.languages.at(family);
  if (!palette) throw new Error(`argiope: unknown palette family ${JSON.stringify(family)}`);
  return { ...semanticColors(theme), ...palette.resolveTokenColors() };
}

export function validateLanguages(theme, languages) {
  if (!languages || typeof languages !== "object" || Array.isArray(languages)) {
    throw new Error("argiope: languages must be an object");
  }
  for (const [language, assignment] of Object.entries(languages)) {
    if (!theme.languageEntries.some(([key]) => key === language)) {
      throw new Error(`argiope: unknown language family ${JSON.stringify(language)}`);
    }
    if (typeof assignment !== "boolean" && typeof assignment !== "string") {
      throw new Error(`argiope: languages.${language} must be a boolean or palette family`);
    }
    languageColors(theme, language, languages);
  }
}
