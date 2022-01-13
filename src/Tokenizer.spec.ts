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

    expect(tokenizer.getNextToken()).toEqual({ type: 'Letter', value: 'a' }); 

    tokenizer.init('M');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Letter', value: 'M' }); 
  });

  it('returns digit character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('1');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Digit', value: '1' }); 

    tokenizer.init('8');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Digit', value: '8' }); 
  });

  it('returns underscore character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('_');

    expect(tokenizer.getNextToken()).toEqual({ type: 'Underscore', value: '_' }); 
  });

  it('returns star character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('*');
    expect(tokenizer.getNextToken()).toEqual({
      type: 'Star',
      value: '*'
    }); 
  });

  it('returns question mark character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('?');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Question Mark', 
      value: '?' 
    }); 
  });

  it('returns plus character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('+');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Plus', 
      value: '+' 
    }); 
  });

  it('returns left bracket character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('(');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Left Bracket', 
      value: '(' 
    }); 
  });

  it('returns right bracket character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init(')');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Right Bracket', 
      value: ')' 
    }); 
  });

  it('returns space character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init(' ');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Space', 
      value: ' ' 
    }); 
  });

  it('returns back slash character token', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('\\');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Back Slash', 
      value: '\\' 
    }); 
  });

  it('returns correct set of tokens', () => {
    const tokenizer = new Tokenizer();

    tokenizer.init('a?\\ ');

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Letter', 
      value: 'a' 
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Question Mark', 
      value: '?' 
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Back Slash', 
      value: '\\' 
    }); 

    expect(tokenizer.getNextToken()).toEqual({ 
      type: 'Space', 
      value: ' ' 
    }); 

    expect(tokenizer.getNextToken()).toEqual(null); 
  });
});
