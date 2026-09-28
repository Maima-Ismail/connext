import * as Keychain from 'react-native-keychain';
import { AuthSession } from '../types';

const OPTIONS = {
  service: 'com.connext.wallet.session',
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const isSession = (value: unknown): value is AuthSession => {
  const v = value as AuthSession;
  return typeof v?.token === 'string' && typeof v?.expiresAt === 'number' && typeof v?.user?.email === 'string';
};

export const sessionStorage = {
  async save(session: AuthSession): Promise<void> {
    await Keychain.setGenericPassword(session.user.email, JSON.stringify(session), OPTIONS);
  },

  async load(): Promise<AuthSession | null> {
    const credentials = await Keychain.getGenericPassword(OPTIONS);
    if (!credentials) {
      return null;
    }
    try {
      const parsed: unknown = JSON.parse(credentials.password);
      return isSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await Keychain.resetGenericPassword(OPTIONS);
  },
};
