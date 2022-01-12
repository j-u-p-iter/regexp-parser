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
});
