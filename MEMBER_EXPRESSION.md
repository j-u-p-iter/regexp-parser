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

The next very interesting question, where we should place the Grammar for the MemberExpressions. The thing is the `thing` before the dot is the object. We know that:

- `Literal` values can have properties;
- Identifiers that contains objects can have properties;
- Expressions that evaluates to any kind of object can have properties.

It means that the `thing` before the `dot` reminds us the `PrimaryExpression`:

The production rule for the PrimaryExpression looks like:

```
UnaryExpression => ('-' | '!') Unary | PrimaryExpression;

PrimaryExpression => "(" Expression ")" | Identifier | Literal;
```

It means that the precedance of the MemberExpressions is higher than the one of the UnaryExpression but lower than of the PrimaryExpression.

And it means, the grammar for the MemberExpression can be deriviated from the PrimaryExpression grammar next way:

```
UnaryExpression => ('-' | '!') Unary | MemberExpression;
MemberExpression => PrimaryExpression (("." Identifier) | "[" Expression "]")*;
```

Here we can see that the "dot" character can be followed only by Identifier and the "thing" inside of the square brackets can deriviate to any Expression (this is why this property is called computed, since it can be computed).
