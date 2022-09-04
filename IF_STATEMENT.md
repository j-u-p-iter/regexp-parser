# IFStatement

If statements are used to conditionally execute branches of code.

So, it's one more statement we should update our Grammar with.

Currently our Grammar for the statement looks like:

```
Statement => EmptyStatement | BlockStatement | VariableDeclaration | ExpressionStatement;
```

With the new IfStatement nonterminal it turns into:

```
Statement => EmptyStatement | BlockStatement | VariableDeclaration | ExpressionStatement | IfStatement;
```

Production rule for the IfStatement looks like:

```
IfStatement => "if" "(" Expression ")" Statement ( "else" Statement )?;
```

Since IfStatement production rule depends on Statement and at the same time it belongs to the Statement, it allows also to parse nested if statements easily.

The code for this production rule looks like this:

```
IfStatement () {
  this._eat("IF");
  
  this._eat("LEFT_PAREN");
  
  const expression = this.Expression();
  
  this._eat("RIGHT_PAREN");
  
  const consequentStatement = this.Statement();
  
  let alternateStatement = null;
  
  if (this._match('ELSE')) {
    alternateStatement = this.Statement();
  }
  
  return {
    type: "IfStatement",
    test: expression,
    consequent: consequentStatement,
    alternate: alternateStatement,
  };
}
```

Here we skip the "IF" token, since it won't be added to result AST tree. The same we do with the "LEFT_PAREN" token. After we call the "this.Expression" method to parse the expression located between the opening and closing parenteses. This expression will be added into the result AST tree. After we skip the "RIGHT_PAREN" and parse the consequent statement for the if block, which will also be added to the result tree. As we can see it from the Grammar the "ELSE" part of the IfStatement is optional. This is why we check the presense of the "ELSE" token before parsing the alternate statement of the IfStatement. This part is also included into the result AST tree as it's shown in the above code snippet.

Like other statements, the parser recognizes an if statement by the leading "if" keyword. When it finds one, it calls this new method to parse the rest.

The AST for the IfStatement `if (x) { y = 5; } else { z = 7; }` will look like this:

```
{
  type: "Program",
  body: [
    {   
      type: "IfStatement",
      test: {
        type: "Identifier",
        name: "x",
      },  
      consequent: {
        type: "BlockStatement",
        body: [
          {   
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "y",
              },  
              right: {
                type: "NumericLiteral",
                value: 5,
              }   
            }   
          }   
        ]   
      },  
      alternate: {
        type: "BlockStatement",
        body: [
          {   
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "z",
              },  
              right: {
                type: "NumericLiteral",
                value: 7
              }
            }
          }
        ]
      },
    }
  ]  
}
```
