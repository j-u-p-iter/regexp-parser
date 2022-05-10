## Breif explanation of how the parser works.

Parser is implemented as a Parser class. It takes some string as an input string. This input string is the program we need to parse. Parse uses Tokenizer under the hood. Tokenizer helps the Parser to split program on different tokens. Tokenizer knows about all possible nodes the program can have. Parser itself doesn't know anything about the valid lexemes of the input string. Each time the Parser asks to return the next token (according to the current position of the cursor) he asks Tokenizer to do it. The Tokenizer loops through the specification (list of nodes) and checks if there's a specification for the token the Parser tries to parse. If there's such a specification, it returns it to the Parser and Parser includes this node into the result AST and after that continue parsing the program. If it's the end of the input string, the parser stops it's execution returning the result AST tree, if it's not the end of the input string, the parser continues it's execution, asking Tokenizer to return the next token.
If Tokenizer for some reason can't find the match for the next token, it throws an error and as result Parser stops it's execution, throwing an error.

## Another way to explan parser work.

```
{
  21 + 2 - 1;
}
```

To better understand the parsing process I suggest we to look at the principles lying under the hood of the Parser from different angel. Let's imagine, that the Parser is the manager of the company. The goal of the company is to provide for the customer the result AST tree for the provided above code snippet. Parser has an employee - Tokenizer, which has responsibility to extract from the code snippet tokens. Only Tokenizer knows about all possible lexemes the input string can contain, only Tokenizer knows how to extract these tokens from the code snippet.

For example, only Tokenizer knows, that to extract numbers from the input string and create token for them we should use /^\d+/ regexp. Parser has no idea, that it's the way to get lexeme from the code. Parser expects on every step either valid token from the Tokenizer, either invalid token from the Tokenizer or the end of the tokens stream (which is null).

So, let's say the client brings to the Parser the provided above code snippet and asks Parser to do the best and to provide the AST tree for this code snippet.

Parser gets the input string. The structure of the result AST tree depends on the stream of tokens it get's from the Tokenizer. Parser asks Tokenizer about one token at a time (the token, related to the first lexeme, Tokenizer can detect, starting from the beginning of the input string). As soon as Parser understands what token is the next one, it makes the decision how to continue building the AST tree.

So, just after the Parser starts working with the input string he asks the Tokenizer to do the job and to find the first lexeme it could find in the input string, starting from the very beginning of this string. Tokenizer checks in a loop the code on presence of one of the lexemes he knows about. He uses regexps for that. Again, Tokenizer finds the first match, starting from the beginning of the input string. Tokenizer finds "{" and before sending it to the Parser, prepares such called token - object with additional information about found lexeme Parser could work with this information in a very convinient way. It would be correct to say that it's a form of a report from the Tokenizer employee for the Parser manager. Parser takes the report from the Tokenizer and understands, that he has a deal with the block scope. Knowing that Parser creates appropriate node for the block scope. And know he needs to know about the content of the block scope to continue building the tree. Of course it goes back to the Tokenizer and asks him to prepare new report about next lexeme in the code. Tokenizer remembered when he stopped searching the lexeme the last time. So, he knows the place where to start search again. Using the same loop and the set of instructions about all possible lexemes the code can contain the Tokenizer finds new lexeme - 21. Again, it prepares the report for the Parser and sends it to him. Parser sees that the next token is the number. Now Parser understands that the number token can be the part of different possible AST nodes. It can be a standalone literal, or it can be the part of binary expression. Depending on the next token the AST structure differs. So, it asks Tokenizer to find the next token. Tokenizer brings back the report about the "+" operator token. Now Parser knows that he has a deal with the binary expression. Parser creates some necessary structrue for the binary expression and asks back the Tokenizer to bring him report about the next token.

1. Our programming language consists of only numbers:

```
Program        => NumericLiteral;
NumericLiteral => NUMBER;
```

In this case the Parser class will have two methods:

- Program, that returns the root node of the result parser tree;
- NumericLiteral, that returns the node for the Number token. It will be a leaf node, which means it will be the last node in the branch, cause NumericLiteral deriviates to terminal.


