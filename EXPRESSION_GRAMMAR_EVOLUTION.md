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
it should try to find at least the Literal.

According to this the `AdditiveExpression` production rule should be placed above the production rule for the literal.

```
ExpressionStatement => AdditiveExpression;
AdditiveExpression  => Literal ((+ | -) Literal)*;
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

If we parse simple mathematical expression like `2 + 2` we'll get the next AST tree:

```
{
  type: "Program",
  body: [{
    type: "ExpressionStatement",
    expression: {
      type: "BinaryExpression",
      operator: "+",
      left: {
        type: "NumericLiteral",
        value: 2
      },
      right: {
        type: "NumericLiteral",
        value: 2
      },
    },
  }],
}
```

Let's look at more complext AST tree for a little bit more complex Binary Expression `2 + 3 - 1` (it's still binary, despite the fact that there're three operands):

```
{
  type: "Program",
  body: [{
    type: "ExpressionStatement",
    expression: {
      type: "BinaryExpression",
      operator: "-",
      left: {
        type: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "NumericLiteral",
            value: 2
          },
          right: {
            type: "NumericLiteral",
            value: 3,
          },
        }
      },
      right: {
        type: "NumericLiteral",
        value: 1
      },
    },
  }],
}
```

Here we can see that the result binary expression (the root one) is the combinations of nested binary expressions. Why does the left operand contain the Binary Expression but not the right one? Because according to the associativity the plus operator should be executed before the minus operator. And, the deeper the node nesting level the earlier the operator executes.

3. The next expression we'll add is the MultiplicativeExpression. This expression includes * | / operators despite the fact it's called "multiplication", because actually to devide by 5 is to multiply by 1/5.

```
ExpressionStatement      => AdditiveExpression;
AdditiveExpression       => MultiplicativeExpression ((+ | -) MultiplicativeExpression)*;
MultiplicativeExpression => Literal ((* | /) Literal)*;
Literal                  => NumericLiteral | StringLiteral;
NumericLiteral           => NUMBER;
StringLiteral            => STRING;
```

The multiply operator has the higher precedence than the additive operator. It means that in the grammar the production rule for the MultiplicativeExpression should come after the AdditiveExpression. Parser goes matching from the top of the Grammar tree to the bottom. The later the production rule is in the grammar the deeper it will be in the result AST tree, the earlier it will be executed. So, the rule of thumb - if you want the production is executed and evaluated earlier - then it should be located deeper in the grammar and result in the AST tree.


The tree for the expression `4 + 3 * 2` looks like:

```
{
  type: "Program",
  body: [{
    type: "ExpressionStatement",
    expression: {
      type: "BinaryExpression",
      operator: "+",
      left: {
        type: "NumericLiteral",
        value: 4,
      },
      right: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "NumericLiteral",
          value: 3
        },
        right: {
          type: "NumericLiteral",
          value: 2,
        }
      }
    }
  }]
}
```

Here the right operand of the root binary expression contains multiplicative binary expression and the left operand contains literal value. It's like that, cause the precedence of the multiplicative operator is higher than the additive operator. The deeper nested the expression, the higher execution priority it has.

4. The next binary expression we'll introduce is the ComparisonExpression. This is the type of the expression that connects operands with one of the operators: ">" | ">=" | "<" | "<=". 
The precedence of such type of operators is lower than the precedence of additive operators. It means, that in the AST tree such type of BinaryExpression nodes should appear above the additive BinaryExpression(s).

According to this the formal grammar should look this way:

```
ExpressionStatement      => ComparisonExpression;
ComparisonExpression     => AdditiveExpression (COMPARISON_OPERATOR AdditiveExpression)*;
AdditiveExpression       => MultiplicativeExpression (ADDITIVE_OPERATOR MultiplicativeExpression)*;
MultiplicativeExpression => Literal (MULTIPLICATIVE_OPERATOR Literal)*;
Literal                  => NumericLiteral | StringLiteral;
NumericLiteral           => NUMBER;
StringLiteral            => STRING;

COMPARISON_OPERATOR      => ">" | ">=" | "<" | "<=";
ADDITIVE_OPERATOR        => "+" | "-";
MULTIPLICATIVE_OPERATOR  => "*" | "/";
```

5. The next and the final binary expression we'll introduce is such called EqualityExpression. This is the type of the expression that connects operands with one of the operators: "!=" or "==".
The precedence of such type of operators is lower than the precedence of the comparison operators. It means, that in the AST tree such type of BinaryExpression nodes should appear above the comarison BinaryExpression(s).

According to this the result formal grammar should look like this:

```
ExpressionStatement      => EqualityExpression;
EqualityExpression.      => ComparisonExpression (EQUALITY_OPERATOR ComparisonExpression)*;
ComparisonExpression     => AdditiveExpression (COMPARISON_OPERATOR AdditiveExpression)*;
AdditiveExpression       => MultiplicativeExpression (ADDITIVE_OPERATOR MultiplicativeExpression)*;
MultiplicativeExpression => Literal (MULTIPLICATIVE_OPERATOR Literal)*;
Literal                  => NumericLiteral | StringLiteral;
NumericLiteral           => NUMBER;
StringLiteral            => STRING;

COMPARISON_OPERATOR      => ">" | ">=" | "<" | "<=";
ADDITIVE_OPERATOR        => "+" | "-";
MULTIPLICATIVE_OPERATOR  => "*" | "/";
```

6. Here we'll introduce one more kind of expression (alongside the binary expression) which is called the unary expression. Examples of unary expressions are:

```
-1; 

!2;
```

The precedence of the unary expression is higher than the precedence of any binary expression and lower than the precedence of the Primary expression (which is literal and will be shown later). As result the grammar for the result tree will look like:

```
ExpressionStatement      => EqualityExpression;
EqualityExpression.      => ComparisonExpression (EQUALITY_OPERATOR ComparisonExpression)*;
ComparisonExpression     => AdditiveExpression (COMPARISON_OPERATOR AdditiveExpression)*;
AdditiveExpression       => MultiplicativeExpression (ADDITIVE_OPERATOR MultiplicativeExpression)*;
MultiplicativeExpression => Literal (MULTIPLICATIVE_OPERATOR Literal)*;
UnaryExpression          => Literal | ((! | -) UnaryExpression)*;
Literal                  => NumericLiteral | StringLiteral;
NumericLiteral           => NUMBER;
StringLiteral            => STRING;

COMPARISON_OPERATOR      => ">" | ">=" | "<" | "<=";
ADDITIVE_OPERATOR        => "+" | "-";
MULTIPLICATIVE_OPERATOR  => "*" | "/";
```

Here we can see that the UnaryExpression deriviates to either Literal, if there's not "!" or "-" operators or to itself. The construction `((! | -) UnaryExpression)*` means, that the UnaryExpression can deriviate eventually to `!!2`, `!-1`, `--!2` and etc., which is also unusual looking but still valid unary expression.
