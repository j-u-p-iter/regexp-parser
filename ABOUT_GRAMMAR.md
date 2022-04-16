ABOUT GRAMMAR

```
sentense => sentense and sentense 
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

It's important to point out, that there is no one correct way of writing grammar. There are different possible notations, syntaxes of the grammar. Everybody tries to come up to some solution, that suits there needs most of all.

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
