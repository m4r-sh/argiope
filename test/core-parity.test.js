import { test, expect } from 'bun:test';
import { DEFAULT_THEMES } from '../scripts/themes.js';
import * as core from '../core/index.js';

for (const { id, theme } of DEFAULT_THEMES) {
  test(`${id}: editor exports preserve independent role assignments and their input`, () => {
    const before = JSON.stringify(theme);
    const nvim = core.neovimAdapter(theme);
    const helix = core.helixAdapter(theme);
    for (const [family, palette] of Object.entries(theme.languages)) {
      const target = nvim.languages[family === 'embedded' ? 'javascript_embedded' : family];
      expect(target.roles).toEqual(palette.roles);
      for (const [role, shade] of Object.entries(palette.roles)) {
        const color = target.colors[shade];
        expect(color).toMatch(/^#[0-9A-F]{6}$/);
        const capture = core.HELIX_CAPTURE_ROLES[family];
        if (capture && Object.hasOwn(capture, role)) {
          expect(helix.scopes[core.helixCapture(family, role)]).toBe(color);
        }
      }
    }
    core.neovimDefinitionLua(theme);
    core.helixThemeToml(theme);
    core.textmateAdapter(theme);
    core.helixAdapter(theme, { languages: { javascript: false, css: 'html' } });
    core.textmateAdapter(theme, { languages: { javascript: false, css: 'html' } });
    expect(JSON.stringify(theme)).toBe(before);
  });
}

test('extra roles use arbitrary named shades in editor exports', () => {
  const theme = structuredClone(DEFAULT_THEMES[0].theme);
  for (const language of ['javascript', 'embedded']) {
    Object.assign(theme.languages[language].colors, { custom_builtin: '#123456', custom_method: '#abcdef', custom_const: '#987654' });
    Object.assign(theme.languages[language].roles, { builtin: 'custom_builtin', method_call: 'custom_method', const_binding: 'custom_const' });
  }
  const nvim = core.neovimAdapter(theme);
  expect(nvim.languages.javascript.roles.const_binding).toBe('custom_const');
  expect(nvim.languages.javascript.colors.custom_const).toBe('#987654');
  const helix = core.helixAdapter(theme);
  expect(helix.scopes[core.helixCapture('javascript', 'builtin')]).toBe('#123456');
  expect(helix.scopes[core.helixCapture('javascript', 'method_call')]).toBe('#ABCDEF');
  expect(helix.scopes[core.helixCapture('javascript', 'const_binding')]).toBe('#987654');
  const tm = core.textmateAdapter(theme);
  expect(tm.tokenColors.find(rule => rule.name === 'argiope:javascript:const_binding').settings.foreground).toBe('#987654');
  expect(tm.tokenColors.find(rule => rule.name === 'argiope:embedded:const_binding').settings.foreground).toBe('#987654');
});

test('TextMate grammar distinguishes const declarations without recoloring variable uses', async () => {
  const { createHighlighter } = await import('shiki');
  const theme = structuredClone(DEFAULT_THEMES[0].theme);
  theme.languages.javascript.colors.custom_const = '#987654';
  theme.languages.javascript.roles.const_binding = 'custom_const';
  const rendered = core.textmateAdapter(theme);
  rendered.name = 'argiope-parity';
  const highlighter = await createHighlighter({ langs: ['javascript'], themes: [rendered] });
  const tokens = highlighter.codeToTokens('const subject = 1; subject.reduce();', {
    lang: 'javascript', theme: rendered.name, includeExplanation: true,
  }).tokens.flat();
  const subjects = tokens.filter(token => token.explanation?.some(part => part.content === 'subject'));
  expect(subjects).toHaveLength(2);
  expect(subjects[0].color).toBe('#987654');
  expect(subjects[1].color).not.toBe('#987654');
  highlighter.dispose();
});

test('built-in palettes retain twelve colors and valid assignments', () => {
  for (const { theme } of DEFAULT_THEMES) {
    for (const palette of Object.values(theme.languages)) {
      expect(Object.keys(palette.colors)).toHaveLength(12);
      for (const shade of Object.values(palette.roles)) expect(palette.colors[shade]).toBeDefined();
    }
  }
});

