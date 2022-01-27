export type Alternative = any;

export interface Disjunction {
  type: "Disjunction";
  value: Alternative;
}

export interface Pattern {
  type: "Pattern";
  value: Disjunction;
}

export interface RegExpr {
  type: "RegExpr";
  value: Pattern;
  flags: {
    ignoreCase: boolean;
  };
}
