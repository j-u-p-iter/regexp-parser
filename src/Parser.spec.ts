import { Parser } from './Parser';
import { NodeType, DEFAULT_FLAGS } from './constants';
import { Disjunction } from './types';

const createRootNode = (
  regExpNodes: Disjunction['value'], 
  flags = { ignoreCase: false },
) => {
  return {
    type: NodeType.REG_EXPR,
    value: {
      type: NodeType.PATTERN,
      value: {
        type: NodeType.DISJUNCTION,
        value: regExpNodes,
      },
    },
    flags,
  }
};

describe('Parser', () => {
  let parser;

  beforeAll(() => {
    parser = new Parser();
  });

  it('parses letters properly', () => {
    expect(parser.parse('/a/')).toEqual(createRootNode([{
      type: "RegularCharacter", 
      value: "a"
    }]));
  });

  it('parses digits properly', () => {
    expect(parser.parse('/1/')).toEqual(createRootNode([{
      type: "RegularCharacter", 
      value: "1"
    }]));
  });

  it('parses underscore properly', () => {
    expect(parser.parse('/_/')).toEqual(createRootNode(
      [{
        type: "RegularCharacter", 
        value: "_"
      }]
    ));
  });

  it('parses space properly', () => {
    expect(parser.parse('/ /')).toEqual(createRootNode(
      [{
        type: "RegularCharacter", 
        value: " "
      }]
    ));
  });

  it('parses escaped character properly', () => {
    expect(parser.parse('/\\^/')).toEqual(createRootNode(
      [{
        type: "RegularCharacter", 
        value: "^"
      }]
    ));
  });
  
  it('parses dot character properly', () => {
    expect(parser.parse('/./')).toEqual(createRootNode(
      [{
        type: "MetaCharacter", 
        value: "."
      }]
    ));
  });

  it('throws error with first unknown character', () => {
    expect(() => parser.parse("/!/")).toThrow("Can't process the unknown character");
  });

  it('throws error with unknown character after the first one', () => {
    expect(() => parser.parse("/ab!/")).toThrow("Can't process the unknown character");
  });

  it('throws error without opening slash', () => {
    expect(() => parser.parse("ab/")).toThrow("Unexpected token a, expected Slash instead.");
  });

  it('throws error without closing slash', () => {
    expect(() => parser.parse("/ab")).toThrow("Unexpected end of input, expected Slash instead.");
  });

  it('parses concatenated characters properly', () => {
    expect(parser.parse("/a.b\\^\\./")).toEqual(createRootNode(
      [
        { type: "RegularCharacter", value: "a" }, 
        { type: "MetaCharacter", value: "." }, 
        { type: "RegularCharacter", value: "b" }, 
        { type: "RegularCharacter", value: "^" },
        { type: "RegularCharacter", value: "." }
      ]
    ));
  });

  describe.only('flags', () => {
    let parseRegExp;

    beforeAll(() => {
      parseRegExp = (regExp) => parser.parse(regExp);
    });

    it('parses "ignore case" flag properly', () => {
      expect(parseRegExp('/a/i').flags).toEqual({
        ...DEFAULT_FLAGS,
        ignoreCase: true,
      });
    });

    it('parses "global" flag properly', () => {
      expect(parseRegExp('/a/g').flags).toEqual({
        ...DEFAULT_FLAGS,
        global: true,
      });
    });

    it('parses "dotAll" flag properly', () => {
      expect(parseRegExp('/a/s').flags).toEqual({
        ...DEFAULT_FLAGS,
        dotAll: true,
      });
    });

    it('parses "multiline" flag properly', () => {
      expect(parseRegExp('/a/m').flags).toEqual({
        ...DEFAULT_FLAGS,
        multiline: true,
      });
    });

    it('parses "sticky" flag properly', () => {
      expect(parseRegExp('/a/y').flags).toEqual({
        ...DEFAULT_FLAGS,
        sticky: true,
      });
    });

    it('parses "unicode" flag properly', () => {
      expect(parseRegExp('/a/u').flags).toEqual({
        ...DEFAULT_FLAGS,
        unicode: true,
      });
    });

    it('throws correct error if the flag is duplicated', () => {
      expect(() => parseRegExp('/a/yy')).toThrow('Duplicated flag "y" is not allowed.');
    });

    it('throws correct error if the flag is invalid', () => {
      expect(() => parseRegExp('/a/f')).toThrow('Invalid flag "f" is detected.');
    });
  });
});
