import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { login, logout } from '../src/store/slices/authSlice';
import marketReducer from '../src/store/slices/marketSlice';
import sendReducer, { sendTransaction } from '../src/store/slices/sendSlice';
import walletReducer from '../src/store/slices/walletSlice';
import { selectPortfolioSummary, selectWalletAssets } from '../src/store/selectors';
import { SIMULATED_FAILURE_ADDRESS } from '../src/services/transactionService';
import type { AppDispatch, RootState } from '../src/store';

jest.mock('../src/utils/helpers', () => ({
  ...jest.requireActual('../src/utils/helpers'),
  delay: () => Promise.resolve(),
}));

const makeStore = () =>
  configureStore({
    reducer: combineReducers({ auth: authReducer, wallet: walletReducer, market: marketReducer, send: sendReducer }),
  }) as unknown as { dispatch: AppDispatch; getState: () => RootState };

const RECIPIENT = '0x1111111111111111111111111111111111111111';

describe('auth', () => {
  it('logs in with the mock credentials', async () => {
    const store = makeStore();
    await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    expect(store.getState().auth.session?.token).toBeTruthy();
    expect(store.getState().auth.status).toBe('succeeded');
  });

  it('rejects wrong credentials with an error message', async () => {
    const store = makeStore();
    await store.dispatch(login({ email: 'test@example.com', password: 'wrong-pass' }));
    expect(store.getState().auth.session).toBeNull();
    expect(store.getState().auth.error).toBe('Incorrect email or password.');
  });

  it('clears session and wallet on logout', async () => {
    const store = makeStore();
    await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    await store.dispatch(sendTransaction({ symbol: 'ETH', to: RECIPIENT, amount: 0.1 }));
    await store.dispatch(logout());
    expect(store.getState().auth.session).toBeNull();
    expect(store.getState().wallet.transactions).toHaveLength(0);
  });
});

describe('send transaction', () => {
  it('debits amount and fee and returns a hash', async () => {
    const store = makeStore();
    const result = await store.dispatch(sendTransaction({ symbol: 'ETH', to: RECIPIENT, amount: 0.1 }));
    expect(sendTransaction.fulfilled.match(result)).toBe(true);
    const tx = store.getState().send.lastTransaction!;
    expect(tx.hash).toMatch(/^0x[0-9a-f]{64}$/);
    const eth = store.getState().wallet.holdings.find(h => h.symbol === 'ETH')!;
    expect(eth.balance).toBeCloseTo(0.85 - 0.1 - 0.00042, 10);
  });

  it('charges ERC-20 gas in ETH', async () => {
    const store = makeStore();
    await store.dispatch(sendTransaction({ symbol: 'USDT', to: RECIPIENT, amount: 50 }));
    const { holdings } = store.getState().wallet;
    expect(holdings.find(h => h.symbol === 'USDT')!.balance).toBe(150);
    expect(holdings.find(h => h.symbol === 'ETH')!.balance).toBeCloseTo(0.85 - 0.00065, 10);
  });

  it('rejects insufficient balance', async () => {
    const store = makeStore();
    await store.dispatch(sendTransaction({ symbol: 'BTC', to: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', amount: 1 }));
    expect(store.getState().send.status).toBe('failed');
    expect(store.getState().wallet.holdings.find(h => h.symbol === 'BTC')!.balance).toBe(0.03);
  });

  it('surfaces simulated network rejection without moving funds', async () => {
    const store = makeStore();
    await store.dispatch(sendTransaction({ symbol: 'ETH', to: SIMULATED_FAILURE_ADDRESS, amount: 0.1 }));
    expect(store.getState().send.error).toMatch(/rejected/);
    expect(store.getState().wallet.holdings.find(h => h.symbol === 'ETH')!.balance).toBe(0.85);
  });
});

describe('selectors', () => {
  it('computes total value and weighted 24h change', () => {
    const state = makeStore().getState();
    const market = (id: string, price: number, change: number) =>
      ({ id, current_price: price, price_change_percentage_24h: change }) as never;
    const withPrices: RootState = {
      ...state,
      market: {
        ...state.market,
        byId: {
          ethereum: market('ethereum', 2000, 10),
          bitcoin: market('bitcoin', 50000, 0),
          tether: market('tether', 1, 0),
          solana: market('solana', 100, 0),
        },
      },
    };
    const assets = selectWalletAssets(withPrices);
    expect(assets.find(a => a.symbol === 'ETH')!.valueUsd).toBe(1700);
    const summary = selectPortfolioSummary(withPrices);
    expect(summary.total).toBeCloseTo(4640);
    expect(summary.changeUsd).toBeCloseTo(1700 - 1700 / 1.1);
  });
});
