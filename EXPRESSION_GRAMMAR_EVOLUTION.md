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

3. The next expression we'll add is the MultiplicativeExpression. This expression includes * | / operators despite the fact it's called "multiplication", because actually to devide by 5 is to multiply by 1/5.

```
ExpressionStatement      => MultiplicativeExpression;
MultiplicativeExpression => AdditiveExpression ((* | /) AdditiveExpression)*;
AdditiveExpression       => Literal ((+ | -) Literal)*;
Literal                  => NumericLiteral | StringLiteral;
NumericLiteral           => NUMBER;
StringLiteral            => STRING;
```

The multiply operator has the higher precedence than the additive operator. It means that in the grammar the production rule for the MultiplicationExpression should come before the AdditiveExpression, because the parser should be able to find the multiplication expression at first. The grammar for the MultiplicationExpression production is similar to the grammar for the AdditiveExpression. Operand and operators are different, but the structure of the grammar is the same.