2. We add to the programming language string literal.

```
Program        => NumericLiteral | StringLiteral;
NumericLiteral => NUMBER;
StringLiteral  => STRING;
```

The Parser class will get new method:
- StringLiteral, that returns the node for the String token.

The Program method itself will return either StringLiteral or NumericLiteral, depending on the incoming token.

3. Our program will consist not only of literals, so it would be very convenient to extract literals into separate production rule with the name Literal.

```
Program        => Literal;
Literal        => NumericLiteral | StringLiteral;
NumericLiteral => NUMBER;
StringLiteral  => STRING;
```

Here we introduce new method Literal for the Parser and extract all logic for the literals from the Program method to the Literal method. Program itself will call Literal method and return the result of this call. Literal method won't return any new node, but just make decision what result node to return - NumericLiteral or StringLiteral.

If with the NumericLiterals and StringLiterals everything was very easy and we could easily find an appropriate name for the AST node type, now things become more complicated. It's because it's hard to find:
- on what structuring blocks we should split the program;
- how to name these blocks.

For the inspiration I recommend to use the `https://astexplorer.net/` project. Here you can choose language and parser and to see the structure of the AST every parser introduces. It really helps to find appropriate names for the AST nodes for the parser you're creating.

For example, let's choose the JavaScript language and the @typescript-eslint/parser.

