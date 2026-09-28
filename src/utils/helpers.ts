export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const randomHex = (length: number) => {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += Math.floor(Math.random() * 16).toString(16);
  }
  return out;
};

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong.') =>
  error instanceof Error && error.message ? error.message : fallback;
