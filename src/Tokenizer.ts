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
  private consume(character) {
    if (this.peek() !== character) {
      throw new Error(`Unexpected character ${character}`);
    }

    /**
     * After we increase the counter the previous
     *   character is considered to be consumed,
     *   cause we switched to the next one.
     *
     */
    this.counter++;
  }

  // private isMetaCharacter(character) {
  // return META_CHARS.includes(character);
  // }

  public input;
  public counter;

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
   */
  public hasMoreTokens() {
    return this.counter < this.input.length;
  }

  private backSlash() {
    const character = this.peek();

    this.consume(character);

    return {
      type: TokenType.BACK_SLASH,
      value: character
    };
  }

  private letterCharacter() {
    const character = this.peek();

    this.consume(character);

    return {
      type: TokenType.LETTER,
      value: character
    };
  }

  private digitCharacter() {
    const character = this.peek();

    this.consume(character);

    return {
      type: TokenType.DIGIT,
      value: character
    };
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

  private isUnderscoreCharacter(character) {
    return character === "_";
  }

  private isSpaceCharacter(character) {
    return character === " ";
  }

  private underscoreCharacter() {
    this.consume("_");

    return {
      type: TokenType.UNDERSCORE,
      value: "_"
    };
  }

  private spaceCharacter() {
    this.consume(" ");

    return {
      type: TokenType.SPACE,
      value: " "
    };
  }

  private uknownCharacter() {
    const character = this.peek();

    return {
      type: TokenType.UNKNOWN,
      value: character
    };
  }

  private starCharacter() {
    this.consume("*");

    return {
      type: TokenType.STAR,
      value: "*"
    };
  }

  private questionMarkCharacter() {
    this.consume("?");

    return {
      type: TokenType.QUESTION_MARK,
      value: "?"
    };
  }

  private plusCharacter() {
    this.consume("+");

    return {
      type: TokenType.PLUS,
      value: "+"
    };
  }

  private leftBracketCharacter() {
    this.consume("(");

    return {
      type: TokenType.LEFT_BRACKET,
      value: "("
    };
  }

  private rightBracketCharacter() {
    this.consume(")");

    return {
      type: TokenType.RIGHT_BRACKET,
      value: ")"
    };
  }

  private metaCharacter() {
    const nextCharacter = this.peek();

    if (nextCharacter === "*") {
      return this.starCharacter();
    }

    if (nextCharacter === "?") {
      return this.questionMarkCharacter();
    }

    if (nextCharacter === "+") {
      return this.plusCharacter();
    }
  }

  /**
   * Obtains the next token.
   *
   */
  public getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const nextCharacter = this.peek();

    if (this.isLetterCharacter(nextCharacter)) {
      return this.letterCharacter();
    }

    if (this.isDigitCharacter(nextCharacter)) {
      return this.digitCharacter();
    }

    if (this.isUnderscoreCharacter(nextCharacter)) {
      return this.underscoreCharacter();
    }

    if (this.isSpaceCharacter(nextCharacter)) {
      return this.spaceCharacter();
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
    if (nextCharacter === "\\") {
      return this.backSlash();
    }

    if (META_CHARS.includes(nextCharacter)) {
      return this.metaCharacter();
    }

    if (nextCharacter === "(") {
      return this.leftBracketCharacter();
    }

    if (nextCharacter === ")") {
      return this.rightBracketCharacter();
    }

    return this.uknownCharacter();
  }
}
