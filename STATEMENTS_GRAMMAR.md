Each program is a set of different type of statements, devided by delimiters (usually ";"). So, statement is the string, that goes before ";" or after it till the next delimiter.

All that's said above can be expressed in the next grammar:

```
Program        => StatementsList EOF;
StatementsList => Statement | StatementsList Statement; 
```

This is equivalent to the next code:


```
isAtEnd() {
  if (match(EOF)) {
    return true;
  }
}

StatementsList() {
  const statementsList = [this.Statement()];
  
  while(!isAtEnd()) {
    statementsList.push(this.Statement());
  }
  
  return statementsList();
}
```


Initially the `statementsList` variable contains one Statement, cause according to the grammar the StatementsList is presented by at least one Statement till the end of the file (EOF) is reached.

After we are checking the presence of other Statement(s). And, if there is no the end of the file, it means, that there is another statement. This way we're looping through all the statements till the end of the file.

At the end we're returning the statements list.

For now we'll be supporting only one Statement, ExpressionStatement. Later will add new types of statements. 

Statements by definition don't evaluate to a value (expressions do but not statements). Statements are doing different side effects:
- producing user-visible output;
- modifying some state (value of the variable). It makes them a great fit for defining variables or the named entities.
