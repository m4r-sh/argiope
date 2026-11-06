// Pure editor-neutral theme adapters. The resolved theme is plain data:
// {name, primaryLanguage, base, languages: {id: {colors, roles}}}.
export { SEMANTIC_ROLES, semanticColors, languageColors, validateLanguages } from './semantic.js'
export * from './adapters/neovim.js'
export * from './adapters/helix.js'
export * from './adapters/textmate.js'
