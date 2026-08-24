import { describe, expect, test } from "bun:test";
import {
  TEXTMATE_SCOPE_ROLES,
  textmateAdapter,
  textmateCompositeGrammar,
  textmateGrammarFiles,
  textmateInjectionGrammar,
  textmateThemeFiles,
} from "../src/adapters/textmate.js";
import { TEXTMATE_LANGUAGES } from "../src/textmate/languages.js";
import { DEFAULT_THEMES } from "../src/defaults.js";
import { neovimAdapter } from "../src/adapters/neovim.js";

describe("TextMate adapter", () => {
  test("generates one injection grammar and host-specific Shiki composites", () => {
    const injection = textmateInjectionGrammar();
    const javascript = textmateCompositeGrammar("javascript");
    const typescript = textmateCompositeGrammar("typescript");

    expect(injection.injectionSelector).toContain("source.js");
    expect(injection.injectionSelector).toContain("source.ts");
    expect(injection.injectTo).toEqual(["source.js", "source.ts"]);
    expect(injection.patterns.at(-1).name).toBe("meta.interpolation.argiope");
    expect(javascript.scopeName).toBe("source.argiope.javascript");
    expect(typescript.scopeName).toBe("source.argiope.typescript");
    expect(javascript.repository["argiope-html"].patterns[1].patterns[0].include).toBe("source.js");
    expect(typescript.repository["argiope-html"].patterns[1].patterns[0].include).toBe("source.ts");

    for (const { id, tag, scope } of TEXTMATE_LANGUAGES) {
      const rule = injection.repository[`argiope-${id}`];
      expect(rule.name).toBe(`meta.embedded.argiope.${id}`);
      expect(rule.begin).toContain(tag.replace(".", "\\\\."));
      expect(rule.begin).toContain("(?<![\\w$.])");
      expect(rule.contentName).toBe(scope);
      expect(rule.patterns[0].name).toBe("constant.character.escape.argiope");
      expect(rule.patterns[1].name).toBe("meta.interpolation.argiope");
      expect(rule.patterns[1].beginCaptures["1"].name)
        .toBe("punctuation.section.interpolation.begin.argiope");
    }

    expect(Object.keys(textmateGrammarFiles())).toEqual([
      "argiope.injection.tmLanguage.json",
      "argiope-javascript.tmLanguage.json",
      "argiope-typescript.tmLanguage.json",
    ]);
  });

  test("maps portable language roles to ordinary TextMate descendants", () => {
    const theme = DEFAULT_THEMES[0].theme;
    const adapted = textmateAdapter(theme);
    const neovim = neovimAdapter(theme);
    const htmlTag = adapted.tokenColors.find(entry => entry.scope
      .includes("meta.embedded.argiope.html entity.name.tag"));
    const expected = neovim.languages.html.colors[neovim.languages.html.roles.type];

    expect(adapted.type).toBe("dark");
    expect(htmlTag.settings.foreground).toBe(expected);
    const javascriptCall = adapted.tokenColors.find(entry => entry.scope
      .includes("source.js entity.name.function.call"));
    expect(javascriptCall.settings.foreground)
      .toBe(neovim.languages.javascript.colors[neovim.languages.javascript.roles.call]);
    const rawJavaScript = adapted.tokenColors.find(entry => entry.scope
      .includes("meta.embedded.argiope.javascript entity.name.function.call"));
    expect(rawJavaScript.settings.foreground).toBe(javascriptCall.settings.foreground);
    expect(adapted.colors["editor.background"]).toMatch(/^#[0-9A-F]{6}$/);
    expect(TEXTMATE_SCOPE_ROLES.glsl.keyword).toContain("keyword");
    expect(TEXTMATE_SCOPE_ROLES.css.constant).toContain("support.constant");
    expect(adapted.tokenColors.some(entry => entry.scope.includes("source.ts keyword.control"))).toBe(true);
    expect(adapted.tokenColors.some(entry => entry.scope
      .includes("meta.embedded.argiope.glsl keyword"))).toBe(true);
  });

  test("emits all six deterministic VS Code and Shiki-compatible themes", () => {
    const files = textmateThemeFiles(DEFAULT_THEMES);
    expect(Object.keys(files)).toEqual([
      "argiope-aurantia.json", "argiope-versicolor.json", "argiope-aurantia-neon.json",
      "argiope-versicolor-neon.json", "argiope-ocyaloides.json", "argiope-trifasciata.json",
    ]);
    expect(files["argiope-trifasciata.json"].type).toBe("light");
    expect(JSON.stringify(files)).not.toContain("oklch(");
  });
});
