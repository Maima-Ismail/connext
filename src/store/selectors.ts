import { createSelector } from '@reduxjs/toolkit';
import { ASSETS } from '../config/wallet';
import type { Balances } from '../domain/send';
import { AssetSymbol, WalletAsset } from '../types';
import type { RootState } from './index';

export const selectSession = (state: RootState) => state.auth.session;
export const selectSessionRestored = (state: RootState) => state.auth.restored;
export const selectUser = (state: RootState) => state.auth.session?.user ?? null;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.session);
export const selectAuth = (state: RootState) => state.auth;
export const selectWallet = (state: RootState) => state.wallet;
export const selectMarket = (state: RootState) => state.market;
export const selectSend = (state: RootState) => state.send;

const selectHoldings = (state: RootState) => state.wallet.holdings;
const selectMarketById = (state: RootState) => state.market.byId;

export const selectWalletAssets = createSelector([selectHoldings, selectMarketById], (holdings, byId) =>
  holdings.map<WalletAsset>(holding => {
    const config = ASSETS[holding.symbol];
    const market = byId[config.id];
    const price = market?.current_price ?? null;
    return {
      ...config,
      balance: holding.balance,
      market,
      price,
      change24h: market?.price_change_percentage_24h ?? null,
      valueUsd: price === null ? null : holding.balance * price,
    };
  }),
);

export const selectAssetBySymbol = createSelector(
  [selectWalletAssets, (_: RootState, symbol: AssetSymbol) => symbol],
  (assets, symbol) => assets.find(asset => asset.symbol === symbol),
);

export const selectBalances = createSelector([selectHoldings], holdings =>
  Object.fromEntries(holdings.map(h => [h.symbol, h.balance])) as Balances,
);

export const selectPortfolioSummary = createSelector([selectWalletAssets], assets => {
  const priced = assets.filter(asset => asset.valueUsd !== null);
  const total = priced.reduce((sum, asset) => sum + (asset.valueUsd ?? 0), 0);
  const previous = priced.reduce((sum, asset) => {
    const change = asset.change24h ?? 0;
    return sum + (asset.valueUsd ?? 0) / (1 + change / 100);
  }, 0);
  const changeUsd = total - previous;
  return {
    total: priced.length ? total : null,
    changeUsd: priced.length ? changeUsd : null,
    changePercent: previous > 0 ? (changeUsd / previous) * 100 : null,
  };
});
