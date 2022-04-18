## We need a way to get the tree structure of the string

The end goal of each interpreter is to interpret the code. For that interpreter should be able to understand the code. In this case the string representation of the raw source code is not an appropriate form of representation to make it easy for the interpreter to understand and run the code. It means that before interpreting the code we need to modify it from raw string representation to much more appropriate. And, this is where the tokinizers and parsers come. They help us to transform uninterpretable structure to something that can be run and interpreted.

But what structure can be the most appropriate for intepretation?

Let's say we have the next ariphmetic operation:

```
1 + 2 * 3 - 4
```

We know that the multiplication is evaluated before the addition or substraction. One way to visualize that precedence is using a tree. Leaf nodes are numbers, and interior nodes are operators with branches for each of their operands. The higher the precedence of an operation the closer the operation is to the bottom of the tree. The less the precedence - the closer it's to the top.

So it intuitively seems like a workable representation of our code is a tree that matches the grammatical structure — the operator nesting — of the language.

So, indeed the most appropriate representation of the code for the interpreter to run is the tree.

## Everything starts from the Formal Grammar

To understand how to split something on structuring blocks, pieces, we should know the laws or the rules of how these pieces are connected with each other. This is the something, that is described by grammar. Knowing these rules, we can split the source string on the pieces and combine them in the shape of a tree to make it readable (interpreatable) for interpreters.

To formulate these rules we need to have some syntax for them. The source code of a program can be represented with an infinite amount of expressions. According to this we need some tool that will allow us to describe potentially infinite amount of valid strings. In other words we need the way to describe potentially infinite amount of strings, using finite amount of these strings. It sounds like we need some recursion. Or we need the tool, that allows to describe infinite amount of expressions, using recursion. We can do it, using Context-Free Grammar.

In formal language theory, a context-free grammar (CFG) is a formal grammar whose production rules are of the form

```
A => b
```

with A as a single nonterminal symbol, and b as a string of terminals and/or nonterminals b  can be empty. A formal grammar is "context free" if its production rules can be applied regardless of the context of a nonterminal. No matter which symbols surround it, the single nonterminal on the left hand side can always be replaced by the right hand side. This is what distinguishes it from a context-sensitive grammar.
   
In computing, we use formal languages - programming languages, query languages, markup languages, protocols, config formats, etc. 
Using them, we define what we want the computer to do.

Formal grammars, on the other hand, are used to define the languages themselves. 
For every formal language, we have a corresponding grammar (usually context-free) that defines its structure.

To parse any program, any language we need the grammar. Everything starts from grammar. Grammar is the set of rules
the language works. It's not possible to parse the language without knowing the grammar.

If you know the grammar you can turn it into the programm.

A formal grammar is a powerful tool for describing and analyzing languages. It is a set of rules by which valid sentences in a language are constructed. It provides for us syntax to describe all these rules. Let's be honest these rules are pretty advanced. And, if you see this grammar the first time the big probaility it will be hard for you to understand it. However through the time, through repetitions it becomes easier. It just takes some time.

It would be much easier to explain it what it is and how to use and read it if we start straight with the example.

Every language has a grammar. Programming languages have grammar as well as the languages we use in our daily communication - English, Russian and etc.
To better understand the meaning of the grammar, let's define a trivial example of English grammar:

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

`Terminal` - an actual word in a language; these are the symbols in a grammar that cannot be replaced by anything else. "terminal" is supposed to conjure up the idea that it is a dead-end—no further expansion is possible.

`Production` - a grammar rule that describes how to replace/exchange symbols. The general form of a production for a nonterminal is:

```
X –>Y1Y2Y3...Yn
```

The nonterminal X is declared equivalent to the concatenation of the symbols Y1Y2Y3...Yn. The production means that anywhere where we encounter X, we may replace it by the string Y1Y2Y3...Yn. Eventually we will have a string containing nothing that can be expanded further, i.e., it will consist of only terminals. Such a string is called a sentence. In the context of programming languages, a sentence is a syntactically correct and complete program.

`Derivation`

A sequence of applications of the rules of a grammar that produces a finished string of terminals. A leftmost derivation is where we always substitute for the leftmost nonterminal as we apply the rules (we can similarly define a rightmost derivation). A derivation is also called a parse.

`Start symbol`

A grammar has a single nonterminal (the start symbol) from which all sentences derive: 

```
S –> X1X2X3...Xn
```

All sentences are derived from S by successive replacement using the productions of the grammar.

`null symbol ε (epsilon)`

It is sometimes useful to specify that a symbol can be replaced by nothing at all. To indicate this, we use the null symbol ε, e.g., A –> B | ε.

`BNF`

