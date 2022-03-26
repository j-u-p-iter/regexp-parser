# Formal Grammar

## Syntax as one of the major components of grammar.

In linguistics, "syntax" refers to the rules that govern the ways in which words combine to form phrases, clauses, and sentences. The term "syntax" comes from the Greek, meaning "arrange together." In computer contexts, the term refers to the proper ordering of symbols and codes so that the computer can understand what instructions are telling it to do.

Syntax is one of the major components of grammar. It's the concept that enables people to know how to start a question with a question word ("What is that?"), or that adjectives generally come before the nouns they describe ("green chair"), subjects often come before verbs in non-question sentences ("She jogged"), prepositional phrases start with prepositions ("to the store"), helping verbs come before main verbs ("can go" or "will do"), and so on.

English parts of speech often follow ordering patterns in sentences and clauses:
- compound sentences are joined by conjunctions (and, but, or);
- multiple adjectives modifying the same noun follow a particular order according to their class (such as number-size-color, as in "six small green chairs");
- sentences often start with a subject, followed by a predicate (or just a verb in the simplest sentences) and contain an object or a complement (or both), which shows, for example, what's being acted upon.
The rules of how to order words help the language parts make sense.

In other words we can say, that speaking about grammar of the language we first of all speak about syntax of this language.

## Formal Grammar

Speaking about parsing we are interested into two kinds of formal grammar:
  - lexical grammar;
  - syntatic grammar.

### Lexical Grammar
Lexical grammar is the formal grammar that defines the syntax of tokens.

Each string has a lexical structure. It means that it is structured or constructed of units/items, described by rules of lexical grammar. Such types of units are called tokens. Tokens are characterised by two main parameters - type and value. The token type (or token name) is a category of lexical unit. Common token names are - identifier, keyword, separator, operator, literal, comment. Tokens has an object structure, they have some set of properties, that describe the token. The value of the token is called lexeme, which is the set of characters, that is described by the token (object with some properties). A lexeme is a sequence of characters in the source program that matches the pattern for a token. In other words lexeme is a string representation of a token. Token is an object, that fully describes lexeme - the category lexeme belongs to; the position of a lexeme into the source string; the actual lexeme value.

For instance, the lexical grammar for many programming languages specifies that a string literal starts with a " character and continues until a matching " is found (escaping makes this more complicated), that an identifier is an alphanumeric sequence (letters and digits, usually also allowing underscores, and disallowing initial digits), and that an integer literal is a sequence of digits. 

In other words lexical grammar is the rules about how separate characters get grouped into the tokens, or better say lexemes (tokens and lexemes are often used interchangeably; but they differs a lot).

Lexical analysis, lexing or tokenization is the process of converting a sequence of characters (such as in a computer program or web page) into a sequence of tokens (strings with an assigned and thus identified meaning). Lexical analysis extracts tokens from the source string. A program that performs lexical analysis may be termed a lexer, tokenizer, or scanner, although scanner is also a term for the first stage of a lexer. A lexer is generally combined with a parser, which together analyze the syntax of programming languages, web pages, and so forth.

All lexemes of this/that language can be described by regular expressions. It means that we can use regular expressions to split all source strings on lexemes. If the language can be described by regular expressions it is called regular language. The rules how lexemes are constructed can be easily described by regular expressions, so these lexemes are related to regular language.

### Syntactic Grammar
Syntactic grammar is another beast. It regulates how tokens (lexemes) or simply words get grouped into sentenses.

So, as we can see the difference between lexical and syntatic grammar is the level of granularity of building blocks (characters vs words) and result structure (lexemes vs sentenses). The rules how to build and respectively validate and parse lexemes are described by lexical grammar. The rules how to build and respectively parse and validate sentenses (expressions) are described by syntatic grammar.


### Again about Formal Grammar

A formal grammar takes a set of atomic pieces it calls its “alphabet”. Then it defines a (usually infinite) set of “strings” that are “in” the grammar. Each string is a sequence of “letters” in the alphabet.

I’m using all those quotes because the terms get a little confusing as you move from lexical to syntactic grammars. In our scanner’s grammar, the alphabet consists of individual characters and the strings are the valid lexemes—roughly “words”. In the syntactic grammar we’re talking about now, we’re at a different level of granularity. Now each “letter” in the alphabet is an entire token and a “string” is a sequence of tokens—an entire expression.
