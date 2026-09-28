import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 12000,
  headers: { Accept: 'application/json' },
});

export class ApiError extends Error {
  constructor(message: string, public readonly kind: 'network' | 'timeout' | 'rate_limit' | 'server' | 'unknown') {
    super(message);
    this.name = 'ApiError';
  }
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return new ApiError('The request timed out. Please try again.', 'timeout');
    }
    if (!err.response) {
      return new ApiError('No internet connection. Check your network and try again.', 'network');
    }
    if (err.response.status === 429) {
      return new ApiError('Too many requests to the market data provider. Please wait a moment.', 'rate_limit');
    }
    if (err.response.status >= 500) {
      return new ApiError('Market data service is unavailable right now.', 'server');
    }
    return new ApiError(`Request failed (${err.response.status}).`, 'unknown');
  }
  return new ApiError('Something went wrong. Please try again.', 'unknown');
};

apiClient.interceptors.request.use(config => {
  if (__DEV__) {
    console.log('[API Request]', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL ?? ''}${config.url ?? ''}`,
      params: config.params,
      payload: config.data,
    });
  }
  return config;
});

apiClient.interceptors.response.use(
  response => {
    if (__DEV__) {
      console.log('[API Response]', {
        method: response.config.method?.toUpperCase(),
        url: `${response.config.baseURL ?? ''}${response.config.url ?? ''}`,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  error => {
    const apiError = toApiError(error);
    if (__DEV__) {
      console.warn('[API Error]', {
        method: error.config?.method?.toUpperCase(),
        url: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
        status: error.response?.status,
        kind: apiError.kind,
        message: apiError.message,
      });
    }
    return Promise.reject(apiError);
  },
);
