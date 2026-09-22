; inherits: javascript
(identifier) @variable.argiope.javascript.variable
[(property_identifier) (shorthand_property_identifier) (shorthand_property_identifier_pattern)] @variable.other.member.argiope.javascript.property
[(string) (template_string) (regex)] @string.argiope.javascript.string
(escape_sequence) @constant.character.escape.argiope.javascript.escape
(number) @constant.numeric.argiope.javascript.number
[(true) (false) (null) (undefined)] @constant.argiope.javascript.constant
(comment) @comment.argiope.javascript.comment
(function_declaration name: (identifier) @function.argiope.javascript.function)
(method_definition name: (property_identifier) @function.argiope.javascript.function)
(call_expression function: (identifier) @function.call.argiope.javascript.call)
(call_expression function: (member_expression property: (property_identifier) @function.call.argiope.javascript.call))
["const" "let" "var" "function" "class" "new" "async" "await" "import" "export" "from" "default" "extends" "static"] @keyword.argiope.javascript.keyword
["if" "else" "switch" "case" "for" "while" "do" "try" "catch" "finally" "throw" "break" "continue"] @keyword.control.argiope.javascript.control
["return" "yield"] @keyword.control.return.argiope.javascript.return
["=" "+" "-" "*" "/" "%" "==" "===" "!=" "!==" "<" ">" "<=" ">=" "!" "&&" "||" "??" "=>" "..." "++" "--"] @operator.argiope.javascript.operator
["(" ")" "[" "]" "{" "}"] @punctuation.bracket.argiope.javascript.bracket
[";" "," "."] @punctuation.argiope.javascript.punctuation
(template_substitution ["${" "}"] @punctuation.bracket.argiope.javascript.bracket)
