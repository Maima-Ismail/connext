import { StyleSheet } from 'react-native';
import type { AssetSymbol } from '../types';

const palette = {
  blue: '#3399FE',
  blueDark: '#1F80E0',
  deep: '#1F6FD6',
  sky: '#66CBFF',
  navy: '#1E2F43',

  navy950: '#08111C',
  navy900: '#0F1C2B',
  navy800: '#152536',
  navy700: '#1F3246',
  ink: '#040910',

  white: '#FFFFFF',
  slate50: '#F4F8FC',
  slate400: '#93A6BD',
  slate600: '#5A7089',

  green: '#16C784',
  greenLight: '#5CF0B5',
  red: '#EA3943',
  redDark: '#C92E37',
  redLight: '#FF8A92',
  amber: '#F5A524',
};

export const alpha = (hex: string, opacity: number) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const Colors = {
  brandBlue: palette.blue,
  brandDeep: palette.deep,
  brandSky: palette.sky,
  brandNavy: palette.navy,

  background: palette.navy950,
  surface: palette.navy900,
  surfaceRaised: palette.navy800,
  surfaceHighlight: palette.navy,
  border: palette.navy700,
  overlay: alpha(palette.ink, 0.75),

  primary: palette.blue,
  primaryPressed: palette.blueDark,
  primarySoft: alpha(palette.blue, 0.14),
  accent: palette.sky,

  textPrimary: palette.slate50,
  textSecondary: palette.slate400,
  textTertiary: palette.slate600,
  textOnPrimary: palette.white,

  positive: palette.green,
  positiveSoft: alpha(palette.green, 0.14),
  negative: palette.red,
  negativePressed: palette.redDark,
  negativeSoft: alpha(palette.red, 0.14),
  warning: palette.amber,
  warningSoft: alpha(palette.amber, 0.14),

  onBrand: palette.white,
  onBrandMuted: alpha(palette.white, 0.7),
  onBrandFaint: alpha(palette.white, 0.12),
  onBrandControl: alpha(palette.white, 0.15),
  onBrandPressed: alpha(palette.white, 0.25),
  onBrandSkeleton: alpha(palette.white, 0.18),
  onBrandPositive: palette.greenLight,
  onBrandPositiveSoft: alpha(palette.green, 0.2),
  onBrandNegative: palette.redLight,
  onBrandNegativeSoft: alpha(palette.red, 0.2),

};

export const LogoColors = {
  top: '#3494E6',
  facet: '#66CAFF',
  frontStart: '#1E7AD8',
  front: '#3597FF',
  shade: { light: palette.navy, dark: '#2B5588' },
};

export const CoinColors: Record<AssetSymbol, string> = {
  ETH: '#627EEA',
  BTC: '#F7931A',
  USDT: '#26A17B',
  SOL: '#9945FF',
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const Sizes = {
  control: 54,
  controlSmall: 44,
  iconButton: 40,
  avatar: 42,
  coinIcon: 44,
  actionButton: 48,
};

export const Typography = {
  display: { fontSize: 38, fontWeight: '700' as const, letterSpacing: -1 },
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  subtitle: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  captionStrong: { fontSize: 13, fontWeight: '600' as const },
  overline: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.4, textTransform: 'uppercase' as const },
  numeric: { fontVariant: ['tabular-nums' as const] },
};

export const HitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

export const Layout = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  center: { alignItems: 'center', justifyContent: 'center' },
});
