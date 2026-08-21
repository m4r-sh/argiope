; inherits: html

; Helix does not bundle HTML indentation. Indent content under an opening tag
; and cancel that level on its matching closing tag.
(element
  (start_tag) @indent
  (end_tag) @outdent)
