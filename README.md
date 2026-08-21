# Argiope

Argiope is a web-centric plugin for editing javascript files with embedded languages.

[Blog Post](https://m4rsh.com/argiope)

**Supported Editors**:
- [Neovim](https://github.com/m4r-sh/argiope.nvim)
- [Zed](https://github.com/m4r-sh/argiope-zed)
- [Helix](https://github.com/m4r-sh/argiope-helix)

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

Generate and sync the shared Zed theme and language artifacts into its
initialized editor submodule with:

```sh
bun run sync:zed
```

The standalone [Zed integration](editors/zed) owns its extension manifest,
grammar revisions, installation guide, and compatibility testing.

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

---

<figure>
<img width="300" src="https://m4rsh.com/images/argiope-aurantia-dithered.png" alt="Argiope Aurantia Spider">
<figcaption align="center">Image by Dave the Bug Guy</figcaption>
</figure>

---

## Highlighting

Argiope takes a unique approach of giving each language its own primary hue, making it easy to distinguish each language at a glance.

---

#### Aurantia

![Aurantia Syntax Theme](/docs/images/themes/argiope-aurantia.png)

---

#### Aurantia Neon

![Aurantia Neon Syntax Theme](/docs/images/themes/argiope-aurantia-neon.png)

---

#### Versicolor

![Versicolor Syntax Theme](/docs/images/themes/argiope-versicolor.png)

---

#### Versicolor Neon

![Versicolor Neon Syntax Theme](/docs/images/themes/argiope-versicolor-neon.png)

---

#### Ocyaloides

![Ocyaloides Syntax Theme](/docs/images/themes/argiope-ocyaloides.png)

---

#### Trifasciata

![Trifasciata Syntax Theme](/docs/images/themes/argiope-trifasciata.png)
