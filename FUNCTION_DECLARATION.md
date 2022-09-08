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
The function node itself consists of a name, params and body. This is why the `Function` production rule parses `Identifier` which will be serving as a name, `FunctionParamsList` which will serve as a params and the `BlockStatement` which corresponds to the function body.

To parse the params the separate helper was created which is called `FunctionParamsList`. We extracted this piece of code into separate helper not to reuse it in the future, but just to make code look better and more readable. Parsing the params we first of all skip the `LEFT_PAREN` and after that check the lookahead - if the next token is `RIGHT_PAREN`. If it is it means that params of the function is an empty list. If it's not we parse one param after another using the `do {} while()` block. Next we skip the closing `RIGHT_PAREN` token and return params list.

Function's params are optional. The same is about function body - it can be empty or it can contain set of any statements, including the `ReturnStatement`. `ReturnStatement` is the new kind of statement we've not seen before yet. We'll take a look at this statement in borders of another article.

And let's look at the AST for the next function:

```
function square(x) {
  return x * x;
}
```

```
{
  type: "Program",
  body: [{
    type: "FunctionDeclaration",
    name: {
      type: "Identifier",
      name: "square",
    },
    params: [{
      type: "Identifier",
      name: "x",
    }],
    body: {
      type: "BlockStatement",
      body: [{
        type: "ReturnStatement",
        argument: {
          type: "BinaryExpression",
          left: {
            type: "Identifier",
            name: "x",
          },
          operator: "*",
          right: {
            type: "Identifier",
            name: "x",
          }
        }
      }]
    }
  }]
});
```
