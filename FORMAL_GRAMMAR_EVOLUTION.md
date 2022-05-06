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

4. Each literal is the part of something bigger. Literals are structuring blocks of the expressions, for example. Program can contain different expressions. Examples of the expressions:

```
1 + 2 = 3;

"a" + "b" = "ab";
```

So, the next non-terminal we introduce is the Expression.

```
Program        => Expression;
Expression     => Literal;
Literal        => NumericLiteral | StringLiteral;
NumericLiteral => NUMBER;
StringLiteral  => STRING;
```

In the simplest form the Expression is just a Literal, which will be changed in the future.

5. Actually each programm is the set of statements. In the simplest case it can be one statement.

So, the next non-terminal we introduce is the Statement.

```
Program        => Statement;
Statement      => Literal;
Literal        => NumericLiteral | StringLiteral;
NumericLiteral => NUMBER;
StringLiteral  => STRING;
```

Here we introduce new method for the Parser which called Statement.

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
