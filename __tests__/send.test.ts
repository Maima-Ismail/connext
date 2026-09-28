import { getFundsError, getMaxSendable, validateSendForm } from '../src/domain/send';

const BALANCES = { ETH: 0.85, BTC: 0.03, USDT: 200, SOL: 12.4 };
const OWN = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
const OTHER = '0x1111111111111111111111111111111111111111';

describe('getFundsError', () => {
  it('passes when amount + fee fits', () => {
    expect(getFundsError('ETH', 0.5, BALANCES)).toBeNull();
  });

  it('flags amounts above the balance', () => {
    expect(getFundsError('BTC', 1, BALANCES)).toBe('Insufficient BTC balance.');
  });

  it('reserves the fee for native assets', () => {
    expect(getFundsError('ETH', 0.85, BALANCES)).toMatch(/network fee/);
  });

  it('requires ETH for ERC-20 gas', () => {
    expect(getFundsError('USDT', 10, { ...BALANCES, ETH: 0 })).toBe('Not enough ETH to pay the network fee.');
  });
});

describe('getMaxSendable', () => {
  it('subtracts the fee for native assets only', () => {
    expect(getMaxSendable('ETH', BALANCES)).toBeCloseTo(0.84958);
    expect(getMaxSendable('USDT', BALANCES)).toBe(200);
  });

  it('never returns a negative amount', () => {
    expect(getMaxSendable('SOL', { SOL: 0 })).toBe(0);
  });
});

describe('validateSendForm', () => {
  it('accepts a valid transfer', () => {
    expect(validateSendForm('ETH', OTHER, '0.1', OWN, BALANCES)).toEqual({ recipient: null, amount: null });
  });

  it('rejects wrong-network and self addresses', () => {
    expect(validateSendForm('BTC', OTHER, '0.01', OWN, BALANCES).recipient).toMatch(/Invalid Bitcoin/);
    expect(validateSendForm('ETH', OWN.toLowerCase(), '0.1', OWN, BALANCES).recipient).toMatch(/own wallet/);
  });

  it('rejects malformed amounts and excess precision', () => {
    expect(validateSendForm('ETH', OTHER, '', OWN, BALANCES).amount).toBe('Amount is required.');
    expect(validateSendForm('ETH', OTHER, '0', OWN, BALANCES).amount).toMatch(/greater than 0/);
    expect(validateSendForm('USDT', OTHER, '1.1234567', OWN, BALANCES).amount).toMatch(/6 decimal places/);
  });
});
