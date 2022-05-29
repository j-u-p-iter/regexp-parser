While the `x = 1` is an assignment expression, the `let x = 1` is a variable declation statement. The AST for these two types of notation is absolutely different.

Declaration differs from an assignment only by one keywork `let`.

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
VariableDeclaration          => IDENTIFIER VariableInitializer;
VariableInitializer.         => SIMPLE_ASSIGNMENT_OPERATOR Expression;
Expression                   => AssignmentExpression;
```
