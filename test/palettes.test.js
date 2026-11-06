import { describe, expect, test } from "bun:test";
import { DEFAULT_THEMES } from "../scripts/themes.js";
import { neovimBuiltinsLua, neovimSetupLua } from "../core/adapters/neovim.js";
describe("Neovim exports", () => {
  test("emits directly pasteable Lua with optional inheritance", () => {
    const lua = neovimSetupLua(DEFAULT_THEMES[0].theme, {
      id: "my-aurantia",
      extends: "aurantia",
    });
    expect(lua).toContain('require("argiope").setup({');
    expect(lua).toContain('["my-aurantia"] = {');
    expect(lua).toContain('extends = "aurantia"');
    expect(lua).toContain("javascript_embedded = {");
    expect(lua).toContain('["function"] =');
    expect(lua).toContain('["return"] =');
  });

  test("emits complete built-in definitions without extends", () => {
    const lua = neovimBuiltinsLua(DEFAULT_THEMES);
    expect(lua).toContain('aurantia = {');
    expect(lua).toContain("trifasciata = {");
    expect(lua).toContain("schema = 1");
    expect(lua).toContain("themes = {");
    expect(lua).not.toContain("extends =");
  });
});
