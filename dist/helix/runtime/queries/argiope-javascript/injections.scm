(call_expression
  function: (identifier) @_argiope_tag
  arguments: (template_string) @injection.content
  (#eq? @_argiope_tag "html")
  (#set! injection.language "argiope-html"))

(call_expression
  function: (identifier) @_argiope_tag
  arguments: (template_string) @injection.content
  (#eq? @_argiope_tag "svg")
  (#set! injection.language "argiope-svg"))

(call_expression
  function: (identifier) @_argiope_tag
  arguments: (template_string) @injection.content
  (#eq? @_argiope_tag "css")
  (#set! injection.language "argiope-css"))

(call_expression
  function: (identifier) @_argiope_tag
  arguments: (template_string) @injection.content
  (#eq? @_argiope_tag "md")
  (#set! injection.language "argiope-markdown"))

(call_expression
  function: (identifier) @_argiope_tag
  arguments: (template_string) @injection.content
  (#eq? @_argiope_tag "glsl")
  (#set! injection.language "argiope-glsl"))

(call_expression
  function: (identifier) @_argiope_tag
  arguments: (template_string) @injection.content
  (#eq? @_argiope_tag "wgsl")
  (#set! injection.language "argiope-wgsl"))

(call_expression
  function: (member_expression
    object: (identifier) @_argiope_raw
    property: (property_identifier) @_argiope_member)
  arguments: (template_string) @injection.content
  (#eq? @_argiope_raw "raw")
  (#eq? @_argiope_member "js")
  (#set! injection.language "argiope-javascript-embedded"))
