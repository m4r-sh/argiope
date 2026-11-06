// Concrete TypeScript scopes from Shiki 3.x’s bundled VS Code grammar.
// Interpolation uses source.ts; exact leaf scopes prevent a host expression
// palette from leaking into nested HTML/CSS strings or raw JavaScript.
export const INTERPOLATION_SCOPES = {
  "comment": [
    "comment.block.documentation.ts",
    "comment.block.ts",
    "comment.line.double-slash.ts",
    "comment.line.shebang.ts",
    "comment.line.triple-slash.directive.ts"
  ],
  "escape": [
    "constant.character.escape.ts"
  ],
  "constant": [
    "constant.language.boolean.false.ts",
    "constant.language.boolean.true.ts",
    "constant.language.import-export-all.ts",
    "constant.language.infinity.ts",
    "constant.language.nan.ts",
    "constant.language.null.ts",
    "constant.language.undefined.ts",
    "variable.other.constant.object.property.ts",
    "variable.other.constant.object.ts",
    "variable.other.constant.property.ts",
    "variable.other.constant.ts"
  ],
  "number": [
    "constant.numeric.binary.ts",
    "constant.numeric.decimal.ts",
    "constant.numeric.hex.ts",
    "constant.numeric.octal.ts"
  ],
  "function": [
    "entity.name.function.tagged-template.ts",
    "entity.name.function.ts"
  ],
  "type": [
    "entity.name.type.alias.ts",
    "entity.name.type.class.ts",
    "entity.name.type.enum.ts",
    "entity.name.type.interface.ts",
    "entity.name.type.module.ts",
    "entity.name.type.ts",
    "support.type.builtin.ts",
    "support.type.object.module.ts",
    "support.type.primitive.ts"
  ],
  "control": [
    "keyword.control.as.ts",
    "keyword.control.assert.ts",
    "keyword.control.conditional.ts",
    "keyword.control.default.ts",
    "keyword.control.export.ts",
    "keyword.control.flow.ts",
    "keyword.control.from.ts",
    "keyword.control.import.ts",
    "keyword.control.intrinsic.ts",
    "keyword.control.loop.ts",
    "keyword.control.new.ts",
    "keyword.control.require.ts",
    "keyword.control.satisfies.ts",
    "keyword.control.switch.ts",
    "keyword.control.trycatch.ts",
    "keyword.control.ts",
    "keyword.control.type.ts",
    "keyword.control.with.ts"
  ],
  "keyword": [
    "keyword.generator.asterisk.ts",
    "keyword.other.debugger.ts",
    "keyword.other.ts",
    "storage.modifier.async.ts",
    "storage.modifier.ts",
    "storage.type.class.ts",
    "storage.type.enum.ts",
    "storage.type.function.arrow.ts",
    "storage.type.function.ts",
    "storage.type.interface.ts",
    "storage.type.internaldeclaration.ts",
    "storage.type.namespace.ts",
    "storage.type.numeric.bigint.ts",
    "storage.type.property.ts",
    "storage.type.ts",
    "storage.type.type.ts"
  ],
  "operator": [
    "keyword.operator.arithmetic.ts",
    "keyword.operator.assignment.compound.bitwise.ts",
    "keyword.operator.assignment.compound.ts",
    "keyword.operator.assignment.ts",
    "keyword.operator.bitwise.shift.ts",
    "keyword.operator.bitwise.ts",
    "keyword.operator.comparison.ts",
    "keyword.operator.decrement.ts",
    "keyword.operator.definiteassignment.ts",
    "keyword.operator.expression.delete.ts",
    "keyword.operator.expression.extends.ts",
    "keyword.operator.expression.import.ts",
    "keyword.operator.expression.in.ts",
    "keyword.operator.expression.infer.ts",
    "keyword.operator.expression.instanceof.ts",
    "keyword.operator.expression.is.ts",
    "keyword.operator.expression.keyof.ts",
    "keyword.operator.expression.of.ts",
    "keyword.operator.expression.typeof.ts",
    "keyword.operator.expression.void.ts",
    "keyword.operator.increment.ts",
    "keyword.operator.logical.ts",
    "keyword.operator.new.ts",
    "keyword.operator.optional.ts",
    "keyword.operator.relational.ts",
    "keyword.operator.rest.ts",
    "keyword.operator.spread.ts",
    "keyword.operator.ternary.ts",
    "keyword.operator.type.annotation.ts",
    "keyword.operator.type.asserts.ts",
    "keyword.operator.type.modifier.ts",
    "keyword.operator.type.ts"
  ],
  "punctuation": [
    "punctuation.accessor.optional.ts",
    "punctuation.accessor.ts",
    "punctuation.decorator.internaldeclaration.ts",
    "punctuation.decorator.ts",
    "punctuation.destructuring.ts",
    "punctuation.separator.comma.ts",
    "punctuation.separator.key-value.ts",
    "punctuation.separator.label.ts",
    "punctuation.separator.parameter.ts",
    "punctuation.terminator.statement.ts",
    "punctuation.whitespace.comment.leading.ts"
  ],
  "bracket": [
    "punctuation.definition.binding-pattern.array.ts",
    "punctuation.definition.binding-pattern.object.ts",
    "punctuation.definition.block.ts",
    "punctuation.definition.comment.ts",
    "punctuation.definition.parameters.begin.ts",
    "punctuation.definition.parameters.end.ts",
    "punctuation.definition.section.case-statement.ts",
    "punctuation.definition.string.begin.ts",
    "punctuation.definition.string.end.ts",
    "punctuation.definition.string.template.begin.ts",
    "punctuation.definition.string.template.end.ts",
    "punctuation.definition.tag.directive.ts",
    "punctuation.definition.template-expression.begin.ts",
    "punctuation.definition.template-expression.end.ts",
    "punctuation.definition.typeparameters.begin.ts",
    "punctuation.definition.typeparameters.end.ts"
  ],
  "string": [
    "string.quoted.alias.ts",
    "string.quoted.double.ts",
    "string.quoted.single.ts",
    "string.regexp.ts",
    "string.template.ts"
  ],
  "variable": [
    "variable.language.arguments.ts",
    "variable.language.super.ts",
    "variable.language.this.ts",
    "variable.object.property.ts",
    "variable.other.enummember.ts",
    "variable.other.object.property.ts",
    "variable.other.object.ts",
    "variable.other.readwrite.alias.ts",
    "variable.other.readwrite.ts",
    "variable.parameter.ts"
  ],
  "property": [
    "variable.other.property.ts"
  ]
};
