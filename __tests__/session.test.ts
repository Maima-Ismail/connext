import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { isSessionExpired, login, logout, restoreSession } from '../src/store/slices/authSlice';
import sendReducer, { sendTransaction } from '../src/store/slices/sendSlice';
import walletReducer from '../src/store/slices/walletSlice';
import { sessionStorage } from '../src/services/sessionStorage';
import type { AppDispatch, RootState } from '../src/store';
import type { AuthSession } from '../src/types';

jest.mock('../src/utils/helpers', () => ({
  ...jest.requireActual('../src/utils/helpers'),
  delay: () => Promise.resolve(),
}));

const makeStore = () =>
  configureStore({ reducer: combineReducers({ auth: authReducer, wallet: walletReducer, send: sendReducer }) }) as unknown as {
    dispatch: AppDispatch;
    getState: () => RootState;
  };

const session = (expiresAt: number): AuthSession => ({
  token: 'mock.token',
  user: { email: 'test@example.com', name: 'Test User' },
  expiresAt,
});

beforeEach(() => sessionStorage.clear());

describe('secure session', () => {
  it('stores the session in secure storage on login and clears it on logout', async () => {
    const store = makeStore();
    await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    const stored = await sessionStorage.load();
    expect(stored?.token).toBe(store.getState().auth.session?.token);
    expect(stored!.expiresAt).toBeGreaterThan(Date.now());

    await store.dispatch(logout());
    expect(await sessionStorage.load()).toBeNull();
  });

  it('restores a valid session on launch', async () => {
    await sessionStorage.save(session(Date.now() + 60_000));
    const store = makeStore();
    await store.dispatch(restoreSession());
    expect(store.getState().auth.restored).toBe(true);
    expect(store.getState().auth.session?.token).toBe('mock.token');
  });

  it('discards an expired session and tells the user why', async () => {
    await sessionStorage.save(session(Date.now() - 1));
    const store = makeStore();
    await store.dispatch(restoreSession());
    expect(store.getState().auth.session).toBeNull();
    expect(store.getState().auth.notice).toMatch(/expired/);
    expect(await sessionStorage.load()).toBeNull();
  });

  it('resets wallet data when the stored session has expired', async () => {
    const store = makeStore();
    await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    await store.dispatch(
      sendTransaction({ symbol: 'ETH', to: '0x1111111111111111111111111111111111111111', amount: 0.1 }),
    );
    expect(store.getState().wallet.transactions).toHaveLength(1);

    await sessionStorage.save(session(Date.now() - 1));
    await store.dispatch(restoreSession());
    expect(store.getState().wallet.transactions).toHaveLength(0);
  });

  it('shows the expiry notice when logged out for expiry', async () => {
    const store = makeStore();
    await store.dispatch(logout('expired'));
    expect(store.getState().auth.notice).toMatch(/expired/);
  });

  it('detects expiry at the boundary', () => {
    expect(isSessionExpired(session(1000), 999)).toBe(false);
    expect(isSessionExpired(session(1000), 1000)).toBe(true);
  });
});
