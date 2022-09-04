# Do While Statement

Do While Statements are used to repeat some block of code until this while test condition becomes false.

It's one more statement. With this statement our Grammar becomes look like:

```
Statement => EmptyStatement | BlockStatement | VariableDeclaration | ExpressionStatement | IfStatement | WhileStatement | DoWhileStatement;
```

The production rule for the DoWhileStatement looks this way:

```
WhileStatement => "do" Statement "while" "(" Expression ")" ";";
```

The code for this production rule looks like:

```
DoWhileStatement() {
  this._eat("DO");

  const body = this.Statement();

  this._eat("WHILE");

  this._eat("LEFT_PAREN");

  const test = this.Expression();

  this._eat("RIGHT_PAREN");

  this._eat(";");

  return {
    type: "DoWhileStatement",
    body,
    test,
  }   
}
```

Here we skip the "DO" token, since it won't be added to result AST tree. After we parse the body statement, which will be added to the result tree. Next we skip the "WHILE" token. The same we do with the "LEFT_PAREN" token. After we call the "this.Expression" method to parse the expression located between the opening and closing parenteses. This expression will be added into the result AST tree. After we skip the "RIGHT_PAREN" and ";".

Like other statements, the parser recognizes a do while statement by the leading "do" keyword. When it finds one, it calls this new method to parse the rest.

The AST for the WhileStatement `do { x -= 1; } while (x > 10);` will look like this:

```
{
  "type": "Program",
  "body": [
    {
      "type": "DoWhileStatement",
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "AssignmentExpression",
              "operator": "-=",
              "left": {
                "type": "Identifier",
                "name": "x"
              },
              "right": {
                "type": "NumericLiteral",
                "value": 1
              }
            }
          }
        ]
      },
      "test": {
        "type": "BinaryExpression",
        "operator": ">",
        "left": {
          "type": "Identifier",
          "name": "x"
        },
        "right": {
          "type": "NumericLiteral",
          "value": 10
        }
      }
    }
  ]
}
```
