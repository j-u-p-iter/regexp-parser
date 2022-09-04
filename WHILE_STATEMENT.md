# While Statement

While Statements are used to repeat some block of code until this while test condition becomes false.

It's one more statement. With this statement our Grammar becomes look like:

```
Statement => EmptyStatement | BlockStatement | VariableDeclaration | ExpressionStatement | IfStatement | WhileStatement;
```

The production rule for the WhileStatement looks very similar to the IfStatement but even simpler:

```
WhileStatement => "while" "(" Expression ")" Statement;
```

The code for this production rule looks like:

```
WhileStatement() {
  this._eat('WHILE');

  this._eat('LEFT_PAREN');

  const test = this.Expression();

  this._eat('RIGHT_PAREN');

  const body = this.Statement();

  return {
    type: "WhileStatement",
    test,
    body,
  };  
}
```

Here we skip the "WHILE" token, since it won't be added to result AST tree. The same we do with the "LEFT_PAREN" token. After we call the "this.Expression" method to parse the expression located between the opening and closing parenteses. This expression will be added into the result AST tree. After we skip the "RIGHT_PAREN" and parse the body statement for the while block, which will also be added to the result tree. 

Like other statements, the parser recognizes a while statement by the leading "while" keyword. When it finds one, it calls this new method to parse the rest.

The AST for the WhileStatement `while (x > 10) { x -= 1; }` will look like this:

```
{
  type: "Program",
  body: [
    {   
      type: "WhileStatement",
      test: {
        type: "BinaryExpression",
        operator: ">",
        left: {
          type: "Identifier",
          name: "x",
        },  
        right: {
          type: "NumericLiteral", 
          value: 10, 
        },  
      },  
      body: {
        type: "BlockStatement",
        body: [
          {   
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "-=",
              left: {
                type: "Identifier",
                name: "x",
              },  
              right: {
                type: "NumericLiteral",
                value: 1,
              }   
            }   
          }   
        ]   
      },  
    }  
  ]
}
```