A way of specifying programming languages using formal grammars and production rules with a particular form of notation (Backus-Naur form). 

It was the first notation, that was used to specify programming languages (ALGOL 58 in particular). This notation has some pros and cons. Through the time this notation is modified by many people, who try to create more appropriation, flexible notation for them. So, nearly everyone uses some flavor of BNF, tweaked to their own tastes.

## Formal Grammar is the schema/plan of the future program

If you know the grammar you can turn it into the programm.

Grammar consists of non-terminals and terminals.
non-terminals are variables in the grammar. To read the grammar (deriviate it) you should substitute one non-terminal (variable) with another.
terminals are simple plain values, literals, like strings, numbers, booleans.

So, for each non-terminal there's an appropriate variable or the method in the parsing programm (or just parser).

To build the parser for the language you should convert the grammar of the language to it's programm analogue (programming implementation).

If the non-terminal depends on some other non-terminals - it means, that in the programm we'll have a function that will depend on other function 
calls. For non-terminals we create the appropriate methods.

When we execute the parser non-terminal methods call each other. The method, related to the first production rule, calls
an appropriate method, related to the second production rule, the method, related to the second production rule, calls an 
appropriate method for the third production rule and etc - deriviation (parsing) in an action. The later the method is called the earlier it returns. So, the non-terminals from the grammar are expanded starting from the bottom - the last formal grammar rule.

If you get a string and a parser, based on grammar and run parser on the string (parse the string) you'll get answers on two questions:
- does this string belongs to the language, described by grammar;
- what is the structure of the string with regard to the grammar.

## Different types of grammar

To build the grammar there're a lot of different notations (languages to describe the grammar): BNF, EBNF and etc.

There're different types of grammar (category of grammar). Each type(category) has it's own capabilities.

Regular grammar can describe only simple strings, set of strings. This is the same, that RegExp can do. By the way we can say, that RegExp is 
one of the possible notations of the grammar for the set of strings.

Context-free grammar is more advanced grammar. This is the grammar, that we use to describe the programming languages. To describe the RegExp language
we also use the context-free grammar.

## One more big example of production rules deriviation

```
sentense => <sentense> and <sentense> 
| <subject> <verb-phrase> <adjective> <object> 
| <subject> <verb-phrase> <object>;

subject => This | Computers | I;

verb-phrase => <adverb> <verb> | <verb>;

adverb => quickly;

verb => run | is | am | love | finish;

adjective = ginger | beautiful | delicious;

object => the <noun> | a <noun> | <noun>;

noun => world | juice | breakfast;
```

It's important to point out, that there is no one correct way of writing grammar. There are different possible notations, syntaxes of the grammar (languages to describe the grammar): BNF, EBNF and etc. Everybody tries to come up to some solution, that suits there needs most of all.

The notation that is chosen by us can be described the next way:

- terminals are shown as quoted strings:

- lowercased words without quotes are used to show nonterminals;

- each rule has a name. It's the nonterminal, that located on the left side from the arrow "=>". You can look at these nonterminals as on the variables;

- the sequence of symbols on the right hand side of the arrow is the body of the production rule. It can consist of one or more terminals and/or nonterminals. Also it can contain epsilon symbol, which means  that nonterminal can be replaced by nothing.

- the sequence of symbols can be splitted by "|" symbol on multiple parts. It means that the nonterminal on the left hand side can be represented by one of the parts the production rule body is splitted on. In other words it works the same way the "or" operator works.

- each production rule ends up with a semicolon;

One more time, there are a lot of different variants of the grammar notation. The one I chose looks like it is easy to write it and at the same time to understand.

What we are doing here is actually pretty funny thing - we are defining grammar of the notation for grammar we use to declare the language.

The grammar we'll start using will be modified or improved afterwards to even more readable and understandable and at the same time more concise.

Using this grammar we can generate random sentenses. Let's try to deriviate result sentense, using provided grammar.

The deriviation always starts from the very first rule from the top.  This first nonterminal in the very top is called "starting symbol". The starting symbol in our example is the nonterminal which is called "sentense". So, our goal during deriviation is to get expanded fully "sentense" nonterminal.

So, we're starting with the rule:

```
sentence => sentence and sentence 
| <subject> <verb-phrase> <adjective> <object> 
| <subject> <verb-phrase> <object>;
```

The "sentence" nonterminal on the left hand side will contain the result deriviated sentence. This is the difference of the first nonterminal from the nonterminals below, which are used to expand nonterminals, located above.

