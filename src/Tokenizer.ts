/**
 * The parser need the tokenizer, cause it does not work
 *   directly on the text, but on the output, produced by the tokenizer.
 *
 *   A tokenizer and parser work in sequence: the tokenizer scans the input
 *   and produces the matching tokens, the parser then scans the tokens and
 *   produces the parsing result.
 *
 *   Let's look at the following simple example and imagine that we're trying
 *   to parse an addition.
 *
 *     437 + 734
 *
 *   The lexer scans the text and finds 4, after that checks the next character
 *   (cause probably it's also a number), finds 3, checks one more character and
 *   finds 7, checks one more character and finds " ". It means, that during the
 *   previous 3 steps the number 437 was found. This way the tokenizer recognize
 *   that the characters 437 constitutes one token of type Number. After that
 *   tokenizer finds plus symbol, which corresponds to a second token of type
 *   Plus and lastly it finds another token of type Number.
 *
 *   As result the tokenizer creates 3 tokens out of the provided above string:
 *
 *   1. { type: "Number", value: "437" }
 *   2. { type: "Plus", value: "+" }
 *   3. { type: "Number", value: "734" }
 *
 *   The Parser after that will take these tokens and group them in form of the AST (abstract syntax tree).
 *
 *   It's important to mention, that the definitions used by tokenizers and parsers
 *   are called rules or productions.
 *
 *   In our example a tokenizer rule will specify that a sequence of digits corresponds to a token of "Number".
 *
 *   While a parser rule will specify that a sequence of tokens of type Number, Plus, Number corresponds to
 *   a SUM expression.
 *
 */

import { META_CHARS, TokenType } from "./constants";
import { Token } from "./Token";

/**
 * Lazily (on demain) pulls a token from a stream.
 *
 */
export class Tokenizer {
  private peek() {
    return this.input[this.counter];
  }

  /**
   * Checks, that the next character is the expected one.
   *   And, if it is like that - increases the counter.
   *   If it's not the expected one - throws an error.
   *
   *   We name this process as the consuming of the character.
   *
   */
  private consume() {
    const nextCharacter = this.peek();

    /**
     * After we increase the counter the previous
     *   character is considered to be consumed,
     *   cause we switched to the next one.
     *
     */
    this.counter++;

    return nextCharacter;
  }

  // store the original regexp in this property
  private input;

  // stores the index of the current
  // non-consumed yet character
  private counter;

  /**
   * Initialization step. The input string
   *   reaches the Tokenizer.
   */
  public init(input) {
    this.input = input;
    this.counter = 0;
  }

  /**
   * Detects, if there are more tokens
   *   to extract from the string.
   *
   *   If there're no tokens anymore, it means
   *     we consume all the characters or
   *     the input string has no characters at all.
   */
  public hasMoreTokens() {
    return this.counter < this.input.length;
  }

  private isLetterCharacter(character) {
    return (
      (character >= "a" && character <= "z") ||
      (character >= "A" && character <= "Z")
    );
  }

  private isDigitCharacter(character) {
    return character >= "0" && character <= "9";
  }

  private createToken(tokenType: TokenType, tokenValue: string | null): Token {
    // consuming character we increment the index.
    // So, we store the index here before consuming the character.
    const currentCharacterIndex = this.counter;

    if (tokenType !== TokenType.EOF && tokenType !== TokenType.UNKNOWN) {
      this.consume();
    }

    return new Token(tokenType, tokenValue, currentCharacterIndex);
  }

  private restCharacters(nextCharacter): Token {
    switch (nextCharacter) {
      case "/":
        return this.createToken(TokenType.SLASH, "/");
      case "\\":
        return this.createToken(TokenType.BACK_SLASH, "\\");
      case "(":
        return this.createToken(TokenType.LEFT_BRACKET, "(");
      case ")":
        return this.createToken(TokenType.RIGHT_BRACKET, ")");
      case "_":
        return this.createToken(TokenType.UNDERSCORE, "_");
      case " ":
        return this.createToken(TokenType.SPACE, " ");
      case "^":
        return this.createToken(TokenType.CARET, "^");
      case "|":
        return this.createToken(TokenType.PIPE, "|");
      default:
        return this.createToken(TokenType.UNKNOWN, nextCharacter);
    }
  }

  private metaCharacter() {
    const nextCharacter = this.peek();

    switch (nextCharacter) {
      case "*":
        return this.createToken(TokenType.STAR, "*");
      case "?":
        return this.createToken(TokenType.QUESTION_MARK, "?");
      case "+":
        return this.createToken(TokenType.PLUS, "+");
      case ".":
        return this.createToken(TokenType.DOT, ".");
    }
  }

  /**
   * Obtains the next token.
   *   We made a decision that the tokenizer will produce
   *   all lexemes as only one single character. It's made
   *   for the flexibility purposes. It will allow to the parser
   *   to handle tokens, group them together into the result
   *   AST nodes and add properties to the appropriate AST nodes
   *   in a more flexible and easy way.
   *
   *   We splitted all characters in multiple groups.
   *
   *     - Meta Characters. They are handled by the metaCharacter method.
   *     - Letters. We don't have specific method for this type. It's handled directly
   *       in the getNextToken method.
   *     - Digits. Again, we don't have a specific method for this type. Handling happens
   *       directly in the getNextToken method.
   *     - Other characters. They are handled by the restCharacters method.
   *
   */
  public getNextToken(): Token {
    if (!this.hasMoreTokens()) {
      /**
       * EOF token indicates end-of-regexp line condition. It means,
       *   that there's nothing else to read from the input string.
       *
       *   To be honest this is not something that is strictly needed.
       *     But it makes the tokenizer and the parser as a whole
       *     a little bit cleaner.
       *
       */
      return this.createToken(TokenType.EOF, null);
    }

    const nextCharacter = this.peek();

    if (this.isLetterCharacter(nextCharacter)) {
      return this.createToken(TokenType.LETTER, nextCharacter);
    }

    if (this.isDigitCharacter(nextCharacter)) {
      return this.createToken(TokenType.DIGIT, nextCharacter);
    }

    /**
     * If the character is prepended by
     *   the slash, we consume every
     *   next character as the regular,
     *   cause it's escaped.
     *   So, escaped meta character, for
     *   example, becomes regular character.
     *
     * Theoretically we could return the slash character a separate
     *   token, but it doesn't make much sense, cause the slash
     *   changes the meening of the next character: either escapes it
     *   or constructs an additional characters class (\w, \n).
     */

    if (META_CHARS.includes(nextCharacter)) {
      return this.metaCharacter();
    }

    return this.restCharacters(nextCharacter);
  }
}
