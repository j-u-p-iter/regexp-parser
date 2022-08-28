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
  "for" "(" (VariableDeclaration | Expression) ";" Expression? ";" Expression? ")" Statement;
```

Let's extract separate parts into their own pruductions:

```
ForStatementInitPart => (VariableDeclarationStatement | ExpressionStatement) ";";
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
ForStatement() {
  this._eat('FOR');

  this._eat('LEFT_PAREN');

  const init = this._check('let') 
    ? this.VariableDeclarationInit() 
    : !this._check(';') ? this.Expression() : null; 

  this._eat(';');

  const test = !this._check(';') ? this.Expression() : null;

  this._eat(';')

  const update = !this._check('RIGHT_PAREN') ? this.Expression() : null;

  this._eat('RIGHT_PAREN');

  const body = this.Statement();
        
  return {
    type: "ForStatement",
    init,
    test,
    update,
    body,
  };  
}
```

Here we skip the FOR token, since we don't need it into the result AST Tree. The same way we skip the LEFT_PAREN token. 
Further we check that the next token is the "let" keyword. If there's a "let" keyword, it means the "init" part is not empty but will be presented by "VariableDeclaration" node. Next we check that the next token is not equal to ";". If it's not then the "init" part will be presented by the "Expression" node, otherwise it will be equal to null since the "init" part is empty - there's no VariableDeclaration or Expression before the ";" token.

After that we skip the ";" token.

Next we move to the "test" part and again check the presence of the ";" token. If there is no such a token, it means that the "test" part is not empty but instead is presented by the "Expression" node. Otherwise it will be equal "null" since there's no Expression before the ";" token.

Again, we skip here ";" token.

Next we move to the "update" part. Here we check the presence of the "RIGHT_PAREN" token. If there is such a token, it means the "update" part is empty since there's no Expression node before the "RIGHT_PAREN" token. And in this case the "update" part equals to null. Otherwise in case the "update" part contains Expression before the ";" token the "update" part will contain Expression node. 

And again, we skip here ";" token.

Like other statements, the parser recognizes a while statement by the leading "for" keyword. When it finds one, it calls this new method to parse the rest.

The AST for the for statement "for(let i = 0; i < 10; i += 1) { x = 10; }" will look like this:

```
{
  type: "Program",
  body: [
    {   
      type: "ForStatement",
      init: {
        type: "VariableDeclaration",
        declarations: [{
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: "i",
          },  
          init: {
            type: "NumericLiteral",
            value: 0,
          }   
        }]  
      },  
      test: {
        type: "BinaryExpression",
        operator: "<",
        left: {
          type: "Identifier",
          name: "i",
        },  
        right: {
          type: "NumericLiteral",
          value: 10, 
        }   
      },  
      update: {
        type: "AssignmentExpression",
        operator: "+=",
        left: {
          type: "Identifier",
          name: "i",
        },
        right: {
          type: "NumericLiteral",
          value: 1,
        }
      },
      body: {
        type: "BlockStatement",
        body: [{
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 10,
            }
          }
        }]
      }
    }
  ]
}
```