For the 42 number it gives the next structure (I'll provide here the light form of the structure we to concentrate on really important things):

```
{
  type: 'ExpressionStatement',
  expression: {
    type: 'Literal',
    value: 42,
  }
} 
```

So, here we can see that the 42 value is determined as an ExpressionStatement here. And we come to the two new terms for us: `expression` and `statement`.

In computer programming, a statement is a syntactic unit of an imperative programming language that expresses some action to be carried out. A program written in such a language is formed by a sequence of one or more statements. A statement may have internal components (e.g., expressions). So, actually each program is the sequence (an array) of statements that go one after another. Executing each statement of the program we execute the program as a whole thing.

At the same time a statement may have internal components (e.g., expressions). In computer science, an expression is a syntactic entity in a programming language that may be evaluated to determine its value. It is a combination of one or more constants, variables, functions, and operators that the programming language interprets (according to its particular rules of precedence and of association) and computes to produce ("to return", in a stateful environment) another value. This process, for mathematical expressions, is called evaluation.

The ExpressionStatement here has the "expression" property, which contains the Literal node.

We won't reinvent the wheel and will create the similar structure.

4. Each literal is the part of something bigger. Literals are structuring blocks of the expression statements, for example. Program can contain different expression statements. Examples of the expression statements:

```
42;

"hello";

1 + 2 = 3;

"a" + "b" = "ab";
```

As we can see the expression statement in the simplest case is represented by the primitive value:

```
ExpressionStatement => Literal ";";
```

The simplest form of ExpressionStatement is the Literal followed by semicolon. In our program the semicolon as a delimeter is a mandatory symbol. The delimeter won't be presented in the AST itself. The parser won't return node for the delimeter but instead will just skip it.

So, the next non-terminal will be the ExpressionStatement.

```
Program             => ExpressionStatement;
ExpressionStatement => Literal ";";
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

Here we introduce new, ExpressionStatement, method.

5. Right now our parser can parse only one literal for the whole program - numeric or string - and present it as an ExpressionStatement in the AST and exit the program. However the program is usually more than one statement. In most cases the amount of statements is more than one. So, regular program consists of statements or statements list. Actually in the simplest form each programm is the list of different statements. If we try to parse multiple Literal values parser will stop on the first one. To make it possible to parse all statements (which is a sequence or an array) in the program we need to introduce a loop and to go through all the statements in this loop and to deriviate each statement into appropriate node. So, the body of our result program will be presented at the end by an array of nodes. Each of these nodes represent one specific statement.

So, one more time:

- the program consists of one or more statements and can be defined as the list of statements;
- there are different type of statements. On the previous step we took a look at the ExpressionStatement as on one of the examples of such type of statements.

As result we come to the next grammar:

```
Program        => StatementsList;
StatementsList => Statement | StatementsList Statement;
Statement      => ExpressionStatement;
ExpressionStatement => Literal ";";
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

Here we added two additional non-terminals: Statement and StatementList.

```
StatementsList => Statement | StatementsList Statement;
```

This statement means that the statements list consists of one or more statements. In the program it will be presented by the loop.

The loop will look like that:

```
StatementList() {
  let statementList = [this.Statement()];

  while (this._lookahead !== null) {
    statementList.push(this.Statement())
  }
 
  return statementList;
}
```

How does it work?

If we enter the StatementList node we expect to have here at least one node. We don't need loop for that, so we declare the initial list like that:

```
let statementList = [this.Statement()];
```

As soon as the Statement node is created and all internal callbacks (for the non-terminals, that sit under the Statement non-terminal) are executed we look at the next token, thanks to the lookahead. If the lookahead is not null, it means, that there's at least one more statement, cause the previous one finished it's execution and returned back the result node. So, the new node, if there's a node, belongs to the next statement. After the second statement is created and returned we again look at the lookahead checking the presense of new node. Again, if there's node, than it belongs to one more new statement, cause the previous one was already executed and returned.

And such loop repeats until all nodes for all statements are deriviated.

As soon as all statements are deriviated, it means that we reached the end of the program, we return the statementList, which will be the body of our program.

It's important to notice on this step, that not all non-terminals have appropriate AST nodes. Some of them are just helpers. StatementList, for example, doesn't deriviate new node. It's just a helper, that returns list of Statement. Statement is also not a separate node, but just one more helper, the same as Literal, which makes decision which Statement to return and return it.

6. By this moment we declared one type of statements, which is called `ExpressionStatement`:

```
Statement => ExpressionStatement;
```

There're a lot of different types of statements. Here we'll introduce new such type, which is called `BlockStatement`. Block statements starts with the "{" and ends with the "}". This statement does nothing else than declaring new scope for the program. We can even say that it declares new mini-program or sub-program. It means, that block statement can contain any statement the main program can contain.

So, the grammar for the BlockStatement looks like that:

```
Statement      => ExpressionStatement | BlockStatement;
BlockStatement => "{" StatementList | ɛ "}";
```

Here we use an epsilon symbol, which deriviates to null. It allows us to make non-terminals (in this case StatementList non-terminal) optional. It actually says, taht BlockStatement can be empty or it can contain any amount of statements.

The grammar on this step will look like that:

```
Program             => StatementsList;
StatementsList      => Statement | StatementsList Statement;
Statement           => ExpressionStatement | BlockStatement;
BlockStatement      => "{" StatementList | ɛ "}";
ExpressionStatement => Literal ";";
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

The next step is to determine, how to show the block statements in the AST. Let's open the astexplorer and generate AST for the next program:

```
{
  42;
  
  "hello";  
}
```

For the JavaScript language and @typescript-eslint/parser it will look like that:

```
{
  type: "Program",
  body: [{
    type: "BlockStatement",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "Literal",
        value: 42
      }
    }, {
      type: "ExpressionStatement",
      expression: {
        value: "Literal",
        value: "hello",
      }
    }]
  }]
}
```

So, in our parser we'll introduce new BlockStatement Method, that will return new "BlockStatement" node, which looks like the mini version of the root "Program" node. We'll also modify the Statement method, cause we introduced new type of statement and we need to have the condition to detect what type of the statements we have deal with at every moment of time.

7. The next statement we'll introduce is called EmptyStatement.

Standalone ";" symbol is valid as a separate statement for many programming languages, including the one we are building. So, let's include it into the result grammar:

```
Program             => StatementsList;
StatementsList      => Statement | StatementsList Statement;
Statement           => ExpressionStatement | BlockStatement | EmptyStatement;
BlockStatement      => "{" StatementList | ɛ "}";
ExpressionStatement => Literal ";";
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

In the Parser it will be presented in form of the new EmptyStatement method, that will return the node:

