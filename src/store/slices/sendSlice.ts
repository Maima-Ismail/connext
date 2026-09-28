import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ASSETS } from '../../config/wallet';
import { getFundsError } from '../../domain/send';
import { SendRequest, transactionService } from '../../services/transactionService';
import { RequestStatus, Transaction } from '../../types';
import { getErrorMessage } from '../../utils/helpers';
import type { RootState } from '../index';
import { selectBalances } from '../selectors';

interface SendState {
  status: RequestStatus;
  error: string | null;
  lastTransaction: Transaction | null;
}

const initialState: SendState = {
  status: 'idle',
  error: null,
  lastTransaction: null,
};

export const sendTransaction = createAsyncThunk<
  Transaction,
  SendRequest,
  { state: RootState; rejectValue: string }
>('send/sendTransaction', async (request, { getState, rejectWithValue }) => {
  const fundsError = getFundsError(request.symbol, request.amount, selectBalances(getState()));
  if (fundsError) {
    return rejectWithValue(fundsError);
  }

  const { fee, feeSymbol } = ASSETS[request.symbol];

  try {
    const { hash } = await transactionService.send(request);
    return {
      hash,
      symbol: request.symbol,
      amount: request.amount,
      fee,
      feeSymbol,
      to: request.to,
      timestamp: Date.now(),
      status: 'confirmed',
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Transaction failed.'));
  }
});

const sendSlice = createSlice({
  name: 'send',
  initialState,
  reducers: {
    resetSend: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(sendTransaction.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.lastTransaction = null;
      })
      .addCase(sendTransaction.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.lastTransaction = payload;
      })
      .addCase(sendTransaction.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload ?? 'Transaction failed.';
      });
  },
});

export const { resetSend } = sendSlice.actions;
export default sendSlice.reducer;
