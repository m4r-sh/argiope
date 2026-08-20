# Editor integration checkouts

This directory holds optional Git submodules for independently developed
Argiope editor integrations. The submodules make it convenient to regenerate
palette artifacts and run cross-repository checks, but each integration keeps
its own source ownership, issues, pull requests, releases, and CI.

The root project writes only explicitly generated files into these checkouts.
For Neovim, that file is:

```text
editors/neovim/lua/argiope/generated/themes.lua
```

Runtime code, Tree-sitter queries, capture mappings, indentation, motions,
comments, documentation, and tests belong to the editor repository and should
be changed there.
