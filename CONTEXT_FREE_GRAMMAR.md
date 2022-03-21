The end goal of each interpreter is to interpret the code. For that interpreter should be able to understand the code. In this case the string representation of the raw source code is not an appropriate form of representation to make it easy for the interpreter to understand and run the code. It means that before interpreting the code we need to modify it from raw string representation to much more appropriate. And, this is where the tokinizers and parsers come. They help us to transform uninterpretable structure to something that can be run and interpreted.

But what structure can be the most appropriate for intepretation?

Let's say we have the next ariphmetic operation:

```
1 + 2 * 3 - 4
```

We know that the multiplication is evaluated before the addition or substraction. One way to visualize that precedence is using a tree. Leaf nodes are numbers, and interior nodes are operators with branches for each of their operands. The higher the precedence of an operation the closer the operation is to the bottom of the tree. The less the precedence - the closer it's to the top.
