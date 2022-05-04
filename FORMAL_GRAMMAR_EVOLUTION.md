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
Program => NumericLiteral | StringLiteral;
NumericLiteral => NUMBER;
StringLiteral => STRING;
```

The Parser class will get new method:
- StringLiteral, that returns the node for the String token.

The Program method itself will return either StringLiteral or NumericLiteral, depending on the incoming token.

3. Our program will consist not only of literals, so it would be very convenient to extract literals into separate production rule with the name Literal.

```
Program => Literal;
Literal => NumericLiteral | StringLiteral;
NumericLiteral => NUMBER;
StringLiteral => STRING;
```

Here we introduce new method Literal for the Parser and extract all logic for the literals from the Program method to the Literal method. Program itself will call Literal method and return the result of this call.
