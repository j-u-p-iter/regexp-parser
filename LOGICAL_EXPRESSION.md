# Logical Expression

Logical Expressions are very similar to the Binary Expressions. They also consist of one operators and two operands connected by this operator. According to this they have absolutely the same code to be parsed as Binary Expressions. But still we prefer to create separate AST subtree for such type of expressions with it's own type. It's because logical operators don't behave like others - they *short-circuit*. It means that if, after evaluating the left operand, we know what the result of the logical expression must be, we don’t evaluate the right operand. So, because the evaluation step of the Logical Expressions is different - we put them into a separate group.

