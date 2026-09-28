import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { marketApi } from '../../api/marketApi';
import { ASSETS } from '../../config/wallet';
import { MarketData, RequestStatus } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

interface MarketState {
  byId: Record<string, MarketData>;
  status: RequestStatus;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: MarketState = {
  byId: {},
  status: 'idle',
  error: null,
  lastUpdated: null,
};

export const fetchMarkets = createAsyncThunk<MarketData[], void, { rejectValue: string }>(
  'market/fetchMarkets',
  async (_, { rejectWithValue }) => {
    try {
      return await marketApi.getMarkets(Object.values(ASSETS).map(asset => asset.id));
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to load market data.'));
    }
  },
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMarkets.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMarkets.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.byId = Object.fromEntries(payload.map(item => [item.id, item]));
        state.lastUpdated = Date.now();
      })
      .addCase(fetchMarkets.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload ?? 'Failed to load market data.';
      });
  },
});

export default marketSlice.reducer;
