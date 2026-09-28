import { MOCK_CREDENTIALS, SESSION_TTL_MS } from '../config/wallet';
import { AuthSession } from '../types';
import { delay, randomHex } from '../utils/helpers';

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    await delay(1200);
    const matches =
      email.trim().toLowerCase() === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password;
    if (!matches) {
      throw new Error('Incorrect email or password.');
    }
    return {
      token: `mock.${randomHex(32)}`,
      user: { email: MOCK_CREDENTIALS.email, name: 'Test User' },
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
  },
};
