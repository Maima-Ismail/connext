import { countDecimals, exceeds, isValidAddress, parseAmount, validateEmail, validatePassword } from '../src/utils/validation';

describe('login validation', () => {
  it('validates email', () => {
    expect(validateEmail('')).toBe('Email is required.');
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address.');
    expect(validateEmail('test@example.com')).toBeNull();
  });

  it('validates password', () => {
    expect(validatePassword('')).toBe('Password is required.');
    expect(validatePassword('123')).toMatch(/at least 6/);
    expect(validatePassword('password123')).toBeNull();
  });
});

describe('address validation', () => {
  it('accepts EVM addresses and rejects malformed ones', () => {
    expect(isValidAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'ethereum')).toBe(true);
    expect(isValidAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976', 'ethereum')).toBe(false);
    expect(isValidAddress('71C7656EC7ab88b098defB751B7401B5f6d8976F00', 'ethereum')).toBe(false);
    expect(isValidAddress('0xZZC7656EC7ab88b098defB751B7401B5f6d8976F', 'ethereum')).toBe(false);
  });

  it('accepts bitcoin bech32 and legacy addresses', () => {
    expect(isValidAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', 'bitcoin')).toBe(true);
    expect(isValidAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', 'bitcoin')).toBe(true);
    expect(isValidAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'bitcoin')).toBe(false);
  });

  it('accepts solana base58 addresses', () => {
    expect(isValidAddress('7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV', 'solana')).toBe(true);
    expect(isValidAddress('0OIl-invalid', 'solana')).toBe(false);
  });
});

describe('amount helpers', () => {
  it('parses decimal input', () => {
    expect(parseAmount('0.5')).toBe(0.5);
    expect(parseAmount('0,5')).toBe(0.5);
    expect(parseAmount('.5')).toBe(0.5);
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('1.2.3')).toBeNull();
  });

  it('counts decimals', () => {
    expect(countDecimals('1.123456789')).toBe(9);
    expect(countDecimals('10')).toBe(0);
  });

  it('compares amounts without float noise', () => {
    expect(exceeds(0.84958 + 0.00042, 0.85)).toBe(false);
    expect(exceeds(0.851, 0.85)).toBe(true);
  });
});
