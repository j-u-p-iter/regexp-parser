The next by precedence according to the grammar is the primary production for the Primary expression.

The grammar for this rule looks like:

```
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")" ;
```

Most of the cases for the rule are single terminals, so parsing is straightforward.

The PrimaryExpression method will look like:

```
  private Primary() {
    if (match(FALSE)) return this.BooleanLiteral(false);
    if (match(TRUE)) return this.BooleanLiteral(true);
    if (match(NIL)) return this.NullLiteral(null);
    if (match(NUMBER)) return this.NumericLiteral(null);
    if (match(STRING)) return this.StringLiteral();

    if (match(LEFT_PAREN)) {
      const expr = this.Expression();
      consume(RIGHT_PAREN, "Expect ')' after expression.");
      return expr;
    }
  }
```

The interesting branch is the one for handling parentheses. After we match an opening ( and parse the expression inside it, we must find a ) token. If we don’t, that’s an error.
