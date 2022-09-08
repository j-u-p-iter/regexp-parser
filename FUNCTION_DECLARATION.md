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

Here we've not only introduced new production, which is the `FunctionDeclaration` but extracted from the Statement rule the `Declaration` production with two production rules: `VariableDeclaration` and `FunctionDeclaration`. From here we can see that Declaration, despite the fact it doesn't have `Statement` suffix, still considered as a statement.

The grammar for the `FunctionDeclaration` production rule looks like this:

```
FunctionDeclaration => "function" Function;

Function => Identifier "(" ParametersLit? ")" BlockStatement;
```

The main `FunctionDeclaration` rule uses a separate helper rule `Function`. A `FunctionDeclaration` statement is the "function" keyword followed by the actual function-y stuff. When we get to classes, we’ll reuse that function rule for declaring methods. And this is the reason why we extracted the `Function` rule from the `FunctionDeclaration`. Those look similar to function declarations, but aren’t preceded by "function".

The function itself is a name followed by the optional parenthesized parameter list and the body. The body is always a braced block, using the same grammar rule that block statements use. The parameters list uses this rule:

```
parametersList     → Identifier ( "," Idenfifier )* ;
```

A function node has a name, a list of parameters (their names), and then the body. We store the body as the list of statements contained inside the curly braces.

The code for the FunctionDeclaration production rule looks like this:

```
FunctionDeclaration() {                                                      
  this._eat('FUNCTION');                                                     
                                                                               
  return this.Function();                                                    
} 

Function() {                                                                 
  const name = this.Identifier();                                            
                                                                               
  const params = this.FunctionParamsList();                                  
                                                                               
  const body = this.BlockStatement();                                        
                                                                               
  return {                                                                   
    type: "FunctionDeclaration",                                             
    name,                                                                    
    params,                                                                  
    body,
  };
}

FunctionParamsList() {                                                       
  this._eat('LEFT_PAREN');                                                   
                                                                               
  const paramsList = [];                                                     
                                                                               
  if (!this._check('RIGHT_PAREN')) {                                         
    do {                                                                     
      paramsList.push(                                                       
        this.Identifier()                                                    
      );                                                                     
    } while(this._match('COMMA'));                                           
  }                                                                          
                                                                               
  this._eat('RIGHT_PAREN');                                                  
                                                                               
  return paramsList;                                                         
} 
```

In the `FunctionDeclaration` method we skip the `function` keyword since we don't need it into the result AST tree and return the `Function` helper, which corresponds to the `Function` production rule.
