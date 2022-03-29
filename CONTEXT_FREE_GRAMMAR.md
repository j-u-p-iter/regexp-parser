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

Vocabulary

Before we can proceed we should review some important definitions:

`Grammar` - a set of rules by which valid sentences in a language are constructed. 

`Nonterminal` - a grammar symbol that can be replaced/expanded to a sequence of symbols, using one of the production rules. It is a named reference to another rule in the grammar, like variables in the programming languages. Nonterminals is something that allows to compose the grammar. 

An actual word in a language; these are the symbols in a grammar that cannot be replaced by anything else. "terminal" is supposed to conjure up the idea that it is a dead-end—no further expansion is possible.

`Production` - a grammar rule that describes how to replace/exchange symbols. The general form of a production for a nonterminal is:

```
X –>Y1Y2Y3...Yn
```

The nonterminal X is declared equivalent to the concatenation of the symbols Y1Y2Y3...Yn. The production means that anywhere where we encounter X, we may replace it by the string Y1Y2Y3...Yn. Eventually we will have a string containing nothing that can be expanded further, i.e., it will consist of only terminals. Such a string is called a sentence. In the context of programming languages, a sentence is a syntactically correct and complete program.

`Derivation`

A sequence of applications of the rules of a grammar that produces a finished string of terminals. A leftmost derivation is where we always substitute for the leftmost nonterminal as we apply the rules (we can similarly define a rightmost derivation). A derivation is also called a parse.
