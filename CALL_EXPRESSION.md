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

```
callMethod()();
```

There are two CallExpression(s) here. The first pair of parentheses has `callMethod` as its callee. But the second call has the entire `callMethod()` expression as its callee. It is the parentheses following an expression that indicate a function call. You can think of a call as sort of like a postfix operator that starts with `(`.

This “operator” has higher precedence than any other operator, even the unary ones. So we slot it into the grammar by having the unary rule bubble up to a new call rule:

```
UnaryExpression  => ('-' | '!') Unary | CallExpression;
MemberExpression => PrimaryExpression (("." Identifier) | "[" Expression "]")*;
CallExpression   => MemberExpression ("(" ArgumentList? ")")*;
ArgumentList     => Expression ("," Expression)*; 
```

This rule matches a primary expression followed by zero or more function calls. If there are no parentheses, this parses a bare primary expression. Otherwise, each call is recognized by a pair of parentheses with an optional list of arguments inside.

This rule for `ArgumentList` requires at least one Expression, followed by zero or more other Expression(s), each preceded by a comma. To handle zero-argument calls, the call rule itself considers the entire `ArgumentList` production to be optional.

I admit, this seems more grammatically awkward than you’d expect for the incredibly common “zero or more comma-separated things” pattern. There are some sophisticated metasyntaxes that handle this better, but in our BNF and in many language specs I’ve seen, it is this cumbersome.

The code for the CallExpression looks like this one:

```
CallExpression() {
  let callExpression = this.MemberExpression();

  if (!this._check('LEFT_PAREN')) { 
    return callExpression;
  }   

  while (this._match('LEFT_PAREN')) {
    const argumentList = this._check('RIGHT_PAREN') 
      ? []  
      : this.ArgumentList();

    callExpression = { 
      type: "CallExpression",
      callee: callExpression,
      arguments: argumentList,
    }   

    this._eat('RIGHT_PAREN');
  }   

  return callExpression;
}
```

At the same time the code for the `ArgumentList` looks this way:

```
ArgumentList() {
  let argumentList = []; 

  do {
    argumentList.push(this.Expression()) 
  } while(this._match('COMMA'));

  return argumentList;
}
```
