import { Parser } from './Parser';

describe('Parser', () => {
  let parser;

  beforeAll(() => {
    parser = new Parser();
  });

  it('parses letters properly', () => {
    expect(parser.parse('a')).toEqual({
      type: "RegExp", 
      expressions: [{
        type: "RegularCharacter", 
        value: "a"
      }],
    });
  });

  it('parses digits properly', () => {
    expect(parser.parse('1')).toEqual({
      type: "RegExp", 
      expressions: [{
        type: "RegularCharacter", 
        value: "1"
      }],
    });
  });

  it('parses underscore properly', () => {
    expect(parser.parse('_')).toEqual({
      type: "RegExp", 
      expressions: [{
        type: "RegularCharacter", 
        value: "_"
      }],
    });
  });

  it('parses underscore properly', () => {
    expect(parser.parse(" ")).toEqual({
      type: "RegExp", 
      expressions: [{
        type: "RegularCharacter", 
        value: " "
      }],
    });
  });

  it('parses escaped character properly', () => {
    expect(parser.parse("\\^")).toEqual({
      type: "RegExp", 
      expressions: [{
        type: "RegularCharacter", 
        value: "^"
      }],
    });
  });
});
