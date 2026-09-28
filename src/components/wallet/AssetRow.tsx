import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Layout, Radius, Spacing, Typography } from '../../theme';
import { WalletAsset } from '../../types';
import { formatAmount, formatPrice, formatUsd, masked } from '../../utils/format';
import CoinIcon from './CoinIcon';
import PriceChange from './PriceChange';

interface Props {
  asset: WalletAsset;
  hidden: boolean;
  onPress: (asset: WalletAsset) => void;
}

const CHANGE_COLUMN_WIDTH = 76;

const AssetRow: React.FC<Props> = ({ asset, hidden, onPress }) => (
  <Pressable
    testID={`asset-row-${asset.symbol}`}
    onPress={() => onPress(asset)}
    accessibilityRole="button"
    accessibilityLabel={`${asset.name}, ${formatAmount(asset.balance)} ${asset.symbol}`}
    style={({ pressed }) => [Layout.row, styles.row, pressed && styles.pressed]}>
    <CoinIcon symbol={asset.symbol} imageUrl={asset.market?.image} />

    <View style={Layout.flex}>
      <Text style={styles.primary} numberOfLines={1}>
        {asset.name}
      </Text>
      <Text style={styles.secondary} numberOfLines={1}>
        {formatPrice(asset.price)}
      </Text>
    </View>

    <View style={styles.change}>
      <PriceChange value={asset.change24h} variant="pill" />
    </View>

    <View style={styles.values}>
      <Text style={styles.primary}>{masked(hidden, formatUsd(asset.valueUsd))}</Text>
      <Text style={styles.secondary} numberOfLines={1}>
        {masked(hidden, `${formatAmount(asset.balance)} ${asset.symbol}`)}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  row: { gap: Spacing.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.lg },
  pressed: { backgroundColor: Colors.surfaceRaised },
  primary: { ...Typography.bodyStrong, ...Typography.numeric, color: Colors.textPrimary },
  secondary: { ...Typography.caption, ...Typography.numeric, color: Colors.textSecondary, marginTop: Spacing.xs },
  change: { width: CHANGE_COLUMN_WIDTH, alignItems: 'center' },
  values: { alignItems: 'flex-end', minWidth: 92 },
});

export default React.memo(AssetRow);
