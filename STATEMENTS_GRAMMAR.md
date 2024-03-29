Each program is a set of different type of statements, devided by delimiters (usually ";"). So, statement is the string, that goes before ";" or after it till the next delimiter.

Statements are the ``steps'' of a program. Most statements compute and assign values or call functions, but we will eventually meet several other kinds of statements as well. By default, statements are executed in sequence, one after another.

All that's said above can be expressed in the next grammar:

```
Program        => StatementsList EOF;
StatementsList => Statement | ɛ | StatementsList Statement; 
```

This is equivalent to the next code:


```
isAtEnd() {
  if (match(EOF)) {
    return true;
  }
}

StatementsList() {
  const statementsList = [];
  
  while(!isAtEnd()) {
    statementsList.push(this.Statement());
  }
  
  return statementsList();
}
```


Initially the `statementsList` variable contains no statements, cause according to the grammar the StatementsList can be empty (ɛ).

After we are checking the presence of other Statement(s). And, if there is no the end of the file, it means, that there is another statement. This way we're looping through all the statements till the end of the file.

At the end we're returning the statements list.

For now we'll be supporting only one Statement, ExpressionStatement. Later will add new types of statements. 

Statements by definition don't evaluate to a value (expressions do but not statements). Statements are doing different side effects:
- producing user-visible output;
- modifying some state (value of the variable). It makes them a great fit for defining variables or the named entities.

Where an expression’s main job is to produce a value, a statement’s job is to produce an effect. Since, by definition, statements don’t evaluate to a value, to be useful they have to otherwise change the world in some way—usually modifying some state, reading input, or producing output.

Most of the statements in a program are expression statements. An expression statement is simply an expression followed by a semicolon. The lines

```
i = 0;
i = i + 1;
```

and

```
printf("Hello, world!\n");
```

are all expression statements.

An expression followed by a semicolon (;) promotes the expression to statement-hood. This is called (imaginatively enough), an expression statement.

Expression statements do all of the real work in a program. Whenever you need to compute new values for variables, you'll typically use expression statements (and they'll typically contain assignment operators). Whenever you want your program to do something visible, in the real world, you'll typically call a function (as part of an expression statement). 

Expressions and expression statements can be arbitrarily complicated. They don't have to consist of exactly one simple function call, or of one simple assignment to a variable. For one thing, many functions return values, and the values they return can then be used by other parts of the expression.

To be useful, an expression statement must do something; it must have some lasting effect on the state of the program. (Formally, a useful statement must have at least one side effect.) The first two sample expression statements in this section (above) assign new values to the variable i, and the third one calls printf to print something out, and these are good examples of statements that do something useful.

To make the distinction clear, we may note that degenerate constructions such as

```
0;
i;
```

or

```
i + 1;
```

are syntactically valid statements--they consist of an expression followed by a semicolon--but in each case, they compute a value without doing anything with it, so the computed value is discarded, and the statement is useless. But if the "degenerate" statements in this paragraph don't make much sense to you, don't worry; it's because they, frankly, don't make much sense.

The only kind of a Statement we're looking at for now is the ExpressionStatement. It's an Expression followed by semicolomn:

```
ExpressionStatement = Expression ";";
```

And the code for the ExpressionStatement looks like:

```
ExpressionStatement() {
  const expression = thie.Expression();
  this._eat(";");
  
  return {
    type: "ExpressionStatement",
    expression,
  };
}
```

Nothing special here. We just:
- parset an expression;
- eat (skip) the semicolumn followed by the expression. As result, it won't be presented in the result AST tree.
- return ExpressionStatement node with the parsed expression, that has been gotten on the above step.
