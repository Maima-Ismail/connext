import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_HOLDINGS, MOCK_WALLET_ADDRESS } from '../../config/wallet';
import { Holding, Transaction } from '../../types';
import { logout, restoreSession } from './authSlice';
import { sendTransaction } from './sendSlice';

interface WalletState {
  address: string;
  holdings: Holding[];
  transactions: Transaction[];
}

const initialState: WalletState = {
  address: MOCK_WALLET_ADDRESS,
  holdings: INITIAL_HOLDINGS,
  transactions: [],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(sendTransaction.fulfilled, (state, { payload: tx }) => {
        const debit = (symbol: string, amount: number) => {
          const holding = state.holdings.find(h => h.symbol === symbol);
          if (holding) {
            holding.balance = Math.max(0, Number((holding.balance - amount).toFixed(12)));
          }
        };
        debit(tx.symbol, tx.amount);
        debit(tx.feeSymbol, tx.fee);
        state.transactions.unshift(tx);
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(restoreSession.fulfilled, (state, { payload }) => (payload.expired ? initialState : state));
  },
});

export default walletSlice.reducer;
