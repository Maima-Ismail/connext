export const MASK = '••••';

export const masked = (hidden: boolean, value: string) => (hidden ? MASK : value);

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatUsd = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  return usd.format(value);
};

export const formatPrice = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  if (Math.abs(value) >= 1) {
    return usd.format(value);
  }
  return `$${value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}`;
};

export const formatCompactUsd = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  const units: [number, string][] = [
    [1e12, 'T'],
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ];
  for (const [size, suffix] of units) {
    if (Math.abs(value) >= size) {
      return `$${(value / size).toFixed(2)}${suffix}`;
    }
  }
  return usd.format(value);
};

export const formatAmount = (value: number, maxDecimals = 8) => {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const decimals = Math.abs(value) >= 1000 ? 2 : Math.abs(value) >= 1 ? 4 : maxDecimals;
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
};

export const formatPercent = (value: number | null | undefined, signed = true) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatSignedUsd = (value: number) => `${value >= 0 ? '+' : '-'}${formatUsd(Math.abs(value))}`;

export const shortenAddress = (address: string, lead = 6, tail = 4) =>
  address.length <= lead + tail ? address : `${address.slice(0, lead)}…${address.slice(-tail)}`;

export const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
