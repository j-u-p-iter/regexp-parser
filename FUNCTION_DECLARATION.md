# FUNCTION DECLARATION

Function Declaration is one more statement.

By this moment the grammar for the `Statement` production looks this way:

```
Statement => EmptyStatement | BlockStatement | VariableDeclaration | ExpressionStatement | IfStatement | IterationStatement;

IterationStatement => WhileStatement | DoWhileStatement | ForStatement;
```

With new `FunctionDeclaration` production rule it will look like:

```
Statement => Declaration | EmptyStatement | BlockStatement | ExpressionStatement | IfStatement | IterationStatement;

Declaration => VariableDeclaration | FunctionDeclaration

IterationStatement => WhileStatement | DoWhileStatement | ForStatement;
```

Here we've not only introduced new production, which is the `FunctionDeclaration` but extracted from the Statement rule the `Declaration` production with two production rules: `VariableDeclaration` and `FunctionDeclaration`.
