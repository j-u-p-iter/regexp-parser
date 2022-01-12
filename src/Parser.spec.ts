import { Parser } from './Parser';

describe('Parser', () => {
  let parser;

  beforeAll(() => {
    parser = new Parser();
  });

  it('parses letters properly', () => {
    expect(parser.parse('a')).toEqual({
      type: "RegExp", 
      body: {
        type: "Letter", 
        value: "a"
      },
    });
  });

  it('parses digits properly', () => {
    expect(parser.parse('1')).toEqual({
      type: "RegExp", 
      body: {
        type: "Digit", 
        value: "1"
      },
    });
  });

  it('parses underscore properly', () => {
    expect(parser.parse('_')).toEqual({
      type: "RegExp", 
      body: {
        type: "Underscore", 
        value: "_"
      },
    });
  });

  it.only('parses underscore properly', () => {
    expect(parser.parse(" a")).toEqual({
      type: "RegExp", 
      body: {
        type: "Space", 
        value: " "
      },
    });
  });
});
