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

First, we parse a `MemberExpression`, the “left operand” to the call. According to the Grammar the CallExpressions bubbles up to the MemberExpression if there're no parentheses after the MemberExpression. So, we check the presence of the "LEFT_PAREN" token. If there's no such a token CallExpression => MemberExpression, if there's such a token we check the presence of the ArgumentList to parse. We do it by checking the presence of the "RIGHT_PAREN" token. If it followed by the "LEFT_PAREN" token, it means there is no ArgumentList for the CallExpression and vice-versa. Each `CallExpression` can be a Callee according to the grammar. The precedence of the `()` operator is left-to-rigth. It means that the leftmost callee should be executed at the very beginning, the rightmost callee should be executed at the very end. This is why in the `while loop` the `CallExpression` parsed on the previous step is nested into the newly parsed `CallExpression`. During the interpretation phase the deepest `CallExpression` will be called at first. The most top `CallExpression` will be called as the last one.

Parsing `ArgumentList`, we look for a comma indicating that there is another argument after that. We keep doing that as long as we find commas after each expression. When we don’t find a comma, then the argument list must be done and we consume the expected closing parenthesis.

The AST for the CallExpression `callMethod(x, y)();` looks this way:

```
{
  type: "Program",
  body: [
    {   
      type: 'ExpressionStatement',
      expression: {
        type: "CallExpression",
        callee: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "callMethod",
          },  
          arguments: [{
            type: 'Identifier',
            name: 'x',
          }, {
            type: "Identifier",
            name: 'y',
          }], 
        },  
        arguments: [], 
      },  
    }   
  ]   
}
```
