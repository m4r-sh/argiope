import { neovimBuiltinsLua } from "../core/adapters/neovim.js";
import { DEFAULT_THEMES } from "../scripts/themes.js";

const output = new URL("../dist/argiope-themes.lua", import.meta.url);
await Bun.write(output, `${neovimBuiltinsLua(DEFAULT_THEMES)}\n`);
console.log(`Wrote ${output.pathname}`);
