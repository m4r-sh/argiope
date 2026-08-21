import { expect, test } from "bun:test";

const root = new URL("../", import.meta.url);
const read = path => Bun.file(new URL(path, root)).text();

test("Helix fixture and runtime cover the fixed injection set", async () => {
  const [fixture, captures, indents, injections, languages] = await Promise.all([
    read("test/fixtures/helix/tagged-templates.js"),
    read("test/fixtures/helix/tagged-templates.captures.expected"),
    read("test/fixtures/helix/tagged-templates.indents.expected"),
    read("dist/helix/runtime/queries/argiope-javascript/injections.scm"),
    read("dist/helix/languages.toml"),
  ]);

  for (const tag of ["html", "svg", "css", "md", "raw.js", "glsl", "wgsl", "txt"]) {
    expect(fixture).toContain(`${tag}\``);
  }
  for (const language of ["html", "svg", "css", "markdown", "javascript", "javascript-embedded", "glsl", "wgsl"]) {
    expect(captures).toContain(`argiope-${language}`);
    expect(languages).toContain(`name = "argiope-${language}"`);
  }
  expect(injections).toContain("arguments: (template_string) @injection.content");
  expect(injections).toStartWith("(call_expression");
  expect(injections).not.toContain("injection.combined");
  expect(injections).not.toContain('"txt"');
  expect(indents).toContain("incomplete");
});
