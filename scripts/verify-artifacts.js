import { createHash } from "node:crypto";
import { readdir, readFile, stat, mkdtemp, cp, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, basename } from "node:path";

const root = resolve(import.meta.dir, "..");
const targets = {
  generated: { paths: ["dist/argiope-themes.lua", "dist/helix", "dist/textmate"], scripts: ["generate-neovim", "generate-helix", "generate-textmate"] },
  neovim: { paths: ["editors/neovim/lua/argiope/generated/themes.lua"], scripts: ["generate-neovim", "sync-neovim"] },
  helix: { paths: ["editors/helix/themes", "editors/helix/runtime/queries", "editors/helix/languages.toml", "editors/helix/palette-options.json"], scripts: ["generate-helix", "sync-helix"] },
  textmate: { paths: ["editors/textmate/themes", "editors/textmate/syntaxes", "editors/textmate/src/palettes.json", "editors/textmate/src/textmate-options.cjs"], scripts: ["generate-textmate", "sync-textmate"] },
  vscode: { paths: ["editors/vscode/themes", "editors/vscode/syntaxes", "editors/vscode/package.json", "editors/vscode/palettes.json", "editors/vscode/textmate-options.cjs"], scripts: ["generate-textmate", "sync-vscode"] },
  "shiki-preview": { paths: ["docs/shiki-preview.html"], scripts: ["generate-textmate", "render-shiki-preview"] },
};
const target = targets[Bun.argv[2]];
if (!target) throw new Error(`Choose an artifact target: ${Object.keys(targets).join(", ")}`);

async function snapshot(paths, directory = root) {
  const result = {};
  async function visit(path) {
    const absolute = resolve(directory, path);
    const info = await stat(absolute).catch(error => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (!info) return;
    if (info.isDirectory()) {
      for (const name of (await readdir(absolute)).sort()) await visit(`${path}/${name}`);
    } else {
      result[path] = createHash("sha256").update(await readFile(absolute)).digest("hex");
    }
  }
  for (const path of paths) await visit(path);
  return result;
}

// Verify in an isolated copy: stale outputs never overwrite working files.
const before = await snapshot(target.paths);
const temporary = await mkdtemp(resolve(tmpdir(), 'argiope-verify-'));
try {
  for (const name of ['scripts', 'core', 'themes', 'dist', 'editors', 'docs', 'examples', 'package.json']) {
    await cp(resolve(root, name), resolve(temporary, name), { recursive: true,
      filter: path => !['.git', '.deps', 'node_modules'].includes(basename(path)) });
  }
  await symlink(resolve(root, 'node_modules'), resolve(temporary, 'node_modules'), 'dir');
  for (const script of target.scripts) {
    const process = Bun.spawn(['bun', `scripts/${script}.js`], { cwd: temporary, stdout: 'inherit', stderr: 'inherit' });
    if (await process.exited !== 0) throw new Error(`Failed to run ${script}`);
  }
  const after = await snapshot(target.paths, temporary);
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(path => before[path] !== after[path]);
  if (changed.length) throw new Error(`Stale artifacts (working files unchanged):\n${changed.join('\n')}`);
  console.log(`Verified ${Bun.argv[2]} artifacts`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
