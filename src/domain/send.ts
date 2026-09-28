import { ASSETS, NETWORK_LABELS } from '../config/wallet';
import { AssetSymbol } from '../types';
import { formatAmount } from '../utils/format';
import { countDecimals, exceeds, isValidAddress, parseAmount } from '../utils/validation';

export type Balances = Partial<Record<AssetSymbol, number>>;

export interface SendFormErrors {
  recipient: string | null;
  amount: string | null;
}

const balanceOf = (balances: Balances, symbol: AssetSymbol) => balances[symbol] ?? 0;

export const getFundsError = (symbol: AssetSymbol, amount: number, balances: Balances): string | null => {
  const { fee, feeSymbol } = ASSETS[symbol];
  const balance = balanceOf(balances, symbol);

  if (exceeds(amount, balance)) {
    return `Insufficient ${symbol} balance.`;
  }
  if (feeSymbol === symbol && exceeds(amount + fee, balance)) {
    return `Insufficient balance to cover the network fee (${formatAmount(fee)} ${feeSymbol}).`;
  }
  if (feeSymbol !== symbol && exceeds(fee, balanceOf(balances, feeSymbol))) {
    return `Not enough ${feeSymbol} to pay the network fee.`;
  }
  return null;
};

export const getMaxSendable = (symbol: AssetSymbol, balances: Balances) => {
  const { fee, feeSymbol, decimals } = ASSETS[symbol];
  const max = balanceOf(balances, symbol) - (feeSymbol === symbol ? fee : 0);
  return max > 0 ? Number(max.toFixed(Math.min(decimals, 8))) : 0;
};

const validateRecipient = (symbol: AssetSymbol, recipient: string, ownAddress: string): string | null => {
  const { network } = ASSETS[symbol];
  const to = recipient.trim();
  if (!to) {
    return 'Recipient address is required.';
  }
  if (!isValidAddress(to, network)) {
    return `Invalid ${NETWORK_LABELS[network]} address.`;
  }
  if (to.toLowerCase() === ownAddress.toLowerCase()) {
    return 'You cannot send to your own wallet.';
  }
  return null;
};

const validateAmount = (symbol: AssetSymbol, input: string, balances: Balances): string | null => {
  const amount = parseAmount(input);
  if (!input.trim()) {
    return 'Amount is required.';
  }
  if (amount === null) {
    return 'Enter a valid number.';
  }
  if (amount <= 0) {
    return 'Amount must be greater than 0.';
  }
  const { decimals } = ASSETS[symbol];
  if (countDecimals(input) > decimals) {
    return `${symbol} supports up to ${decimals} decimal places.`;
  }
  return getFundsError(symbol, amount, balances);
};

export const validateSendForm = (
  symbol: AssetSymbol,
  recipient: string,
  amount: string,
  ownAddress: string,
  balances: Balances,
): SendFormErrors => ({
  recipient: validateRecipient(symbol, recipient, ownAddress),
  amount: validateAmount(symbol, amount, balances),
});
