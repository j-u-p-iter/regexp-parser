# For Statement

It's one more iteration construction. The example of "ForStatement" looks like this:

```
for (let i = 0; i < 10; i += 1) {
  x += 1;
};
```

`let i = 0` part is responsible for the initialization variables. This is why in the result AST tree it will be named as `init`.

`i < 10` part tests the value of the initialized variable. This is why in the result AST tree it will be named as `test`.

`i += 1` part updates the value of the variable. This is why in the result AST tree it will be named as `update`.

Let's update Statement Grammar that contains Grammar for the For Statement:

```
Statement => EmptyStatement | BlockStatement | VariableDeclarationStatement | ExpressionStatement | IfStatement | IterationStatement;

IterationStatement => WhileStatement | DoWhileStatement | ForStatement;
```

The production rule for the ForStatement looks this way:

```
ForStatement => 
  "for" "(" (VariableDeclarationStatement | ExpressionStatement | ";") Expression? ";" Expression? ")" Statement;
```

Let's extract separate parts into their own pruductions:

```
ForStatementInitPart => (VariableDeclarationStatement | ExpressionStatement | ";");
ForStatementTestPart => Expression? ";";
ForStatementUpdatePart => Expression? ";";
ForStatement => 
  "for" "(" ForStatementInitPart ForStatementTestPart ForStatementUpdatePart ")" Statement;
```

Take into account that `init`, `test` and `update` parts are optional. It means that such type of for statement would be absolutely valid:

```
for (; ;) {
};
```

The code for the `ForStatement` rule looks like:

```
```
