import { TokenType } from "./constants";
import { Tokenizer } from "./Tokenizer";
/**
 * At first the programm will look like:
 * Expression:
 *   Letter;
 *
 * After it will look like:
 *
 * Expression:
 *   Letter
 *   | Digit;
 *
 * After that it will look like:
 *
 * Expression:       GeneralCharacter;
 * GeneralCharacter: Letter | Digit | Underscore;
 *
 *
 * Next iteration:
 *
 * Expression:       GeneralCharacter;
 * GeneralCharacter: Letter | Digit | Underscore | Space;
 *
 * Next iteration:
 *
 * Expression: GeneralCharacter | Slash AnyCharacter
 * GeneralCharacter: Letter | Digit | Underscore | Space;
 * AnyCharacter: .+;
 * Slash: "\"
 *
 *
 * Next:
 *
 * Expression: Character | Expression Character;
 * Character: GeneralCharacter | Slash AnyCharacter;
 * GeneralCharacter: Letter | Digit | Underscore | Space;
 * AnyCharacter: .+;
 * Slash: "\"
 *
 * Next: ...
 */
export class Parser {
  private tokenizer: Tokenizer;
  private lookahead: { type: TokenType; value: string };

  /**
   * Each nonterminal knows,
   *   what next nonterminal should be executed
   *   based on the current token.
   *
   */
  private RegExpr() {
    return {
      type: "RegExp",
      body: this.Letter()
    };
  }

  private Letter() {
    const token = this.consume(TokenType.LETTER);

    return {
      type: "Letter",
      value: token.value
    };
  }

  /**
   * Expects the token of a given type.
   *
   */
  private consume(tokenType: TokenType) {
    const nextToken = this.lookahead;

    if (nextToken === null) {
      throw Error(`Unexpected end of input, expected ${tokenType} instead.`);
    }

    if (nextToken.type !== tokenType) {
      throw Error(
        `Unexpected token ${nextToken.value}, expected ${tokenType} instead.`
      );
    }

    /**
     * After we get next token the previous one
     *   is considered to be consumed, cause we
     *   switched to the next one.
     */
    this.lookahead = this.tokenizer.getNextToken();

    return nextToken;
  }

  constructor() {
    this.tokenizer = new Tokenizer();
  }

  public parse(regExpString: string) {
    this.tokenizer.init(regExpString);

    this.lookahead = this.tokenizer.getNextToken();

    return this.RegExpr();
  }
}
