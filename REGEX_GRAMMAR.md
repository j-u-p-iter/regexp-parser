# Regex Grammar

## Two ways to write grammar

There're two possible ways to write the grammar:
  - bottom-up;
  - top-bottom.


In the top-bottom case we start with the most general rules (non-terminals and production rules) and go down, adding production rules for the non-terminals from the above rules.

In the bottom-up case we start with the simplest cases - simple terminals and non-terminals. After that we go to the top, combining previously declared terminals and non-terminals and adding new ones, formulating more general and complex production rules.

## BOTTOM-UP approach

Not only in case of grammar but everywhere I prefer to always start with the simplest solution. And after that, expand it with more complex one till I reach desiarable solution.

So, my favorite is the bottom-up approach. This is the approach we'll be using writing grammar.

## Start with the simple solution, finish with the simple solution and iterate gradually.

It will be very hard to write the whole grammar of the RegExp before starting implementing the parser. In this case it will take a lot of time till we even start writing parser. And I'm pretty sure sticking to this approach we'll find a lot of mistakes in the grammar declaration and will have to rewrite the grammar writing the parser itself. So, in many ways and according to many reasons this is very confusing and hard way of doing things.

Instead we need to start with something simple. We need to declare an initial state of our grammar, write parser for that and after that add gradually new elements of the grammar, make it more complex and advance.

## Everything starts with the starting symbol.

Every grammar should contain:
- starting symbol;
- production rule;
- terminal;
- non-terminal.

Despite the fact that starting symbol sits on the very top of the grammr and we'll be using the bottom-up approach, we always will be using the starting symbol. Starting symbol is here everywhere. No starting symbol - no grammar. At first starting symbol we'll contain the most simple rule. On the next step the starting symbol we'll be shifted one step up and the declaration of the starting symbol we'll be extracted into new non-terminal under the starting symbol declaration and the starting symbol will contain new, more complex production rule.

So, one more time, the precedense of the steps that should be implemented is:
- add starting symbol with the simple production rule;
- extract simple production rule into new non-terminal and place it below the starting symbol declaration;
- add for the starting symbol new declaration, using the non-terminal, introduced on the previous step.

## Writing the grammar.

We'll start with the very light version of the grammar.


