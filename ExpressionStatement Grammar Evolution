# ExpressionStatement grammar evolution

1. Everything starts from the Literal. Literal is the simplest type of the expression, or expression statement.

```
ExpressionStatement => Literal;
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

2. Let's add the `AdditiveExpression`. The parsers starts matching the tokens from the code with the grammar, moving from the top to the bottom. Literal is the
part of the `AdditiveExpression`, so, the logical conclusion is that parser should find at first the `AdditiveExpression` and if it doesn't it find it there,
it should try to find at least the literal.

According to this the `AdditiveExpression` production rule should be placed above the production rule for the literal.

```
ExpressionStatement => AdditiveExpression;
AdditiveExpression  => Literal ((+ | -) Literal)*;
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```
