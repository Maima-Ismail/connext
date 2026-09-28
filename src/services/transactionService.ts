import { AssetSymbol } from '../types';
import { delay, randomHex } from '../utils/helpers';

export interface SendRequest {
  symbol: AssetSymbol;
  to: string;
  amount: number;
}

export interface SendResponse {
  hash: string;
}

export const SIMULATED_FAILURE_ADDRESS = '0x000000000000000000000000000000000000dEaD';

export const transactionService = {
  async send({ to }: SendRequest): Promise<SendResponse> {
    await delay(2000);
    if (to.toLowerCase() === SIMULATED_FAILURE_ADDRESS.toLowerCase()) {
      throw new Error('Transaction was rejected by the network. No funds were moved.');
    }
    return { hash: `0x${randomHex(64)}` };
  },
};
