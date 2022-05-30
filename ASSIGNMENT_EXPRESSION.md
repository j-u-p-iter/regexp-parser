It's important to distinguish two different lines:

```
let a = 2 + 3;

a = 2 + 3;
```

The first line is the variable declaration statement we'll take a look at it further. The second line represents the assignment expression. Despite the fact, that these notations look very similar, they are actually represented as absolutely different AST node in the result tree. The first line is the VariableDeclarationStatement node (we'll talk about it later) and the second like is the AssignmentExpression.

The topic of this documentation is to look at the assignment expression:

```
a = 2 + 3;
```

This expression consists of:

- left side, which is represented by an IDENTIFIER. This is the only allowed part of the left part for now.
- right side, which is represented by the ADDITIVE_EXPRESSION;
- assignment operator "=".

Assignment operation evaluates after any operation on the right hand side of the assignment operator. It means that the precedence of the AssignmentExpression is even lower than the precedence of the EqualityExpression. So, the assignment expression is the lowest by precendence among of all expressions.

According to this the grammar for the AssignmentExpression looks like this:

```
/** 
 * If we have ASSIGNMENT_OPERATOR:
 * - we expect the IDENTIFIER (variable) in front of the ASSIGNMENT_OPERATOR
 * - the expression after the ASSIGNMENT_OPERATOR 
 *
 * If there is not ASSIGNMENT_OPERATOR we expect to have one of the further 
 *   expressions, starting from the EqualityExpression
 *
 */
 
AssignmentExpression => IDENTIFIER AssignmentOperator AssignmentExpression | EqualityExpression;
AssignmentOperator   => SIMPLE_ASSIGNMENT_OPERATOR | COMPLEX_ASSIGNMENT_OPERATOR;
```

The interesting thing here is that the grammar for the AssignmentExpression is right-recursive, cause the recursive refference to AssignmentExpression nonterminal is located at the right hand side of the production rule.

Such type of right-recursive grammars is not a problem for the descent parser implementation compared to the left-recursive grammars we've seen previously. It's not a problem, cause we always can add some condition before the AssignmentExpression call not to call AssignmentExpression infinite amount of times.

For example, for the grammar provided above we'll have a condition before the AssignmentExpression call, that will check if the "=" operator exists. If this operator exists - we expect to have an AssignmentExpression on the right hand side from the operator. Otherwice we just skip the rucursive call of the AssignmentExpression and it will never be called again. This is how we can prevent infinite recursive call.

We need to make recursive call, cause the assignment operations can be chained like:

```
x = y = 42;
```

For the left-recursive grammar, like for the provided below, it doesn't work, cause the recursive call is on the firts position and there's no way to call the P method by some condition. As result, it will result into the infinite loop.

```
P => P "+" N | F;
```

This is why in the code for the left-recursive grammar we use while loop to iterate through all operators instead of recursive calls.

```
AssignmentExpression() {
  const expression = this.EqualityExpression();

  const assignmentOperator = this._match('ASSIGNMENT_OPERATOR');

  if (assignmentOperator) {
    const assignmentOperatorValue = assignmentOperator.value;

    if (this._isIdentifier(expression)) {
      return {
        type: "AssignmentExpression",
        operator: assignmentOperatorValue,
        left: expression,
        right: this.AssignmentExpression(),
      };
    }

    throw new SyntaxError('Invalid left-hand side in the assignment expression. The identifier is expected.');
  }

  return expression;
}
```

According to the grammar the first thing we need to do here is to call EqualityExpression method, which will generate the AST branch. After that, we try to find the assignmentOperator. If there's an assignment operator, it means we have a deal with the AssignmentExpression. But we are not ready to return the AssignmentExpression node yet. At first we need to be sure, that in case we have an assignment operator after the left operand (result of the EqualityExpression call), the left operand is an identifier. If the left operand is really identifier, we return and AssignmentExpression node with left and right properties. The right property can also contain the AssignmentExpression, like in an expression `x = y = 5;`. This is why we call the AssignmentExpression recursively. If the left operand on the left hand side is not an identifier, like in case `5 = 5`, we throw an appropriate error.

If there's no an assignment operator, it means there's no AssignmentExpression and we return the EqualityExpression call result.

To access a variable, we define a new kind of primary expression. To be able to parse the identifiers, we update the grammar for the PrimaryExpression:

```
PrimaryExpression => "(" Expression ")" | IDENTIFIER | Literal;
```
That IDENTIFIER clause matches a single identifier token, which is understood to be the name of the variable being accessed.

The evolution of the identifiers has the same precedence as the evolution of the literals or any another standalone values.

The AST for the assignment expression `x = y = 5` will look like:

```
{
  type: "Program",
  body: [{
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      operator: "=",
      left: {
        type: "Identifier",
        name: "x",
      },  
      right: {
        type: "AssignmentExpression",
        operator: "=",
        left: {
          type: "Identifier",
          name: "y",
        },
        right: {
          type: "NumericLiteral",
          value: 5,
        }
      },  
    },  
  }]  
}
```

We can see that the associativity of the assignment operator is increasing from right to left compared to the associativity of appropriate operators of the additive or multiplicative expressions, for example, which have left associativity.
