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

The Token class for the tokenizer can be found here: https://github.com/j-u-p-iter/regexp-parser/blob/main/src/Token.ts

## Main tokenizer methods and properties

In short the principle of scanner work can be explained as the process of consuming the characters in a loop one by one, combining them into the lexemes and returning them in form of tokens - objects, that describes lexemes as independent structuring block of the input string.

The best way to understand what it means is to imagine the input string and the charet underneath of the first symbol of the string. The caret points out to the first symbol of the string. This symbol is called the current character. If we consume this character we return it from the appropriate method, responsible for characters consuming and move the caret to the next character of the string. Consuming of the character can be explained in another way as removing the character from the string. We consumed it, means we used it and we lost any connections with this character and we won't be able to operate by this character somehow and anyhow further in the parser code.

### input property

This property is used to store the original input string we are going to parse. It's not mutable property. It will always stay as it is.

### counter property

This property is used to point out to the current active character. The current character is the character the caret points out in each concrete moment until the character is consumed.

### hasMoreCharacters method

This simple helper is used to detect are there any other characters to extract into the tokens. If it false it means that all characters of the input string were consumed. If it's true, there are more characters to consume.

### consume method

This is the most widely used method. It's goal is to consume the current character and return it. When we consume the character we return the current character the caret (counter) points out for the input string and move caret to the next character.


### peak method

This method is similar to the consume method but it doesn't consume the character. It just returns the current character the counter points out at the exact point of time. This method has a special name. It's called **lookahead** Since it only looks at the current unconsumed character, we have one character of lookahead. The smaller this number is, generraly, the faster the scanner runs. The rules of the lexical grammar dictate how much lookahead we need. Fortunately, most languages in wide use peek only one or two characters ahead. In our regexp tokenizer we won't use peak method at all, cause each lexeme in our case consists only of one character. In this simple case it's enough just consume characters straightaway.


### createToken method

Method is used to create the tokens. It uses special Token class for that.

What it does is:
1. peeks the current character from the input string, calling the **peek** method. If this is the end of the string the `EOF` token will be created with `null` value as the token value.
2. consumes the current character from the input string for all tokens except EOF or UNKNOWN.
3. returns the character.
