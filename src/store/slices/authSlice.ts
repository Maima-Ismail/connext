import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { sessionStorage } from '../../services/sessionStorage';
import { AuthSession, RequestStatus } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

export type LogoutReason = 'user' | 'expired';

interface AuthState {
  session: AuthSession | null;
  restored: boolean;
  status: RequestStatus;
  error: string | null;
  notice: string | null;
}

const initialState: AuthState = {
  session: null,
  restored: false,
  status: 'idle',
  error: null,
  notice: null,
};

export const isSessionExpired = (session: AuthSession, now = Date.now()) => now >= session.expiresAt;

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  try {
    const session = await sessionStorage.load();
    if (session && !isSessionExpired(session)) {
      return { session, expired: false };
    }
    if (session) {
      await sessionStorage.clear();
    }
    return { session: null, expired: Boolean(session) };
  } catch {
    return { session: null, expired: false };
  }
});

export const login = createAsyncThunk<AuthSession, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const session = await authService.login(email, password);
      await sessionStorage.save(session);
      return session;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to sign in.'));
    }
  },
);

export const logout = createAsyncThunk<LogoutReason, LogoutReason | undefined>('auth/logout', async (reason = 'user') => {
  await sessionStorage.clear().catch(() => undefined);
  return reason;
});

const EXPIRED_NOTICE = 'Your session expired. Please sign in again.';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessages: state => {
      state.error = null;
      state.notice = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.session = payload.session;
        state.notice = payload.expired ? EXPIRED_NOTICE : null;
        state.restored = true;
      })
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.notice = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.session = payload;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload ?? 'Unable to sign in.';
      })
      .addCase(logout.fulfilled, (_, { payload: reason }) => ({
        ...initialState,
        restored: true,
        notice: reason === 'expired' ? EXPIRED_NOTICE : null,
      }));
  },
});

export const { clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
