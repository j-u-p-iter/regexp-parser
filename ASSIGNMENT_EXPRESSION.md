It's important to distinguish two different lines:

```
let a = 2 + 3;

a = 2 + 3;
```

The first line is the variable declaration statement we'll take a look at it further. The second line represents the assignment expression. And yes, it's true, the variable declaration statement includes the assignment expression. Again, we'll take a look at this further.

The topic of this documentation is to look at the assignment expression:

```
a = 2 + 3;
```

This expression consists of:

- left side, which is represented by an IDENTIFIER. This is the only allowed part of the left part for now.
- right side, which is represented by the ADDITIVE_EXPRESSION;
- assignment operator "=".

Assignment operation evaluates after any operation on the right hand side of the assignment operator. It means that the precedence of the AssignmentExpression is even lower than the precedence of the ComparisonExpression. So, the assignment expression is the lowest by precendence among of all expressions.

According to this the grammar for the AssignmentExpression looks like this:

```
AssignmentExpression => IDENTIFIER "=" AssignmentExpression | ComparisonExpression;
```

The interesting thing here is that the grammar for the AssignmentExpression is right-recursive, cause the recursive refference to AssignmentExpression nonterminal is located at the right hand side of the production rule.

Such type of right-recursive grammars is not a problem for the descent parser implementation compared to the left-recursive grammars we've seen previously. It's not a problem, cause we always can add some condition before the AssignmentExpression call not to call AssignmentExpression infinite amount of times.

For example, for the grammar provided above we'll have a condition before the AssignmentExpression call, that will check if the "=" operator exists. If this operator exists - we expect to have an AssignmentExpression on the right hand side from the operator. Otherwice we just scip the rucursive call of the AssignmentExpression and it will never be called again. This is how we can prevent infinite recursive call.

For the left-recursive grammar, like for the provided below, it doesn't work, cause the recursive call is on the firts position and there's no way to call the P method by some condition. As result, it will result into the infinite loop.

```
P => P "+" N | F;
```
