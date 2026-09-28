import { MarketData } from '../types';
import { createRequestCache } from '../utils/cache';
import { apiClient } from './client';

export type ChartRange = '1' | '7' | '30' | '365';

const MINUTE = 60_000;

const HISTORY_TTL_MS: Record<ChartRange, number> = {
  '1': 2 * MINUTE,
  '7': 10 * MINUTE,
  '30': 60 * MINUTE,
  '365': 60 * MINUTE,
};

const historyCache = createRequestCache<number[]>();

export const marketApi = {
  async getMarkets(ids: string[]): Promise<MarketData[]> {
    const { data } = await apiClient.get<MarketData[]>('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: ids.join(','),
        sparkline: false,
        price_change_percentage: '24h',
      },
    });
    return Array.isArray(data) ? data : [];
  },

  getPriceHistory(id: string, days: ChartRange): Promise<number[]> {
    return historyCache.fetch(`${id}:${days}`, HISTORY_TTL_MS[days], async () => {
      const { data } = await apiClient.get<{ prices: [number, number][] }>(`/coins/${id}/market_chart`, {
        params: { vs_currency: 'usd', days },
      });
      return (data?.prices ?? []).map(([, price]) => price);
    });
  },
};
