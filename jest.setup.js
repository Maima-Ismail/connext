jest.mock('react-native-keychain', () => {
  const store = new Map();
  return {
    ACCESSIBLE: { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly' },
    setGenericPassword: jest.fn(async (username, password, { service }) => {
      store.set(service, { username, password, service });
      return { service, storage: 'mock' };
    }),
    getGenericPassword: jest.fn(async ({ service }) => store.get(service) ?? false),
    resetGenericPassword: jest.fn(async ({ service }) => store.delete(service)),
  };
});
