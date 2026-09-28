import { AssetConfig, AssetSymbol, Holding } from '../types';

export const MOCK_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123',
};

export const SESSION_TTL_MS = 30 * 60 * 1000;

export const MOCK_WALLET_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

export const ASSETS: Record<AssetSymbol, AssetConfig> = {
  ETH: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ethereum',
    decimals: 18,
    fee: 0.00042,
    feeSymbol: 'ETH',
  },
  BTC: {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'bitcoin',
    decimals: 8,
    fee: 0.000012,
    feeSymbol: 'BTC',
  },
  USDT: {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    network: 'ethereum',
    decimals: 6,
    fee: 0.00065,
    feeSymbol: 'ETH',
  },
  SOL: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    network: 'solana',
    decimals: 9,
    fee: 0.000005,
    feeSymbol: 'SOL',
  },
};

export const INITIAL_HOLDINGS: Holding[] = [
  { symbol: 'ETH', balance: 0.85 },
  { symbol: 'BTC', balance: 0.03 },
  { symbol: 'USDT', balance: 200 },
  { symbol: 'SOL', balance: 12.4 },
];

export const NETWORK_LABELS = {
  ethereum: 'Ethereum (ERC-20)',
  bitcoin: 'Bitcoin',
  solana: 'Solana',
};
