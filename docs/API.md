# Theme development and exports

Studio (`argiope.m4rsh`) owns editable presets, reactive Shapes, RYBitten and
CuspHanger ramps. This repository owns resolved release inputs and editor adapters.

- `themes/*.argiope.json`: the four current Studio defaults, exported as plain
  `{name, primaryLanguage, base, languages: {id: {colors, roles}}}` documents.
- `core/`: `@m4rsh/argiope-core`, pure JS serializers and TextMate grammars.
  No Shapes, browser, Neovim runtime, color-ramp engines, or built-in theme data.
- `dist/`: generated release artifacts, retained for inspection and integration sync.
- `editors/`: independently developed editor integrations (Git submodules).
- `scripts/`: generation, artifact verification, sync, and preview tooling.

To retune a theme, edit it in Studio and download **Argiope JSON**. Replace the
corresponding `themes/argiope-<id>.argiope.json`. Keep the editable Studio JSON
in Studio's presets when updating its defaults. For all current Studio defaults,
run `bun run export:builtins <argiope-repo>/themes` from Studio. The website only
downloads files; it does not write to repositories or invoke release builds.

```sh
bun run build
bun run sync:neovim
bun run sync:helix
bun run sync:textmate
bun run sync:vscode
bun run check:editors
```

Generators require only resolved JSON and core; they never import Studio.
Verification generates in a temporary copy and compares against the working
tree without changing it. Sync commands intentionally update plugin artifacts.
Commit and tag each changed editor repository and update its parent gitlink.

## Static syntax rendering

The optional, lazily loaded `argiope.render` Lua module belongs to the Neovim
plugin, not the JS core. It requires Neovim and installed Tree-sitter parsers.
Studio's Zilker sample transform calls this same public API at build time.

```lua
local render = require("argiope.render")
local source = vim.api.nvim_buf_get_lines(0, 0, -1, false)
local tokens = render.tokenize(source, { language = "javascript" })
local html = render.to_html(tokens)
local css = render.css({ variant = "aurantia" })
-- Or render.render(source, options) returns { html, css }.
```

`tokenize` returns `{source, language, family, segments}`. Segments cover the
source contiguously with zero-based, half-open UTF-8 byte `start`/`finish`,
`text`, palette `language`, semantic `role`, and `style` flags. `family` and
`classes` carry the renderer's HTML presentation metadata. Native fallback
languages use generic styles; a `palette` option selects an Argiope family.
The role order in `require('argiope.theme').roles` defines `t0`–`t20`; palette
families scope their CSS variables. Roles and HTML are independent of theme
colors. CSS resolves those roles through the same assignments as Neovim.

Neovim is the only parser pipeline: query priorities, normalized injections,
Markdown substitutions, escaping, and semantic classification are shared.
There is no Studio source rewriting or duplicated capture map. A separate
render package is unnecessary until another consumer needs a CLI wrapper.

`bun run preview:shiki` generates the TextMate comparison page;
`bun run screenshots:themes` refreshes Neovim reference images.

## Packaging a release

The release candidate uses plugin version 0.2.0 and core version 0.1.0.
Run `bun run check`, all editor tests, and the `verify:*` artifact checks before
committing integration repositories and updating the parent gitlinks.

Pack core and TextMate with `npm pack --ignore-scripts` in `core/` and
`editors/textmate/`; install both archives into an empty Node project and check
serializer exports and `createArgiopeHighlighter`. Use Node 20.10 or newer.
Package VS Code with `vsce package` from `editors/vscode/`. These operations
create local artifacts only. Publishing npm packages, pushing Git tags and
publishing the VSIX are separate release actions.

Studio is a separate Git project. Its README describes a clean install,
revision-pinned renderer setup, headless production build, and Cloudflare
release. Its vendored package snapshots let builds work before all sibling
library releases are published; updating core requires refreshing that archive.
