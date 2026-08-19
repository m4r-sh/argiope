local root = assert(vim.env.ARGIOPE_PALETTES_ROOT, "ARGIOPE_PALETTES_ROOT is not set")
local plugin_root = assert(vim.env.ARGIOPE_PLUGIN_ROOT, "ARGIOPE_PLUGIN_ROOT is not set")
local output = assert(vim.env.ARGIOPE_SCREENSHOT_MANIFEST, "ARGIOPE_SCREENSHOT_MANIFEST is not set")
local deps = vim.env.ARGIOPE_DEPS or vim.fs.joinpath(plugin_root, ".deps")
local nvim_treesitter = vim.env.ARGIOPE_NVIM_TREESITTER
  or vim.fs.joinpath(deps, "nvim-treesitter")
local parser_runtime = vim.env.ARGIOPE_PARSER_RUNTIME
  or vim.fs.joinpath(deps, "runtime")
local parser_registry = vim.env.ARGIOPE_TS_REGISTRY

vim.opt.runtimepath:prepend(plugin_root)
vim.opt.runtimepath:append(parser_runtime)
if parser_registry and parser_registry ~= "" then
  vim.opt.runtimepath:append(parser_registry)
end
vim.opt.runtimepath:append(nvim_treesitter)
vim.opt.runtimepath:append(vim.fs.joinpath(nvim_treesitter, "runtime"))
vim.opt.runtimepath:append(vim.fs.joinpath(plugin_root, "after"))

vim.cmd("filetype plugin indent on")
dofile(vim.fs.joinpath(nvim_treesitter, "plugin", "query_predicates.lua"))

package.preload["argiope.generated.themes"] = function()
  return dofile(vim.fs.joinpath(root, "dist", "argiope-themes.lua"))
end
require("argiope").setup()

local source_path = vim.fs.joinpath(root, "examples", "theme-screenshot.js")
local source = table.concat(vim.fn.readfile(source_path), "\n")
local palette = require("argiope.palette")
local renderer = require("argiope.render")
local screenshots = {}

for _, variant in ipairs(palette.variants()) do
  local profile = assert(palette.profile(variant))
  table.insert(screenshots, {
    id = variant,
    name = profile.name,
    base = {
      bg = profile.base.bg,
      fg = profile.base.fg,
    },
    html = renderer.html(source, { variant = variant }),
    css = renderer.css({ variant = variant }),
  })
end

vim.fn.writefile({ vim.json.encode(screenshots) }, output)
