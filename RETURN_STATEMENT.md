# RETURN STATEMENT

`ReturnStatement` is one more kind of statements. We know already a lot of statements. It's just one more. However this statement has some significant difference from other statements. We can use this statement only in functions and nowhere else.

The grammar for the `ReturnStatement` looks this way:

```
ReturnStatement => "return" Expression? `;`;
```

The `ReturnStatement` is recognised in the code by the presence of the `return` word. After the `return` word there can be an `Expression`, but it's optional.

The code for the `ReturnStatement` looks like this:

```
ReturnStatement() {
  this._eat('RETURN');

  const argument = !this._check(';') ? this.Expression() : null;  

  this._eat(';');

  return {
    type: "ReturnStatement",
    argument,
  };  
}
```

