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

Assignment operation evaluates after any operation on the right hand side of the assignment operator. It means that the precedence of the AssignmentExpression is even lower than the precedence of the EqualityExpression. So, the assignment expression is the lowest by precendence among of all expressions.

According to this the grammar for the AssignmentExpression looks like this:

```
AssignmentExpression => IDENTIFIER "=" AssignmentExpression | EqualityExpression;
```
