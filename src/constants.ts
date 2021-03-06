export const META_CHARS = ["?", "*", "+", "."];

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
  PIPE = "Pipe",
  EOF = "End Of File"
}

export enum NodeType {
  ALTERNATIVE = "Alternative",
  PATTERN = "Pattern",
  DISJUNCTION = "Disjunction",
  REG_EXPR = "RegExpr"
}

export const DEFAULT_FLAGS = {
  ignoreCase: false,
  global: false,
  dotAll: false,
  multiline: false,
  sticky: false,
  unicode: false
};
