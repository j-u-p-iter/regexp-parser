Speaking about parsing we are interested into two kinds of formal grammar:
- lexical grammar;
- syntatic grammar.

## Lexical Grammar

Lexical grammar is the formal grammar that defines the syntax of tokens.

Each string has a lexical structure. It means that it is structured or constructed of units/items, described by rules of lexical grammar. Such types of units are called tokens. Tokens are characterised by two main parameters - type and value. The token type (or token name) is a category of lexical unit. Common token names are - identifier, keyword, separator, operator, literal, comment. Tokens has an object structure, they have some set of properties, that describe the token. The value of the token is called lexeme, which is the set of characters, that is described by the token (object with some properties). A lexeme is a sequence of characters in the source program that matches the pattern for a token. In other words lexeme is a string representationof a token. Token is an object, that fully describes lexeme - the category lexeme belongs to; the position of a lexeme into the source string; the actual lexeme value.

For instance, the lexical grammar for many programming languages specifies that a string literal starts with a " character and continues until a matching " is found (escaping makes this more complicated), that an identifier is an alphanumeric sequence (letters and digits, usually also allowing underscores, and disallowing initial digits), and that an integer literal is a sequence of digits. 

In other words lexical grammar is the rules about how separate characters get grouped into the tokens. In other words it is the way to distinguish one word from another.

Lexical analysis, lexing or tokenization is the process of converting a sequence of characters (such as in a computer program or web page) into a sequence of tokens (strings with an assigned and thus identified meaning). Lexical analysis extracts tokens from the source string. A program that performs lexical analysis may be termed a lexer, tokenizer,[1] or scanner, although scanner is also a term for the first stage of a lexer. A lexer is generally combined with a parser, which together analyze the syntax of programming languages, web pages, and so forth.

All lexemes of this/that language can be described by regular expressions. It means that we can use regular expressions to split all source strings on lexemes. If the language can be described by regular expressions it is called regular language. The rules how lexemes are constructed can be easily described by regular expressions, so these lexemes are related to regular language.

## Syntatic Grammar

Syntatic grammar is another beast. It regulates how tokens (lexemes) or simply words get grouped into sentenses.

So, as we can see the difference between lexical and syntatic grammar is the level of granularity of building blocks (characters vs words) and result structure (lexemes vs sentenses). The rules how to build and respectively validate and parse lexemes are described by lexical grammar. The rules how to build and respectively parse and validate sentenses are described by syntatic grammar.

If you have ever studied a foreign language, you know that grammar consists of rules that describe the language. For example, English grammar contains rules like this:

```
Adjective can modify nouns. An adjective can be put before the noun.
```

A formal linguist or a computer scientist would describe this rule using a formal, generative grammar:

```
ModifiedNoun ::= Adjective Noun | Adjective ", " ModifiedNoun
Adjective ::= "fast" | "blue"
Noun ::= "car" | "sky"
```

So, the formal grammar is the scientific approach to formulate syntatic grammar.

But what does it mean for grammar to be generative? You can think of a generative grammar as a recipe for constructing sentences in the language. Let’s see an example. You start with ModifiedNoun – it’s the first symbol on the list. Then you begin substituting:

```
ModifiedNoun // Start
Adjective Noun // Select the first alternative
fast Noun // Substitute Adjective
fast car // Substitute Noun
```

That was easy. What happens if you substitute another noun?

```
fast sky
```

Hmm, this doesn’t make any sense! But this is fine. A grammar does not describe the meaning of the strings or what can be done with them in whatever context—only their form.

The first option of `ModifiedNoun` was simple, but the other one is defined using `ModifiedNoun` itself! This is a recursive symbol. Namely, it is right-recursive because a non-terminal symbol ModifiedNoun appears on the right side.

```
ModifiedNoun // Start
Adjective, ModifiedNoun // Select the second alternative
fast, ModifiedNoun // Substitute Adjective
fast, Adjective Noun // Select the first alternative
fast, blue Noun // Substitute Adjective
fast, blue car // Substitute Noun
```
