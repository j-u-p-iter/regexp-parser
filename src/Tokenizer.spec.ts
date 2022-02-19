import { Tokenizer } from './Tokenizer';

/**
 * The way to test Tokenizer:
 *   1. Test every single character separately. 
 *   2. Test all possible at once in one separate spec.
 *   3. If there're some corner cases - test them additionally in separate specs.
 *
 */
describe('Tokenizer', () => {
  it('returns letter character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('a');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Letter', value: 'a', index: 0 }); 

    tokenizer.init('M');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Letter', value: 'M', index: 0 }); 
  });

  it('returns digit character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('1');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Digit', value: '1', index: 0 }); 

    tokenizer.init('8');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Digit', value: '8', index: 0 }); 
  });

  it('returns underscore character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('_');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Underscore', value: '_', index: 0 }); 
  });

  it('returns star character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('*');
    expect(tokenizer.getNextToken()).toEqual({
      type: 'Star',
      value: '*',
      index: 0,
    }); 
  });

  it('returns question mark character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('?');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Question Mark', 
      value: '?',
      index: 0,
    }); 
  });

  it('returns plus character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('+');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Plus', 
      value: '+',
      index: 0,
    }); 
  });

  it('returns left bracket character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('(');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Left Bracket', 
      value: '(',
      index: 0,
    }); 
  });

  it('returns right bracket character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init(')');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Right Bracket', 
      value: ')',
      index: 0,
    }); 
  });

  it('returns space character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init(' ');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Space', 
      value: ' ',
      index: 0,
    }); 
  });

  it('returns back slash character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('\\');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Back Slash', 
      value: '\\',
      index: 0,
    }); 
  });

  it('returns back slash character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('.');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Dot', 
      value: '.',
      index: 0,
    }); 
  });

  it('returns back slash character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('|');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Pipe', 
      value: '|',
      index: 0,
    }); 
  });

  it('returns correct set of tokens', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('/a?\\ /');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Slash', 
      value: '/',
      index: 0,
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Letter', 
      value: 'a',
      index: 1,
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Question Mark', 
      value: '?',
      index: 2,
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Back Slash', 
      value: '\\',
      index: 3,
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Space', 
      value: ' ',
      index: 4
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Slash', 
      value: '/' ,
      index: 5,
    }); 

    expect(tokenizer.getNextToken()).toEqual(null); 
  });
});
