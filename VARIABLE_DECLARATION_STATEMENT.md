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
VariableDeclaration          => IDENTIFIER SIMPLE_ASSIGNMENT_OPERATOR VariableInitializer;
VariableInitializer          => Expression;
Expression                   => AssignmentExpression;
```

`VariableDeclarationsList` non-terminal takes into account the list of variables, splitted by comma. It allows us to write not only like `let x`, but also like `let x, y, z` and etc.

`VariableInitializer` non-terminal presents the part after the assignment operator, which can be any expression from an assignment expression like in case `let x = y = 5` to simple literal value `let x = 5;` or an identifier `let x = y`;

