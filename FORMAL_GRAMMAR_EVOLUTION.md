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

The simplest form of ExpressionStatement is the Literal followed by semicolon.

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

Here we added two additional types of nodes: Statement and StatementList.

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
