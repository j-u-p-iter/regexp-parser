# MEMBER EXPRESSION

The expressions like:

```
x.y

// or

x[y]
```

are called as MemberExpressions.

MemberExpressions can be part of another expressions. For example, they can be a part of the AssignmentExpression:


```
x.y = 1;

// or

x[y] = 1;
```

MemberExpressions AST nodes consist of several properties:

- `object`, which contains the part before the `dot` or `opening square bracket`.
- `computed`, which tells us is the property we're trying to read from on object computed or non-computed. We say, that properties we're reading using the `dot` syntax are non-computed properties (`computed: false`). And, vice-versa we're saying the properties we are reading using the `brackets` syntax are computed properties, since you can put inside the brackets any expression or function call.
- `property`, which contains the node for the property, the node followed by the dot, or the node, located inside the square brackets.
