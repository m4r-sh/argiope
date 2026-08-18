# Argiope Palettes

A small palette laboratory extracted from `argiope.nvim`. It models Aurantia,
Versicolor, their Neon variants, Ocyaloides, and Trifasciata with shared color
state and separate syntax adapters.

The portable model is a nested orbz graph. A `PaletteTheme` owns `BaseColors`
and a `Dict` of `LanguagePalette` Shapes; every language palette owns its own
`PaletteGenerator`. The Dict can contain any included or embedded language—the
frontend discovers its controls and swatches dynamically. Getters use
Argiope's `cusphanger` + `nutelch` OKLCH pipeline to derive twelve-shade ramps,
semantic tokens, CSS custom properties, and Neovim highlight data.

```sh
bun install
bun run dev
```

`server.ts` uses [Bun's HTML-import route support](https://bun.sh/docs/bundler/fullstack#html-routes). The page is static HTML with a
single browser script, and the syntax specimen is pre-rendered. Theme changes
only update custom properties on `:root`.

The modules are split by responsibility:

- `src/color-math.js` contains color conversion and ramp math.
- `src/shapes/` contains one Shape definition per file.
- `src/defaults.js` contains built-in Shape instantiations and JSON hydration.
- `src/adapters/` contains target-specific exports such as Neovim.
- `app.js` is only the browser UI adapter.

Future adapters can consume the same nested model for CodeMirror, Shiki,
VS Code, Helix, or Zed.
