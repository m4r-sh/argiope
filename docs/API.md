## Repository layout

Argiope is the source of truth for shared palettes and the adapters that emit
environment-specific palette files. Each editor integration remains an
independently developed repository.

- `src/` contains the palette model, built-in themes, and adapters.
- `dist/` contains generated palette artifacts.
- `editors/` contains optional Git submodule checkouts of editor integrations.

Generate the standalone Neovim palette artifact with:

```sh
bun run build:neovim
```

Generate and sync the shared Helix runtime artifacts into its initialized
editor submodule with:

```sh
bun run sync:helix
```

The standalone [Helix integration](editors/helix) owns its installation guide,
fixtures, compatibility policy, and Helix-specific behavior.

After initializing the `editors/neovim` submodule, install that artifact into
the editor repository with:

```sh
bun run sync:neovim
```

The sync updates only
`editors/neovim/lua/argiope/generated/themes.lua`. Neovim runtime behavior,
queries, documentation, and tests remain owned by `argiope.nvim`, where editor
users can contribute normally.

Run Argiope's palette checks with `bun run check`. To also run the tests in
initialized editor submodules, use:

```sh
bun run check:editors
```

To compare the generated Shiki/TextMate result with the checked-in Neovim
reference renders, generate and open the local [comparison page](docs/shiki-preview.html):

```sh
bun run preview:shiki
```

To open a local VS Code Extension Development Host with the generated Argiope
grammar and themes, run:

```sh
bun run vscode:dev
```

---

