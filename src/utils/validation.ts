import { Network } from '../types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const BTC_BECH32_RE = /^(bc1)[a-z0-9]{25,59}$/;
const BTC_LEGACY_RE = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required.';
  }
  if (!EMAIL_RE.test(email.trim())) {
    return 'Enter a valid email address.';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
};

export const isValidAddress = (address: string, network: Network): boolean => {
  const value = address.trim();
  switch (network) {
    case 'ethereum':
      return EVM_ADDRESS_RE.test(value);
    case 'bitcoin':
      return BTC_BECH32_RE.test(value) || BTC_LEGACY_RE.test(value);
    case 'solana':
      return SOLANA_RE.test(value);
  }
};

export const ADDRESS_HINTS: Record<Network, string> = {
  ethereum: '0x followed by 40 hex characters',
  bitcoin: 'bc1…, 1… or 3… address',
  solana: 'Base58 address, 32–44 characters',
};

export const parseAmount = (input: string): number | null => {
  const normalized = input.replace(',', '.').trim();
  if (!/^\d*\.?\d+$|^\d+\.$/.test(normalized)) {
    return null;
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
};

export const exceeds = (a: number, b: number) => a - b > 1e-12;

export const countDecimals = (input: string) => {
  const [, fraction = ''] = input.replace(',', '.').split('.');
  return fraction.length;
};
