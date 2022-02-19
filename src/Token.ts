import { TokenType } from "./constants";

export class Token {
  public type: TokenType;
  public value: string;
  public index: number;

  constructor(type, value, index) {
    this.type = type;
    this.value = value;
    this.index = index;
  }
}
