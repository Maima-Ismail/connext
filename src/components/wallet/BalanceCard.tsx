import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, HitSlop, Layout, Radius, Sizes, Spacing, Typography } from '../../theme';
import { formatSignedUsd, formatUsd, MASK, masked, shortenAddress } from '../../utils/format';
import Skeleton from '../ui/Skeleton';

interface Props {
  address: string;
  total: number | null;
  changeUsd: number | null;
  changePercent: number | null;
  loading: boolean;
  hidden: boolean;
  onToggleHidden: () => void;
  onAddressPress: () => void;
  onSend: () => void;
  onReceive: () => void;
}

const ActionButton: React.FC<{ icon: string; label: string; onPress: () => void }> = ({ icon, label, onPress }) => (
  <Pressable onPress={onPress} style={styles.action} accessibilityRole="button" accessibilityLabel={label}>
    {({ pressed }) => (
      <>
        <View style={[styles.actionIcon, pressed && styles.actionIconPressed]}>
          <Icon name={icon} size={20} color={Colors.onBrand} />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
      </>
    )}
  </Pressable>
);

const GradientBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
    <Defs>
      <LinearGradient id="card" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={Colors.brandBlue} />
        <Stop offset="0.55" stopColor={Colors.brandDeep} />
        <Stop offset="1" stopColor={Colors.brandNavy} />
      </LinearGradient>
    </Defs>
    <Rect width={width} height={height} fill="url(#card)" />
    <Circle cx={width * 0.92} cy={height * 0.08} r={90} fill={Colors.onBrandFaint} />
    <Circle cx={width * 0.1} cy={height * 1.1} r={110} fill={Colors.brandSky} opacity={0.12} />
  </Svg>
);

const BalanceCard: React.FC<Props> = ({
  address,
  total,
  changeUsd,
  changePercent,
  loading,
  hidden,
  onToggleHidden,
  onAddressPress,
  onSend,
  onReceive,
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const positive = (changeUsd ?? 0) >= 0;
  const changeColor = positive ? Colors.onBrandPositive : Colors.onBrandNegative;

  return (
    <View
      style={styles.card}
      onLayout={({ nativeEvent: { layout } }: LayoutChangeEvent) =>
        setSize({ width: Math.ceil(layout.width), height: Math.ceil(layout.height) })
      }>
      {size.width > 0 ? <GradientBackground width={size.width} height={size.height} /> : null}

      <Pressable onPress={onAddressPress} style={[Layout.row, styles.addressChip]} accessibilityLabel="Show wallet address">
        <View style={styles.dot} />
        <Text style={styles.addressText}>{shortenAddress(address)}</Text>
        <Icon name="qr-code-outline" size={14} color={Colors.onBrandMuted} />
      </Pressable>

      <View style={[Layout.row, styles.gap]}>
        <Text style={styles.label}>Total balance</Text>
        <Pressable onPress={onToggleHidden} hitSlop={HitSlop} accessibilityLabel={hidden ? 'Show balance' : 'Hide balance'}>
          <Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.onBrandMuted} />
        </Pressable>
      </View>

      {loading && total === null ? (
        <>
          <Skeleton width={200} height={40} style={styles.skeleton} />
          <Skeleton width={120} height={20} style={styles.skeleton} />
        </>
      ) : (
        <>
          <Text style={styles.total} adjustsFontSizeToFit numberOfLines={1} testID="total-balance">
            {hidden ? `$${MASK}` : formatUsd(total)}
          </Text>
          {changeUsd !== null && changePercent !== null ? (
            <View style={[Layout.row, styles.gap, styles.changeRow]}>
              <View
                style={[
                  Layout.row,
                  styles.changePill,
                  positive ? styles.changePositive : styles.changeNegative,
                ]}>
                <Icon name={positive ? 'trending-up' : 'trending-down'} size={14} color={changeColor} />
                <Text style={[styles.changeText, { color: changeColor }]}>
                  {masked(hidden, `${formatSignedUsd(changeUsd)} (${Math.abs(changePercent).toFixed(2)}%)`)}
                </Text>
              </View>
              <Text style={styles.label}>24h</Text>
            </View>
          ) : null}
        </>
      )}

      <View style={[Layout.row, styles.actions]}>
        <ActionButton icon="arrow-up" label="Send" onPress={onSend} />
        <ActionButton icon="arrow-down" label="Receive" onPress={onReceive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    padding: Spacing.xl,
    backgroundColor: Colors.brandDeep,
  },
  gap: { gap: Spacing.sm },
  addressChip: {
    alignSelf: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.onBrandFaint,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    marginBottom: Spacing.xl,
  },
  dot: { width: Spacing.sm, height: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Colors.brandSky },
  addressText: { ...Typography.captionStrong, ...Typography.numeric, color: Colors.onBrand },
  label: { ...Typography.caption, color: Colors.onBrandMuted },
  total: { ...Typography.display, ...Typography.numeric, color: Colors.onBrand, marginTop: Spacing.xs },
  skeleton: { marginTop: Spacing.sm, backgroundColor: Colors.onBrandSkeleton },
  changeRow: { marginTop: Spacing.sm },
  changePill: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  changePositive: { backgroundColor: Colors.onBrandPositiveSoft },
  changeNegative: { backgroundColor: Colors.onBrandNegativeSoft },
  changeText: { ...Typography.captionStrong, fontWeight: '700' },
  actions: { gap: Spacing.xxl, marginTop: Spacing.xl },
  action: { alignItems: 'center' },
  actionIcon: {
    ...Layout.center,
    width: Sizes.actionButton,
    height: Sizes.actionButton,
    borderRadius: Sizes.actionButton / 2,
    backgroundColor: Colors.onBrandControl,
  },
  actionIconPressed: { backgroundColor: Colors.onBrandPressed },
  actionLabel: { ...Typography.captionStrong, color: Colors.onBrand, marginTop: Spacing.sm },
});

export default BalanceCard;
