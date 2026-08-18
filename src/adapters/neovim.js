import { CAPTURE_NAMES } from "../tokens.js";

const adaptLanguage = colors => Object.fromEntries(
  Object.entries(colors).map(([token, color]) => [CAPTURE_NAMES[token], {
    fg: color,
    ...(token === "comment" ? { italic: true } : {}),
  }]),
);

export function neovimAdapter(theme) {
  const captures = {};
  for (const [key, language] of theme.languageEntries) {
    captures[key] = adaptLanguage(language.resolveTokenColors(
      theme.base.all,
      theme.strategy === "versicolor",
    ));
  }
  return {
    editor: {
      Normal: { fg: theme.base.fg, bg: theme.base.bg },
      Comment: { fg: theme.base.comment, italic: true },
      Function: { fg: theme.base.green },
      Keyword: { fg: theme.base.pink },
    },
    captures,
  };
}
