# Tokenizer

## What is tokenizer?

A tokenizer transforms a sequence of characters into a sequence of tokens.

Tokenizers are also known as scanners or lexers. Tokenizers play a role in parsing, because they transform the initial input into a form that is more manageable by the proper parser, which works at a later stage. Typically tokenizers are easier to write than parsers. Although there are special cases when both are quite complicated, for instance in the case of C.

## What is token?

Token is an object, that describes every important structuring block of the original input string. So, the main information here is that it's an object, that has some properties, which describe every structuring block of the input string.

What kind of properties the token has?

### Lexemes

Let's take a close look to the next example:

```typescript
var language = "some string";
```

Here, "var" is the keyword for declaring a variable. That three-character sequence “v-a-r” means something. But if we yank three letters out of the middle of language, like “g-u-a”, those don’t mean anything on their own.

That’s what lexical analysis is about. Our job is to scan through the list of characters and group them together into the smallest sequences that still represent something. Each of these blobs of characters is called a **lexeme**. In that example line of code, the lexemes are:

**var**, **language**, **=**, **"some string"**.

The **lexemes** are only the raw substrings of the source code. However, in the process of grouping character sequences into lexemes, we also stumble upon some other useful information.

Usually we use **value** property to store **lexemes** in the result **token** object.

### Token types

The parser ofthen has code like if the next token is this to that, if it's that do this.
The parser could recognize tokens from the raw lexemes by comparing the strings, but that’s slow and kind of ugly. Instead, at the point that we recognize a lexeme, we also remember which **kind** of lexeme it represents. We store this information usually into the **type** property and call token type.

### Location information

The location information defines the position of the lexemes in the source code. It can represented by **line** and **column** coordinates for the beginning and for the end of the lexemes; or by **line**, **column** and the **length** properties for each lexeme. Such type of data can be very useful in case we report error message for the end user of the code and point out the precise location of an error.

## RegExp token

Our tokenizer emits tokens with **value**, **type** and **index** properties. Each token or the tokenizer holds one length character. It could be made differently. For example, we could represent character classes like **\d**, **\w** and etc. with one token. But still, we decided to split regexp string on every character, cause we believe it will add an additional flexibility for the parser to work with the produced tokens.

The **value** property of the token contains the **lexeme**, which is one single character in our case.

The **type** property contains the kind of the character. We create it as enum and it looks like this:

```typescript
export enum TokenType {                                                                                               
  SLASH = "Slash",                                                                                                    
  LETTER = "Letter",                                                                                                  
  DOT = "Dot",                                                                                                        
  DIGIT = "Digit",                                                                                                    
  SPACE = "Space",                                                                                                    
  UNDERSCORE = "Underscore",                                                                                          
  REGULAR = "Regular",                                                                                                
  UNKNOWN = "Unknown",                                                                                                
  STAR = "Star",                                                                                                      
  BACK_SLASH = "Back Slash",                                                                                          
  QUESTION_MARK = "Question Mark",                                                                                    
  PLUS = "Plus",                                                                                                      
  LEFT_BRACKET = "Left Bracket",                                                                                      
  RIGHT_BRACKET = "Right Bracket",                                                                                    
  CARET = "Caret",                                                                                                    
  PIPE = 'Pipe'                                                                                                       
}
```
The **index** property contains the order index of each character in the regexp string. It's the only location information we need to detect the position of the token in the original input string.
