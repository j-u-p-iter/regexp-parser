While the `x = 1` is an assignment expression, the `let x = 1` is a variable declation statement. The AST for these two types of notation is absolutely different.

Declaration differs from an assignment only by one keyword `let`.

Let's agree on the terms first of all:
- the `let` is the keyword;
- the x is an identifier name (variable name);
- 1 is the initializer.

There are different possible types of notations for the variable declaration statements:

- Without initializer: `let x;`;
- With initializer: `let x = 5`;
- With list of declarations instead of one declaration: `let x, y = 5`;
- With the initializer in form of an assignment: `let x = y = 5`.

```
Statement                    => EmptyStatement | BlockStatement | ExpressionStatement | VariableDeclarationStatement;
VariableDeclarationStatement => "let" VariableDeclarationsList ";";
VariableDeclarationsList     => VariableDeclaration | VariableDeclarationList "," VariableDeclaration;
VariableDeclaration          => IDENTIFIER SIMPLE_ASSIGNMENT_OPERATOR VariableInitializer | IDENTIFIER;
VariableInitializer          => Expression;
Expression                   => AssignmentExpression;
```

`VariableDeclarationsList` non-terminal takes into account the list of variables, splitted by comma. It allows us to write not only like `let x`, but also like `let x, y, z` and etc.

`VariableInitializer` non-terminal presents the part after the assignment operator, which can be any expression from an assignment expression like in case `let x = y = 5` to simple literal value `let x = 5;` or an identifier `let x = y`;

Let's look at the code for all the non-terminals, starting from the `VariableDeclarationStatement`:

```
VariableDeclarationStatement() {
  this._eat('let');

  const variableDeclarationsList = this.VariableDeclarationsList();

  this._eat(';');

  return {
    type: "VariableDeclarationStatement",
    declarations: variableDeclarationsList,
  };  
}
```

Let's describe step by step what's happening here:
1. We eat the "let" keyword, because we don't need to preserve it in the result AST tree.
2. After that we collect all the variable declarations in form of the variable declarations list.
3. After we eat the semicolumn, cause the semicolumn is the required symbol. So we expect to have it after the variable declarations, but at the same time we don't need this symbol in the result AST tree. So, we just skip this symbol.
4. At the very end we return the "VariableDeclarationStatement".

Let's switch to the `VariableDeclarationsList`.

```
VariableDeclarationsList() {
  const variableDeclarationsList = [this.VariableDeclaration()];
  
  while(this._match(',')) {
    variableDeclarationsList.push(this.VariableDeclaration());
  }   

  return variableDeclarationsList;
}
```

The grammar of the `VariableDeclarationsList` is right recursive, so we use the `while` loop here the same we used it for any another nodes previously.
It's worth to mention thata we expect at least one VariableDeclaration, and this is why the `variableDeclarationsList` array contains one `VariableDeclaration` instance initially.

Potentially there's more than just one `VariableDeclaration`. This is why create the while loop, checking the presence of the "," before the "VariableDeclaration". If there's "," symbol, than we expect to have "VariableDeclaration" after that. If there're no more "," symbols we return the result `variableDeclarationsList`.

And at least we come to the `VariableDeclaration` non-terminal.

```
VariableDeclaration() {
  const identifier = this.Identifier();

  let initializer = null;

  if (this._peek().type === 'SIMPLE_ASSIGNMENT_OPERATOR') {
    this._eat('SIMPLE_ASSIGNMENT_OPERATOR');

    initializer = this.Expression();
  }   

  return {
    type: "VariableDeclaration",
    id: identifier,
    init: initializer,
  };
}
```

If we enter the VariableDeclaration non-terminal, then the first token should be an `Identifier`. After we have an optional SIMPLE_ASSIGNMENT_OPERATOR. The rule is if there's an SIMPLE_ASSIGNMENT_OPERATOR, then we expect one more token, which is an "Expression". It can be absolutely any expression. If there's no an assignment operator, we go further.

At the end we return the "VariableDeclaration" node. If there's no an assignment operator for the current "VariableDeclaration" the init (which is an initializer) will be equal to null.