```
{
  type: "EmptyStatement",
}
```

8. Let's comeback to the expressions now. Just to recall a little bit, expressions are the building blocks of the statements. It's something we can evaluate and get some returned value back.

There're different kind of expressions. The easiest expression is just Literal value.

```
42;
```

You can ask how is this an expression? Actually absence of the arithmetic operator doesn't mean, that it's not an expression.

When we have an expression like that:

```
2 + 3;
```

we say, that it consists of two parts - left and right and that it evaluates to 5. The expression 42 consists of only one part and as result evaluates to itself - to 42.

So, one more time, the Literals are simplest versions of expressions:

```
ExpressionStatement => Literal";";
```

The next expression we'll take a look is the "BinaryExpression":

Actually I didn't take this name from nowhere I just used astexplorer and choose JavaScript language and @typescript-eslint/parser for the expression:

```
2 + 3
```

It gave me the next AST:

```
{
  type: "Program",
  body: [{
    type: "ExpressionStatement",
    expression: {
      type: "BinaryExpression",
      operator: "+",
      left: {
        type: "Literal",
        value: 2,
      },
      right: {
        type: "Literal",
        value: 3,
      }
    }
  }]
}
```

The grammar for the BinaryExpression `2 + 3` will look like:

```
BinaryExpression => Literal "+" Literal;
```

You can tell me, that expressions may be much more complex, than this one. And I agree. For example,

```
2 + 3 - 2
```

is also a valid expression and is also called Binary (you can check it in the astexplorer).

The thing is this more complex BinaryExpression contains two parts:

```
2 + 3
```

which is BinaryExpression by itself and

```
- 2
```

which is the operator and the second part of the BinaryExpression.

So, BinaryExpression can consist of other BinaryExpression(s). The grammar of the BinaryExpression is updated to this version:

```
BinaryExpression => Literal | BinaryExpression ADDITIVE_OPERATOR Literal
```

ADDITIVE_OPERATOR here is the terminal to denote "+" or "-" operators.

Here again we have recursion which will be presented by the loop in the code.

The grammar for the moment looks like this:

```
Program             => StatementsList;
StatementsList      => Statement | StatementsList Statement;
Statement           => ExpressionStatement | BlockStatement | EmptyStatement;
BlockStatement      => "{" StatementList | ɛ "}";
ExpressionStatement => (Literal | BinaryExpression) ";";
BinaryExpression => Literal | BinaryExpression ADDITIVE_OPERATOR Literal
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING
```

I use brackets for the ExpressionStatement to show, that at first the part in the brackets should deriviate and only after that we should add ";" to the result of the deriviation to finish the whole expression deriviation.

Let's use the astexplorer again and see what we have for the expression `2 + 3 - 2`:

```
{
  type: "Program",
  body: [{
    type: "ExpressionStatement",
    expression: {
      type: "BinaryExpression",
      operator: "-",
      left: {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "Literal",
          value: 2,
        },
        right: {
          type: "Literal",
          value: 3,
        }
      },
      right: {
        type: "Literal",
        value: 2,
      }
    }
  }]
}
```

When we evaluate such type of expressions usually we go from the left to right, evaluating every operator one by one. It means that we start from the "plus" operator, evaluate result of the first BinaryExpression, after that go to the "-" operator and evaluate next BinaryExpression. Actually the precedence order doesn't make any sense in this case, but still it's included in the AST. The precedence of the "+" operator is higher than the precedence of the "-" operator. We can see it by the level of nesting of the BinaryExpression(s). The deeper the BinaryExpression the higher precedence and vice versa. It's like that, cause to evaluate the parent operation we need at first to evaluate child operation at first, which is obvious.

So, here we create the BinaryExpression method, which will return the BinaryExpression node.

9. If we use multiplication operator or round brackets we have a deal with the precedence of the operations. The AST tree should be able to represent this precedence order. And it does it by the level of tree nesting.

There's a rule: the closer operator is located to the starting symbol (the lower nesting level) the lower precedence of the operation. And vise versa - the deeper the BinaryExpression operator the higher precedence of this operator.
