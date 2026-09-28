import { useCallback, useEffect, useState } from 'react';
import { ChartRange, marketApi } from '../api/marketApi';
import { getErrorMessage } from '../utils/helpers';

export const usePriceHistory = (id: string, range: ChartRange) => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    marketApi
      .getPriceHistory(id, range)
      .then(prices => {
        if (!cancelled) {
          setData(prices);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Failed to load chart.'));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, range, attempt]);

  const retry = useCallback(() => setAttempt(a => a + 1), []);

  return { data, loading, error, retry };
};
