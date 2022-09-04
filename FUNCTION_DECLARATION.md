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

Here we've not only introduced new production, which is the `FunctionDeclaration` but extracted from the Statement rule the `Declaration` production with two production rules: `VariableDeclaration` and `FunctionDeclaration`. From here we can see that Declaration, despite the fact it doesn't have `Statement` suffix, still considered as a `Declaration`.

The grammar for the `FunctionDeclaration` production rule looks like this:

```
FunctionDeclaration => "function" Function;

Function => Identifier "(" ParametersLit? ")" BlockStatement;
```

The main `FunctionDeclaration` rule uses a separate helper rule `Function`. A `FunctionDeclaration` statement is the "function" keyword followed by the actual function-y stuff. When we get to classes, we’ll reuse that function rule for declaring methods. Those look similar to function declarations, but aren’t preceded by "function".
