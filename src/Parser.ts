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
 * AnyCharacter: GeneralCharacter | NonGeneralCharacter;
 * Slash: "\"
 *
 * Next: ...
 */

/**
 * Each nonterminal in the grammar has an appropriate method
 *   in the Parser. Each nonterminal knows, that:
 *
 *   - it should throw an error if the consuming (current character)
 *     is not the one, that expected to consume.
 *
 *   - it should return either terminal (token, related to the terminal), if the nonterminal
 *     maps to the terminal.
 *
 *   - or it should return the result of the nonterminal call (token, related to the nonterminal).
 *     The called nonterminal decides by itself what it should return according to the grammar.
 *
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
      body: this.Body()
    };
  }

  private hasMoreTokens() {
    return this.tokenizer.hasMoreTokens();
  }

  private EscapedCharacter() {
    this.consume(TokenType.BACK_SLASH);

    if (!this.hasMoreTokens()) {
      throw new Error("Expect character after the \\");
    }

    return this.RegularCharacter(this.lookahead.type);
  }

  private RegularCharacter(characterType) {
    const token = this.consume(characterType);

    return {
      type: "RegularCharacter",
      value: token.value
    };
  }

  private Body() {
    switch (this.lookahead.type) {
      case TokenType.LETTER:
      case TokenType.DIGIT:
      case TokenType.UNDERSCORE:
      case TokenType.SPACE:
        return this.RegularCharacter(this.lookahead.type);
      case TokenType.BACK_SLASH:
        return this.EscapedCharacter();
      default:
        return null;
    }
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
