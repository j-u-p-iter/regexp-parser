import { Parser } from './Parser';
import { NodeType } from './constants';
import { Disjunction } from './types';

const createRootNode = (regExpNodes: Disjunction['value']) => {
  return {
    type: NodeType.REG_EXPR,
    value: {
      type: NodeType.PATTERN,
      value: {
        type: NodeType.DISJUNCTION,
        value: regExpNodes,
      },
    },
    flags: {
      ignoreCase: false,
    },
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
});