The "sentence" nonterminal recursively refers back to the "sentence" nonterminal. This is actually the most important aspect of the context-free grammar. The possibility to recursively refer back to itself is something that distinguishes context-free grammar from regular language grammar. And this is exactly the thing that allows us to describe by finite amount of rules potentially infinite amount of sentences. We can be sure, that if the same nonterminals are on the both sides of the production rule, then the language is 100% non-regular. It doesn't guarantee that it's context-free language, but definitely not the regular one.

One more thing before we start the deriviation - there are different ways to deriviate the grammar:

- leftmost - starting from the left most symbol and moving to the right side symbol after symbol till the last one;

- rightmost - the way of the deriviation opposite to the leftmost. Deriviation starts from the right most symbol and moves to the left side of the body of the rule, expanding according to the below rules each and every symbol, one by one.

So, let's start generating the sentence.

The first production rule tells us, that "sentence" can be represented either by one "sentence" or by two "sentence"s, splitted by the "and" connector.

Also it tells us, that sentence can be replaced by one of the next structures (sentence structures)

either:

`<subject> <verb-phrase> <adjective> <object>`

or:

`<subject> <verb-phrase> <object>`

Here we can see the declaration of very well known rules we know about from the school:

Every sentence (if it is not the question) starts with the "subject" followed by "verb-phrase" (we'll take a look at the definition of the "verb-phrase" further) followed by optional adjective followed by object. Why have I said that the adjective is optional? It is because in the first declaration, before the "|" character, we have an "adjective" and in the second declaration there is no "adjective". The structure is the same as in the first case, but without the "adjective".

These are very well known rules defining simple sentences.

Let's go further - the next production declares "verb-phrase" nonterminal. Very simple one. As we can see from the declaration rules this nonterminal can be represented by either verb or by adjective + verb. This is why it is called as "verb-phrase" - it can be represented not only by verb but also has an optional adverb.

The declaration fot the "adverb" has only one teminal. Very simple.

There are four options for the verb nonterminal: "is", "love", "am", "run".

"adjective" can be represented by either "ginger" or "beatiful" terminals. Very simple as well.

"object" is represented by either:
- noun without articles;
- noun with "the" article;
- noun with "a" article.

And speaking about the "noun" nonterminal, it can be represented in the result sentence by either "world" or "juice".

Let's derive a sentence from the provided grammar. We start from the very top production rule and go from left to right.

1. Let's choose at first more complex path (or branch) for the first production rule. On this step the derived sentence will look like:

`sentense => sentense and sentense`

2. This rule recursively refers to itself and we could continue recursively expanding this rule. This is the power of recursion, that allows us to generate potentially infinite sentences.  But I don't want to go too far. It's absolutely unnecessary in our case, cause our main goal is to get familiar with all this stuff, to understand the basis. And after that, everything becomes much simpler. And you'll be able to generate any complex sentence by yourself.

2. If not recursive deriviation, there are two possible options of how we can deriviate. Let's use for the first "sentence" on the right hand side first option and for the second nonterminal - second option.

The deriviated "sentence" on this step will look like:

`sentense => <subject> <verb-phrase> <adjective> <object> and <subject> <verb-phrase> <object>;`

3. Ok, now parts before the "and" and after the "and" look almost the same.


4. Following the same methodology I've just showed you, I'll do all further deriviations under the hood. I guess it's a very trivial process, so I won't loose the time here explaining all further deriviations.

`sentense => I quickly finish delicious breakfast and I love the world`

## Symbols, alphabets and languages

Let's talk about some new definitions important for further deep dive into the topic.

### Symbol

A character, glyph, mark. An abstract entity that has no meaning by itself, often called uninterpreted. Letters from various alphabets, digits and special characters are the most commonly used symbols.

### Alphabet

Alphabet is usually denoted by greek letter Σ

The alphabet for the provided above grammar is:

```
Σ = { a, b, c }
```

In our case an alphabet Σ consists of three symbols - a, b and c. 

### String

A finite sequence of symbols from an alphabet is called string.

Example of the string for the alphabet provided above is "aabbccbbaa".

### Language

Language is a set of strings from an alphabet.

The set maybe empty, finite or infinite.

```
L1(Σ) = { aabc, bbc, cb, ac, ... }
```
The language L1 for the alphabet Σ is called infinite, cause it consists of all possible combinations of a, b, c symbols of any lengths. This language don't have any restrictions in terms of lenght of the strings and the order of characters.

On the other hand the language L2(Σ) is finite, cause the maximum lenght of each string of this language maximum consists of 3 characters. So, applying restriction on the language (length of any string is 3 characters maximum), we can make finite language.

```
L2(Σ) = { abc, aac, bbc, acc, ... }
```

The main takeaway here - once we start applying restrictins to the language - we form the grammar of the language. So, the grammar is a set of restrictions on the top of the alphabet for the specific language.

