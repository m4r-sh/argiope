; inherits: wgsl
(identifier) @variable.argiope.wgsl.variable
(type_declaration _) @type.argiope.wgsl.type
(function_declaration (identifier) @function.argiope.wgsl.function)
[(int_literal) (float_literal)] @constant.numeric.argiope.wgsl.number
(comment) @comment.argiope.wgsl.comment
