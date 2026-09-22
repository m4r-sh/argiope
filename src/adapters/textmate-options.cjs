// Shared, dependency-free runtime. Vendored into the TextMate and VS Code
// packages by the sync scripts, alongside generated palette data.
function customizeTheme(theme, palettes, languages = {}) {
  const data = palettes[theme.name];
  if (!data) throw new Error(`argiope: no palette data for ${theme.name}`);
  if (!languages || typeof languages !== "object" || Array.isArray(languages)) {
    throw new Error("argiope: languages must be an object");
  }
  for (const [language, assignment] of Object.entries(languages)) {
    if (!Object.hasOwn(data.families, language)) throw new Error(`argiope: unknown language family ${language}`);
    if (typeof assignment !== "boolean" &&
        !(typeof assignment === "string" && Object.hasOwn(data.families, assignment))) {
      throw new Error(`argiope: unknown palette assignment for ${language}: ${assignment}`);
    }
  }
  return {
    ...theme,
    tokenColors: theme.tokenColors.map(rule => {
      const match = /^argiope:([^:]+):([^:]+)$/.exec(rule.name ?? "");
      if (!match || !Object.hasOwn(languages, match[1])) return rule;
      const [, language, role] = match;
      const assignment = languages[language];
      const colors = assignment === false ? data.fallback
        : data.families[assignment === true ? language : assignment];
      return { ...rule, settings: { ...rule.settings,
        foreground: colors[role] ?? colors.bracket,
      } };
    }),
  };
}

module.exports = { customizeTheme };
