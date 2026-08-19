import { mkdir, mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { $ } from "bun";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = resolve(process.env.ARGIOPE_PLUGIN_ROOT?.trim() || join(root, "..", "argiope"));
const deps = resolve(pluginRoot, ".deps");
const width = 1000;
const initialHeight = 600;
const outputDirectory = resolve(root, "docs", "images", "themes");

function resolveNvim() {
  const configured = process.env.NVIM_BIN?.trim();
  if (configured) return configured;
  for (const candidate of ["nvim12", "nvim"]) {
    const executable = Bun.which(candidate);
    if (executable) return executable;
  }
  throw new Error("argiope-palettes: set NVIM_BIN to a Neovim 0.12+ executable");
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageFor(theme) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(theme.name)}</title>
  <style>
    ${theme.css}
    * { box-sizing: border-box; }
    html, body { width: 100%; margin: 0; background: ${theme.base.bg}; }
    body { -webkit-font-smoothing: antialiased; }
    pre.a {
      width: 100%;
      margin: 0;
      padding: 40px;
      overflow: hidden;
      border: 0;
      font: 16px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      tab-size: 2;
    }
  </style>
</head>
<body>
  ${theme.html}
</body>
</html>`;
}

async function renderManifest(manifestPath, temporaryDirectory) {
  const environmentRoot = join(temporaryDirectory, "xdg");
  const environment = {
    ...process.env,
    XDG_CONFIG_HOME: join(environmentRoot, "config"),
    XDG_DATA_HOME: join(environmentRoot, "data"),
    XDG_STATE_HOME: join(environmentRoot, "state"),
    XDG_CACHE_HOME: join(environmentRoot, "cache"),
    NVIM_APPNAME: "argiope-palette-screenshots",
    ARGIOPE_DEPS: deps,
    ARGIOPE_PALETTES_ROOT: root,
    ARGIOPE_PLUGIN_ROOT: pluginRoot,
    ARGIOPE_SCREENSHOT_MANIFEST: manifestPath,
  };
  await Promise.all([
    mkdir(environment.XDG_CONFIG_HOME, { recursive: true }),
    mkdir(environment.XDG_DATA_HOME, { recursive: true }),
    mkdir(environment.XDG_STATE_HOME, { recursive: true }),
    mkdir(environment.XDG_CACHE_HOME, { recursive: true }),
  ]);
  const luaScript = resolve(root, "scripts", "render-theme-screenshots.lua");
  const result = await $`${resolveNvim()} --headless --noplugin -n -i NONE -u NONE -c ${`luafile ${luaScript}`} -c "qa!"`
    .cwd(root)
    .env(environment)
    .nothrow();
  if (result.exitCode !== 0) {
    throw new Error(`argiope-palettes: Neovim renderer exited with status ${result.exitCode}`);
  }
  return JSON.parse(await readFile(manifestPath, "utf8"));
}

async function removeStaleScreenshots(expected) {
  for (const entry of await readdir(outputDirectory, { withFileTypes: true })) {
    if (entry.isFile() && /^argiope-[a-z0-9-]+\.png$/.test(entry.name) && !expected.has(entry.name)) {
      await rm(join(outputDirectory, entry.name));
    }
  }
}

async function main() {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "argiope-palette-screenshots-"));
  try {
    await mkdir(outputDirectory, { recursive: true });
    const themes = await renderManifest(join(temporaryDirectory, "themes.json"), temporaryDirectory);
    const expected = new Set(themes.map((theme) => `argiope-${theme.id}.png`));
    await removeStaleScreenshots(expected);

    const configuredBackend = process.env.ARGIOPE_WEBVIEW_BACKEND?.trim();
    for (const theme of themes) {
      await using view = new Bun.WebView({
        width,
        height: initialHeight,
        ...(configuredBackend ? { backend: configuredBackend } : {}),
      });
      const pagePath = join(temporaryDirectory, `${theme.id}.html`);
      await Bun.write(pagePath, pageFor(theme));
      await view.navigate(pathToFileURL(pagePath).href);
      await view.evaluate("document.fonts.ready.then(() => new Promise(requestAnimationFrame))");
      const contentHeight = await view.evaluate("Math.ceil(document.documentElement.scrollHeight)");
      await view.resize(width, contentHeight);
      await view.evaluate("new Promise(requestAnimationFrame)");
      const geometry = await view.evaluate(`({
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        viewportWidth: innerWidth,
        viewportHeight: innerHeight,
      })`);
      if (geometry.scrollWidth > geometry.viewportWidth || geometry.scrollHeight > geometry.viewportHeight) {
        throw new Error(`argiope-palettes: ${theme.id} content overflows the ${width}x${contentHeight} viewport`);
      }
      const destination = join(outputDirectory, `argiope-${theme.id}.png`);
      await Bun.write(destination, await view.screenshot({ format: "png" }));
      console.log(`argiope-palettes: rendered ${basename(destination)}`);
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
