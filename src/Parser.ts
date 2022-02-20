import { NodeType, TokenType } from "./constants";
import { DEFAULT_FLAGS } from "./constants";
import { Tokenizer } from "./Tokenizer";
import { Alternative, Disjunction, Pattern, RegExpr } from "./types";

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
 * The starting Expression nonterminal plays role of a variable,
 *   that stores the result of parsing of the Letter or the Digit.
 *   In the result AST the Expression is presented with the root object.
 *
 *   {
 *     type: 'RegExp',
 *     expressions: ...,
 *   }
 *
 *   This Letter and Digit nonterminals are represented in the program as
 *     two functions. The funciton, related to the Letter nonterminal
 *     returns node of an AST tree, related to the letter character
 *     and the function, related to the Digit nonterminal - node,
 *     related to the digit character.
 *
 *     The thing is we don't need to distinguish the Letter and the Digit
 *     into the result AST tree. So, the node for both types of characters
 *       will be the same - RegularCharacter and will look like that:
 *
 *     {
 *       type: "RegularCharacter",
 *       value: // letter or number character,
 *     }
 *
 *
 *
 * After that it will look like:
 *
 * Expression:       RegularCharacter;
 * RegularCharacter: Letter | Digit | Underscore;
 *
 *
 * Next iteration:
 *
 * Expression:       RegularCharacter;
 * RegularCharacter: Letter | Digit | Underscore | Space;
 *
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
 * Next:
 *
 * Expression: Atom | Expression Atom;
 * Atom: Character | .;
 * Character: GeneralCharacter | Slash AnyCharacter;
 * GeneralCharacter: Letter | Digit | Underscore | Space;
 * AnyCharacter: GeneralCharacter | NonGeneralCharacter;
 * Slash: "\"
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
  private lookahead: { type: TokenType; value: string | null; index: number };

  /**
   * Each nonterminal knows,
   *   what next nonterminal should be executed
   *   based on the current token.
   *
   */
  private RegExpr(): RegExpr {
    return {
      type: NodeType.REG_EXPR,
      value: this.Pattern(),
      flags: this.Flags()
    };
  }

  private getFlags(flags, addedFlags) {
    if (this.lookahead.type === TokenType.EOF) {
      return flags;
    }

    const currentToken = this.consume(TokenType.LETTER);

    if (addedFlags.has(currentToken.value)) {
      throw Error(`Duplicated flag "${currentToken.value}" is not allowed.`);
    }

    addedFlags.add(currentToken.value);

    switch (currentToken.value) {
      case "i":
        flags.ignoreCase = true;
        break;

      case "g":
        flags.global = true;
        break;

      case "s":
        flags.dotAll = true;
        break;

      case "m":
        flags.multiline = true;
        break;

      case "y":
        flags.sticky = true;
        break;

      case "u":
        flags.unicode = true;
        break;

      default:
        throw Error(`Invalid flag "${currentToken.value}" is detected.`);
    }

    return flags;
  }

  private Flags() {
    let flags = DEFAULT_FLAGS;
    const addedFlags = new Set();

    do {
      flags = this.getFlags(flags, addedFlags);
    } while (this.lookahead.type !== TokenType.EOF);

    return flags;
  }

  private EscapedCharacter() {
    this.consume(TokenType.BACK_SLASH);

    if (!this.lookahead) {
      throw new Error("Expect character after the \\");
    }

    return this.RegularCharacter(this.lookahead.type);
  }

  /**
   * Consumes the current token,
   *   moves to the next token,
   *   returns the current token.
   *
   */
  private RegularCharacter(characterType) {
    const token = this.consume(characterType);

    return {
      type: "RegularCharacter",
      value: token.value
    };
  }

  private Character() {
    /**
     * The next character routes
     *   the parsing direction.
     *
     */
    switch (this.lookahead.type) {
      case TokenType.BACK_SLASH:
        return this.EscapedCharacter();

      case TokenType.LETTER:
      case TokenType.DIGIT:
      case TokenType.UNDERSCORE:
      case TokenType.SPACE:
        return this.RegularCharacter(this.lookahead.type);

      case TokenType.DOT:
        return this.MetaCharacter(this.lookahead.type);

      default:
        return null;
    }
  }

  private MetaCharacter(characterType) {
    const token = this.consume(characterType);

    return {
      type: "MetaCharacter",
      value: token.value
    };
  }

  private Characters() {
    const characters = [];

    /**
     * The SLASH character means, that we reached the end of the RegExp,
     *   so we stop iterating here.
     *
     * The PIPE character means, that we reached the edge of the Alternative.
     *   we need to stop interating and to enter the next Alternative.
     *
     */
    do {
      characters.push(this.Character());
    } while (
      this.lookahead &&
      this.lookahead.type !== TokenType.PIPE &&
      this.lookahead.type !== TokenType.SLASH
    );

    if (this.lookahead && this.lookahead.type === TokenType.PIPE) {
      this.consume(TokenType.PIPE);
    }

    return characters;
  }

  private Pattern(): Pattern {
    return {
      type: NodeType.PATTERN,
      value: this.Disjunction()
    };
  }

  private Alternatives(): Alternative[] {
    const alternatives = [];

    do {
      alternatives.push(this.Alternative());
    } while (this.lookahead && this.lookahead.type !== TokenType.SLASH);

    this.consume(TokenType.SLASH);

    return alternatives;
  }

  private Alternative(): Alternative {
    return {
      type: NodeType.ALTERNATIVE,
      value: this.Characters()
    };
  }

  private Disjunction(): Disjunction {
    return {
      type: NodeType.DISJUNCTION,
      value: this.Alternatives()
    };
  }

  private processUnknownCharacter() {
    if (this.lookahead && this.lookahead.type === TokenType.UNKNOWN) {
      throw new Error("Can't process the unknown character");
    }
  }

  /**
   * Expects the token of a given type.
   *
   */
  private consume(tokenType: TokenType) {
    const nextToken = this.lookahead;

    if (nextToken.type === TokenType.EOF) {
      throw new Error(
        `Unexpected end of input, expected ${tokenType} instead.`
      );
    }

    if (nextToken.type !== tokenType) {
      throw new Error(
        `Unexpected token ${nextToken.value}, expected ${tokenType} instead.`
      );
    }

    /**
     * After we get next token the previous one
     *   is considered to be consumed, cause we
     *   switched to the next one.
     */
    this.lookahead = this.tokenizer.getNextToken();

    this.processUnknownCharacter();

    return nextToken;
  }

  constructor() {
    this.tokenizer = new Tokenizer();
  }

  public parse(regExpString: string) {
    this.tokenizer.init(regExpString);

    this.lookahead = this.tokenizer.getNextToken();

    this.consume(TokenType.SLASH);

    return this.RegExpr();
  }
}
