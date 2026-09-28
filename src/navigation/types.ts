import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AssetSymbol } from '../types';

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  AssetDetails: { symbol: AssetSymbol };
  Send: { symbol?: AssetSymbol } | undefined;
  TransactionResult: undefined;
};

export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
