export interface ChartPoint {
  x: number;
  y: number;
}

export const toPoints = (values: number[], width: number, height: number, padding = 4): ChartPoint[] => {
  if (values.length < 2 || width <= 0) {
    return [];
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values.map((value, i) => ({
    x: i * step,
    y: padding + (1 - (value - min) / range) * (height - padding * 2),
  }));
};

export const linePath = (points: ChartPoint[]) =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

export const areaPath = (points: ChartPoint[], height: number) => {
  if (!points.length) {
    return '';
  }
  const last = points[points.length - 1];
  return `${linePath(points)} L${last.x.toFixed(2)},${height} L0,${height} Z`;
};

export const downsample = (values: number[], maxPoints: number) => {
  if (values.length <= maxPoints) {
    return values;
  }
  const step = values.length / maxPoints;
  const out: number[] = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(values[Math.floor(i * step)]);
  }
  out.push(values[values.length - 1]);
  return out;
};
