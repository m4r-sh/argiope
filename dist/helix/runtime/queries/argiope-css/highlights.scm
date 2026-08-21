; inherits: css
[(tag_name) (nesting_selector) (universal_selector)] @argiope.css.tag
(property_name) @argiope.css.property
[(string_value) (color_value)] @argiope.css.string
[(plain_value) (integer_value) (float_value)] @argiope.css.constant
(function_name) @argiope.css.function
[(at_keyword) "@media" "@supports" "@keyframes"] @argiope.css.keyword
(comment) @argiope.css.comment
["(" ")" "[" "]" "{" "}"] @argiope.css.bracket
["," ";" ":" "::"] @argiope.css.punctuation
