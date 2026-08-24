import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHighlighter } from "shiki";

const root = resolve(import.meta.dir, "..");
const generated = resolve(root, "dist", "textmate");
const output = resolve(root, "docs", "shiki-preview.html");
const screenshotSource = await readFile(resolve(root, "examples", "theme-screenshot.js"), "utf8");
const themeIds = [
  "aurantia", "versicolor", "aurantia-neon", "versicolor-neon", "ocyaloides", "trifasciata",
];

// This broader fixture supplements the screenshot source so every registered
// tagged-template grammar remains easy to inspect from the same page.
const coverageSource = String.raw`const icon = svg\`<svg viewBox="0 0 1 1"><circle cx="0.5" cy="0.5" r="0.5" /></svg>\`;
const raw = raw.js\`const answer = 42;\`;
const fragment = glsl\`void main() { gl_FragColor = vec4(1.0); }\`;
const compute = wgsl\`@compute @workgroup_size(1) fn main() {}\`;
`;
const embeddedLanguages = ["html", "xml", "css", "markdown", "javascript", "glsl", "wgsl"];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function section({ id, theme, screenshot, coverage }) {
  return `<section id="${id}" class="theme">
  <header>
    <h2>${escapeHtml(theme.name)}</h2>
    <p>Same source on both sides. Shiki uses the generated Argiope TextMate theme and injection grammar; the reference image is the existing Neovim render.</p>
  </header>
  <div class="comparison">
    <figure>
      <figcaption>Shiki / TextMate</figcaption>
      ${screenshot}
    </figure>
    <figure>
      <figcaption>Neovim reference</figcaption>
      <img src="images/themes/argiope-${id}.png" alt="Neovim rendering of ${escapeHtml(theme.name)}">
    </figure>
  </div>
  <details>
    <summary>Additional injected-language coverage</summary>
    ${coverage}
  </details>
</section>`;
}

const injection = JSON.parse(await readFile(resolve(generated, "argiope.injection.tmLanguage.json"), "utf8"));
const themes = await Promise.all(themeIds.map(async (id) => [
  id,
  JSON.parse(await readFile(resolve(generated, "themes", `argiope-${id}.json`), "utf8")),
]));
const highlighter = await createHighlighter({
  langs: [injection, "javascript", "typescript", ...embeddedLanguages],
  themes: themes.map(([, theme]) => theme),
});

try {
  const sections = themes.map(([id, theme]) => section({
    id,
    theme,
    screenshot: highlighter.codeToHtml(screenshotSource, { lang: "javascript", theme: theme.name }),
    coverage: highlighter.codeToHtml(coverageSource, { lang: "javascript", theme: theme.name }),
  }));

  await mkdir(resolve(root, "docs"), { recursive: true });
  await Bun.write(output, `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Argiope Shiki and Neovim comparison</title>
  <style>
    :root { color-scheme: dark light; font-family: ui-sans-serif, system-ui, sans-serif; }
    body { margin: 0; color: #25282d; background: #eceae5; }
    main { width: min(1440px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 4rem; }
    h1, h2 { margin: 0; }
    .intro { max-width: 76ch; margin: .75rem 0 2rem; line-height: 1.55; }
    .theme { margin: 2rem 0; padding: 1.25rem; border: 1px solid #c8c5bd; border-radius: .75rem; background: #f8f7f4; box-shadow: 0 .25rem 1rem #00000012; }
    .theme header p { margin: .5rem 0 1rem; color: #59616b; line-height: 1.45; }
    .comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; align-items: start; }
    figure { margin: 0; min-width: 0; overflow: auto; border: 1px solid #cbc8c0; border-radius: .4rem; background: #111; }
    figcaption { padding: .5rem .75rem; color: #25282d; background: #e8e6e0; font-size: .875rem; font-weight: 650; }
    figure img { display: block; width: 100%; height: auto; }
    pre.shiki { margin: 0; padding: 1.5rem; min-height: 100%; overflow: auto; font: 14px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; tab-size: 2; }
    details { margin-top: 1rem; }
    summary { cursor: pointer; font-weight: 650; }
    details pre.shiki { margin-top: .75rem; border-radius: .4rem; }
    @media (max-width: 900px) { .comparison { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <h1>Argiope Shiki / Neovim comparison</h1>
    <p class="intro">Use this local page to compare the same Argiope sample across Shiki's TextMate grammar and the checked-in Neovim reference renders. The expanded fixture covers the remaining tagged languages.</p>
    ${sections.join("\n")}
  </main>
</body>
</html>\n`);
  console.log(`argiope: wrote ${output}`);
} finally {
  await highlighter.dispose();
}
