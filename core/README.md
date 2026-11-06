# @m4rsh/argiope-core

Pure JavaScript theme serializers for Neovim, Helix, TextMate and VS Code.
Inputs are resolved Argiope JSON exports from Argiope Studio:
`{ name, primaryLanguage, base, languages: { id: { colors, roles } } }`.
The package contains no built-in themes, reactive state, browser UI, ramp engine,
or Neovim runtime. Colors may be CSS colors; adapters emit editor-ready hex.

```js
import { neovimSetupLua, helixThemeToml, textmateAdapter } from '@m4rsh/argiope-core'
const lua = neovimSetupLua(theme, { id: 'custom' })
const toml = helixThemeToml(theme)
const textmate = textmateAdapter(theme)
```

Language assignments remain independent even when their palettes have identical
colors. TextMate follows its grammar's scope granularity; method calls cannot
always be distinguished from ordinary calls. SSR syntax parsing lives in the
optional `argiope.render` Lua module of `argiope.nvim`, separately from this package.

MIT licensed. See the Argiope repository for theme sources and release tooling.
