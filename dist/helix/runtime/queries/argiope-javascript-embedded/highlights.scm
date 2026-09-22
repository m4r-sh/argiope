; inherits: javascript
(identifier) @variable.argiope.embedded.variable
[(property_identifier) (shorthand_property_identifier) (shorthand_property_identifier_pattern)] @variable.other.member.argiope.embedded.property
[(string) (template_string) (regex)] @string.argiope.embedded.string
(escape_sequence) @constant.character.escape.argiope.embedded.escape
(number) @constant.numeric.argiope.embedded.number
[(true) (false) (null) (undefined)] @constant.argiope.embedded.constant
(comment) @comment.argiope.embedded.comment
(function_declaration name: (identifier) @function.argiope.embedded.function)
(method_definition name: (property_identifier) @function.argiope.embedded.function)
(call_expression function: (identifier) @function.call.argiope.embedded.call)
(call_expression function: (member_expression property: (property_identifier) @function.call.argiope.embedded.call))
["const" "let" "var" "function" "class" "new" "async" "await" "import" "export" "from" "default" "extends" "static"] @keyword.argiope.embedded.keyword
["if" "else" "switch" "case" "for" "while" "do" "try" "catch" "finally" "throw" "break" "continue"] @keyword.control.argiope.embedded.control
["return" "yield"] @keyword.control.return.argiope.embedded.return
["=" "+" "-" "*" "/" "%" "==" "===" "!=" "!==" "<" ">" "<=" ">=" "!" "&&" "||" "??" "=>" "..." "++" "--"] @operator.argiope.embedded.operator
["(" ")" "[" "]" "{" "}"] @punctuation.bracket.argiope.embedded.bracket
[";" "," "."] @punctuation.argiope.embedded.punctuation
(template_substitution ["${" "}"] @punctuation.bracket.argiope.embedded.bracket)
