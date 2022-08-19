# IFStatement

If statements are used to conditionally execute branches of code.

So, it's one more statement we should update our Grammar with.

Currently our Grammar for the statement looks like:

```
Statement => EmptyStatement | BlockStatement | VariableDeclarationStatement | ExpressionStatement;
```

With the new IfStatement nonterminal it turns into:

```
Statement => EmptyStatement | BlockStatement | VariableDeclarationStatement | ExpressionStatement | IfStatement;
```

Production rule for the IfStatement looks like:

```
IfStatement => "if" "(" Expression ")" Statement ( "else" Statement )?;
```

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
