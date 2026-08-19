import { neovimBuiltinsLua } from "../src/adapters/neovim.js";
import { DEFAULT_THEMES } from "../src/defaults.js";

const output = new URL("../dist/argiope-themes.lua", import.meta.url);
await Bun.write(output, `${neovimBuiltinsLua(DEFAULT_THEMES)}\n`);
console.log(`Wrote ${output.pathname}`);
