import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchMarkets } from '../store/slices/marketSlice';

const REFRESH_INTERVAL_MS = 60_000;

export const useMarketPolling = (intervalMs = REFRESH_INTERVAL_MS) => {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const reload = useCallback(() => dispatch(fetchMarkets()), [dispatch]);

  useEffect(() => {
    reload();
    const id = setInterval(reload, intervalMs);
    return () => clearInterval(id);
  }, [reload, intervalMs]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  return { reload, refresh, refreshing };
};
