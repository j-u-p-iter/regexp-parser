1. Our programming language consists of only numbers:

```
Program        => NumericLiteral;
NumericLiteral => NUMBER;
```

In this case the Parser class will have two methods:

- Program, that returns the root node of the result parser tree;
- NumericLiteral, that returns the node for the Number token.


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

Here we introduce new method Literal for the Parser and extract all logic for the literals from the Program method to the Literal method. Program itself will call Literal method and return the result of this call.

If with the NumericLiterals and StringLiterals everything was very easy and we could easily find an appropriate definition for the AST node type, no things become more complicated. It's because it's hard to find:
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

So, here we can see that the 42 value is determined as an ExpressionStatement here. In computer programming, a statement is a syntactic unit of an imperative programming language that expresses some action to be carried out. A program written in such a language is formed by a sequence of one or more statements. A statement may have internal components (e.g., expressions). So, actually each program is the sequence (an array) of statements that go one after another. Executing each statement of the program we execute the program as a whole thing.

At the same time a statement may have internal components (e.g., expressions). In computer science, an expression is a syntactic entity in a programming language that may be evaluated to determine its value. It is a combination of one or more constants, variables, functions, and operators that the programming language interprets (according to its particular rules of precedence and of association) and computes to produce ("to return", in a stateful environment) another value. This process, for mathematical expressions, is called evaluation.

The ExpressionStatement here has the "expression" property, which contains the Literal node.

Based on this structure and definitions we'll create our own structure on the next step.


4. Each literal is the part of something bigger. Literals are structuring blocks of the expression statements, for example. Program can contain different expression statements. Examples of the expression statements:

```
42;

"hello";

1 + 2 = 3;

"a" + "b" = "ab";
```

In our program we declare the Expression Statement as an Expression followed by ";":

```
ExpressionStatement => Expression ";";
```

Expression at the same time in the simplest form is represented by the primitive value:

```
Expression => Literal;
```

The simplest form of Expression is the Literal.

So, the next two non-terminals will be the Expression and ExpressionStatement.

```
Program             => ExpressionStatement;
ExpressionStatement => Expression ";";
Expression          => Literal;
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

Here we introduce two new methods for the Parser which are called Expression and ExpressionStatement.


5. Actually each programm is the set of statements. In the simplest case it can be one statement. And there're different types of possible statements. One of the possible types is the expression statement.

Expression statements can be described by the next production:

```
ExpressionStatement => Expression <;>;
```

So, as we can see here the expression statement consists of the expression itself and semicolumn.

So, the next non-terminal we introduce is the ExpressionStatement.

```
Program             => ExpressionStatement;
ExpressionStatement => Expression <;>;
Expression          => Literal;
Literal             => NumericLiteral | StringLiteral;
NumericLiteral      => NUMBER;
StringLiteral       => STRING;
```

Here we introduce new method for the Parser which is called ExpressionStatement.

6. However the program is usually more than one statement. In most cases the amount of statements is more than one. So, regular program consists of statements or statements list. Actually in the simplest form each programm is the list of different statements.

Let's introduce new non-terminal, which is called StatementsList:

```
Program        => StatementsList;
StatementsList => Statement | StatementsList Statement;
Statement      => Literal;
Literal        => NumericLiteral | StringLiteral;
NumericLiteral => NUMBER;
StringLiteral  => STRING;
```
