A block statement is a sequence of zero or more statements enclosed in curly braces. A block statement is generally used to group together several statements. This is a very important concept for any programming language.

As we said previously the whole program is a set of statements. There can be 0, 1 or more statements the program consists of. The BlockStatement can be considered as a sub-program, cause it groups some state of statements of the whole program. So, one more time, each BlockStatement can be considered as a sub-program.

Let's compare two examples: the program with and without block statements:

1. Without BlockStatement.

Our simple program looks like this:

```
"hello";

42;
```

The appropriate AST for this program looks like this:

```
{
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "StringLiteral",
        value: "hello"
      }
    },
    {
      type: "ExpressionStatement",
      expression: {
        type: "NumericLiteral",
        value: 42
      }
    }
  ]
}
```

So as we can see, the program body consists of two ExpressionStatement(s).


Let's compare with the BlockStatement now:


```
{
  "hello";

  42;
}
```

And, the AST for this program looks like this:

```
{
  type: "Program",
  body: [
    {
      type: "BlockStatement",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "hello"
          }
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumericLiteral",
            value: 42
          }
        } 
      ]
    }
  ]
}
```

As we can see the nodes of the "Program" and "BlockStatement" types are very similar. They all have "body" property with an Array type. The body of both nodes are array of statements. This is what makes BlockStatement(s) look like Program in form of AST format.
