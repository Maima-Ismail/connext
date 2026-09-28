import { createRequestCache } from '../src/utils/cache';

describe('createRequestCache', () => {
  afterEach(() => jest.useRealTimers());

  it('serves fresh entries without calling the loader again', async () => {
    const cache = createRequestCache<number>();
    const loader = jest.fn().mockResolvedValue(1);
    await cache.fetch('btc:1', 1000, loader);
    await cache.fetch('btc:1', 1000, loader);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('shares one in-flight request between concurrent callers', async () => {
    const cache = createRequestCache<number>();
    const loader = jest.fn().mockResolvedValue(1);
    await Promise.all([cache.fetch('k', 1000, loader), cache.fetch('k', 1000, loader)]);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('refetches after the TTL and falls back to stale data on error', async () => {
    jest.useFakeTimers({ now: 0 });
    const cache = createRequestCache<number>();
    await cache.fetch('k', 1000, () => Promise.resolve(42));

    jest.setSystemTime(2000);
    const failing = jest.fn().mockRejectedValue(new Error('429'));
    await expect(cache.fetch('k', 1000, failing)).resolves.toBe(42);
    expect(failing).toHaveBeenCalledTimes(1);
  });

  it('propagates errors when there is nothing cached', async () => {
    const cache = createRequestCache<number>();
    await expect(cache.fetch('k', 1000, () => Promise.reject(new Error('offline')))).rejects.toThrow('offline');
  });
});
