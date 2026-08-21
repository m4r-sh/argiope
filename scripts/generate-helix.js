import { helixThemeFiles } from "../src/adapters/helix.js";
import { DEFAULT_THEMES } from "../src/defaults.js";

const root = new URL("../dist/helix/", import.meta.url);

const queryFiles = {
  "argiope-javascript/highlights.scm": "; inherits: javascript\n",
  "argiope-javascript/injections.scm": `${[
  ["html", "argiope-html"],
  ["svg", "argiope-svg"],
  ["css", "argiope-css"],
  ["md", "argiope-markdown"],
  ["glsl", "argiope-glsl"],
  ["wgsl", "argiope-wgsl"],
].map(([tag, language]) => `(call_expression
  function: (identifier) @_argiope_tag
  arguments: (template_string) @injection.content
  (#eq? @_argiope_tag "${tag}")
  (#set! injection.language "${language}"))`).join("\n\n")}

(call_expression
  function: (member_expression
    object: (identifier) @_argiope_raw
    property: (property_identifier) @_argiope_member)
  arguments: (template_string) @injection.content
  (#eq? @_argiope_raw "raw")
  (#eq? @_argiope_member "js")
  (#set! injection.language "argiope-javascript-embedded"))
`,
  "argiope-javascript/indents.scm": "; inherits: javascript\n",
  "argiope-javascript-embedded/highlights.scm": `; inherits: javascript
(identifier) @argiope.embedded.variable
(property_identifier) @argiope.embedded.property
(string_fragment) @argiope.embedded.string
(number) @argiope.embedded.number
(comment) @argiope.embedded.comment
`,
  "argiope-javascript-embedded/indents.scm": "; inherits: javascript\n",
  "argiope-html/highlights.scm": `; inherits: html
(tag_name) @argiope.html.tag
(attribute_name) @argiope.html.property
[(attribute_value) (quoted_attribute_value)] @argiope.html.string
(comment) @argiope.html.comment
["<" ">" "</" "/>" "<!"] @argiope.html.bracket
"=" @argiope.html.punctuation
`,
  "argiope-svg/highlights.scm": `; inherits: html
(tag_name) @argiope.svg.tag
(attribute_name) @argiope.svg.property
[(attribute_value) (quoted_attribute_value)] @argiope.svg.string
(comment) @argiope.svg.comment
["<" ">" "</" "/>" "<!"] @argiope.svg.bracket
"=" @argiope.svg.punctuation
`,
  "argiope-css/highlights.scm": `; inherits: css
[(tag_name) (nesting_selector) (universal_selector)] @argiope.css.tag
(property_name) @argiope.css.property
[(string_value) (color_value)] @argiope.css.string
[(plain_value) (integer_value) (float_value)] @argiope.css.constant
(function_name) @argiope.css.function
[(at_keyword) "@media" "@supports" "@keyframes"] @argiope.css.keyword
(comment) @argiope.css.comment
["(" ")" "[" "]" "{" "}"] @argiope.css.bracket
["," ";" ":" "::"] @argiope.css.punctuation
`,
  "argiope-markdown/highlights.scm": `; inherits: markdown
(atx_heading) @argiope.markdown.heading
(list_marker_minus) @argiope.markdown.list
(list_marker_plus) @argiope.markdown.list
(list_marker_star) @argiope.markdown.list
[(link_destination) (link_label)] @argiope.markdown.link
`,
  "argiope-glsl/highlights.scm": `; inherits: glsl
(identifier) @argiope.glsl.variable
(type_identifier) @argiope.glsl.type
(function_declarator (identifier) @argiope.glsl.function)
(number_literal) @argiope.glsl.number
(comment) @argiope.glsl.comment
`,
  "argiope-wgsl/highlights.scm": `; inherits: wgsl
(identifier) @argiope.wgsl.variable
(type_declaration _) @argiope.wgsl.type
(function_declaration (identifier) @argiope.wgsl.function)
[(int_literal) (float_literal)] @argiope.wgsl.number
(comment) @argiope.wgsl.comment
`,
};

for (const language of ["argiope-html", "argiope-svg", "argiope-css", "argiope-markdown", "argiope-glsl", "argiope-wgsl"]) {
  queryFiles[`${language}/indents.scm`] = `; inherits: ${language.replace("argiope-", language === "argiope-svg" ? "html" : "")}\n`;
}

const languagesToml = `# Merge this fragment into ~/.config/helix/languages.toml or .helix/languages.toml.
# It intentionally declares no language servers: Argiope only changes parsing.

[[language]]
name = "argiope-javascript"
scope = "source.js"
injection-regex = "^argiope-javascript$"
file-types = ["js", "mjs", "cjs"]
comment-tokens = "//"
grammar = "javascript"

[[language]]
name = "argiope-javascript-embedded"
scope = "source.js"
injection-regex = "^argiope-javascript-embedded$"
file-types = []
comment-tokens = "//"
grammar = "javascript"

[[language]]
name = "argiope-html"
scope = "text.html.basic"
injection-regex = "^argiope-html$"
file-types = []
grammar = "html"

[[language]]
name = "argiope-svg"
scope = "text.html.basic"
injection-regex = "^argiope-svg$"
file-types = []
grammar = "html"

[[language]]
name = "argiope-css"
scope = "source.css"
injection-regex = "^argiope-css$"
file-types = []
grammar = "css"

[[language]]
name = "argiope-markdown"
scope = "text.markdown"
injection-regex = "^argiope-markdown$"
file-types = []
grammar = "markdown"

[[language]]
name = "argiope-glsl"
scope = "source.glsl"
injection-regex = "^argiope-glsl$"
file-types = []
grammar = "glsl"

[[language]]
name = "argiope-wgsl"
scope = "source.wgsl"
injection-regex = "^argiope-wgsl$"
file-types = []
grammar = "wgsl"
`;

for (const [name, body] of Object.entries(helixThemeFiles(DEFAULT_THEMES))) {
  await Bun.write(new URL(`themes/${name}`, root), body);
}
for (const [name, body] of Object.entries(queryFiles)) {
  await Bun.write(new URL(`runtime/queries/${name}`, root), body);
}
await Bun.write(new URL("languages.toml", root), languagesToml);
console.log(`Wrote ${root.pathname}`);
