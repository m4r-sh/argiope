; inherits: javascript

; Give multiline tagged templates one level relative to their JavaScript host.
; The final delimiter is outdented so a closing backtick returns to the host
; indentation without altering the line containing the opening delimiter.
(template_string) @indent
(template_string
  (_)*
  "`" @outdent
  .)
