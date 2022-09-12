# CALL EXPRESSION

The expression which contains function call is called `CallExpression`.

```
callMethod(a, b);
```

The function call consists of three main parts, which will be included into the `CallExpression` node:

- callee. This is the part which stands before the parentheses. This is the part which is called. This is why it's named as `callee`. The Grammar for the `callee`. The callee can be presented by `MemberExpression`, by `Identifier` or even by another `CallExpression`:

```
// Callee is presented by the MemberExpression
x.y();

// Callee is presented by an Identifier
x();

// Callee is presented by the CallExpression
callMethod()();
```

So, the callee can be any Expression that evaluates to a function.
