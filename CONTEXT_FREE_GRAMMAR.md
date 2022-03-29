The end goal of each interpreter is to interpret the code. For that interpreter should be able to understand the code. In this case the string representation of the raw source code is not an appropriate form of representation to make it easy for the interpreter to understand and run the code. It means that before interpreting the code we need to modify it from raw string representation to much more appropriate. And, this is where the tokinizers and parsers come. They help us to transform uninterpretable structure to something that can be run and interpreted.

But what structure can be the most appropriate for intepretation?

Let's say we have the next ariphmetic operation:

```
1 + 2 * 3 - 4
```

We know that the multiplication is evaluated before the addition or substraction. One way to visualize that precedence is using a tree. Leaf nodes are numbers, and interior nodes are operators with branches for each of their operands. The higher the precedence of an operation the closer the operation is to the bottom of the tree. The less the precedence - the closer it's to the top.

So it intuitively seems like a workable representation of our code is a tree that matches the grammatical structure — the operator nesting — of the language.

So, indeed the most appropriate representation of the code for the interpreter to run is the tree.

To understand how to split something on structuring blocks, pieces, we should know the laws or the rules of how these pieces are connected with each other. This is the something, that is described by grammar. Knowing these rules, we can split the source string on the pieces and combine them in the shape of a tree to make it readable (interpreatable) for interpreters.

To formulate these rules we need to have some syntax for them. The source code of a program can be represented with an infinite amount of expressions. According to this we need some tool that will allow us to describe potentially infinite amount of valid strings. In other words we need the way to describe potentially infinite amount of strings, using finite amount of these strings. It sounds like we need some recursion. Or we need the tool, that allows to describe infinite amount of expressions, using recursion. We can do it, using Context-Free Grammar.

In formal language theory, a context-free grammar (CFG) is a formal grammar whose production rules are of the form

```
A => b
```

with A as a single nonterminal symbol, and b as a string of terminals and/or nonterminals b  can be empty. A formal grammar is "context free" if its production rules can be applied regardless of the context of a nonterminal. No matter which symbols surround it, the single nonterminal on the left hand side can always be replaced by the right hand side. This is what distinguishes it from a context-sensitive grammar.

A formal grammar is a powerful tool for describing and analyzing languages. It is a set of rules by which valid sentences in a language are constructed. It provides for us syntax to describe all these rules. Let's be honest these rules are pretty advanced. And, if you see this grammar the first time the big probaility it will be hard for you to understand it. However through the time, through repetitions it becomes easier. It just takes some time.

It would be much easier to explain it what it is and how to use and read it if we start straight with the example. Here's a trivial example of English grammar:

```
sentence    –> <subject> <verb-phrase> <object>
subject     –> This | Computers | I
verb-phrase –> <adverb> <verb> | <verb>
adverb      –> never
verb        –> is | run | am | tell
object      –> the <noun> | a <noun> | <noun>
noun        –> university | world | cheese | lies
```
This is an example of the formal context-free grammar for the English grammar. Of course it's not the full grammar of the English, but only very tiny piece. This grammar consists of multiple rows. These rows are called production rules or just productions. They called like that because they produce the strings in the grammar.

So, using these production rules we can generate the result strings, that satisfy the English language grammar. These result strings are called deriviations. They called like that cause they are derived from the rules of the grammar.

As an example the next deriviations can be produced from the above rules:

```
This is a university.
Computers run the world.
I am the cheese.
I never tell lies.
```

Here is a leftmost derivation of the first sentence using these productions. It's called `leftmost`, cause we derive starting from the left side of the production rule.
```
sentence –> <subject> <verb-phrase> <object>
         –> This <verb-phrase> <object>
         –> This <verb> <object>
         –> This is <object>
         –> This is a <noun>
         –> This is a university
```

In addition to several reasonable sentences, we can also derive nonsense like "Computers run cheese" and "This am a lies". These sentences don't make semantic sense, but they are syntactically correct because they are of the sequence of subject, verb-phrase, and object. Formal grammars are a tool for syntax, not semantics. We worry about semantics at a later point in the compiling process. In the syntax analysis phase, we verify structure, not meaning.
