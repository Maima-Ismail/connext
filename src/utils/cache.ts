interface Entry<T> {
  value: T;
  expiresAt: number;
}

export const createRequestCache = <T>() => {
  const entries = new Map<string, Entry<T>>();
  const inFlight = new Map<string, Promise<T>>();

  const fetch = (key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> => {
    const cached = entries.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return Promise.resolve(cached.value);
    }

    const pending = inFlight.get(key);
    if (pending) {
      return pending;
    }

    const request = loader()
      .then(value => {
        entries.set(key, { value, expiresAt: Date.now() + ttlMs });
        return value;
      })
      .catch(error => {
        if (cached) {
          return cached.value;
        }
        throw error;
      })
      .finally(() => inFlight.delete(key));

    inFlight.set(key, request);
    return request;
  };

  return { fetch, clear: () => entries.clear() };
};
