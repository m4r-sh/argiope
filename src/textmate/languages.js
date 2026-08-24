/**
 * The fixed tagged-template languages supported by every TextMate consumer.
 * Keep this table data-only: generators decide how a language is registered
 * by VS Code or loaded by Shiki.
 */
export const TEXTMATE_LANGUAGES = [
  { tag: "html", id: "html", scope: "text.html.basic" },
  { tag: "svg", id: "svg", scope: "text.xml" },
  { tag: "css", id: "css", scope: "source.css" },
  { tag: "md", id: "markdown", scope: "text.html.markdown" },
  { tag: "raw.js", id: "javascript", scope: "source.js", member: true },
  { tag: "glsl", id: "glsl", scope: "source.glsl" },
  { tag: "wgsl", id: "wgsl", scope: "source.wgsl" },
];

export const TEXTMATE_HOSTS = {
  javascript: "source.js",
  typescript: "source.ts",
};

export const languageById = id => {
  const language = TEXTMATE_LANGUAGES.find(entry => entry.id === id);
  if (!language) throw new Error(`Unknown TextMate language: ${id}`);
  return language;
};
