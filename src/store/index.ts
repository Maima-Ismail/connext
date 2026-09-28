import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';
import sendReducer from './slices/sendSlice';
import walletReducer from './slices/walletSlice';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['wallet'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletReducer,
  market: marketReducer,
  send: sendReducer,
});

export const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
