import { expect, test } from "bun:test";

const root = new URL("../", import.meta.url);
const read = path => Bun.file(new URL(path, root)).text();

test("Zed runtime covers fixed tags without injecting substitutions", async () => {
  const [fixture, injections, theme, config] = await Promise.all([
    read("test/fixtures/zed/tagged-templates.js"),
    read("dist/zed/languages/argiope-javascript/injections.scm"),
    read("dist/zed/themes/argiope.json"),
    read("dist/zed/languages/argiope-javascript/config.toml"),
  ]);

  for (const tag of ["html", "svg", "css", "md", "raw.js", "glsl", "wgsl", "txt"]) {
    expect(fixture).toContain(`${tag}\``);
  }
  for (const language of ["html", "svg", "css", "markdown", "javascript-embedded", "glsl", "wgsl"]) {
    expect(injections).toContain(`argiope-${language}`);
  }
  expect(injections).toContain("(string_fragment) @injection.content");
  expect(injections).not.toContain("injection.combined");
  expect(injections).not.toContain('(#eq? @_argiope_tag "txt")');
  expect(injections).not.toContain("@argiope.javascript.constructor \"constructor\"");
  expect(config).toContain('name = "Argiope JavaScript"');
  expect(config).toContain('grammar = "tsx"');
  expect(config).toContain("path_suffixes = []");
  const parsed = JSON.parse(theme);
  expect(parsed.themes).toHaveLength(6);
  expect(parsed.themes[0].style.syntax["argiope.html.tag"].color).toMatch(/^#[0-9A-F]{6}$/);
});
