export type AssetSymbol = 'ETH' | 'BTC' | 'USDT' | 'SOL';

export type Network = 'ethereum' | 'bitcoin' | 'solana';

export interface AssetConfig {
  id: string;
  symbol: AssetSymbol;
  name: string;
  network: Network;
  decimals: number;
  fee: number;
  feeSymbol: AssetSymbol;
}

export interface Holding {
  symbol: AssetSymbol;
  balance: number;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
}

export interface WalletAsset extends AssetConfig {
  balance: number;
  market?: MarketData;
  price: number | null;
  change24h: number | null;
  valueUsd: number | null;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
}

export type TransactionStatus = 'confirmed' | 'failed';

export interface Transaction {
  hash: string;
  symbol: AssetSymbol;
  amount: number;
  fee: number;
  feeSymbol: AssetSymbol;
  to: string;
  timestamp: number;
  status: TransactionStatus;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
