import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Layout, Radius, Spacing, Typography } from '../../theme';
import { AssetSymbol, WalletAsset } from '../../types';
import { formatAmount } from '../../utils/format';
import CoinIcon from './CoinIcon';

interface Props {
  assets: WalletAsset[];
  selected: AssetSymbol;
  onSelect: (symbol: AssetSymbol) => void;
}

const CHIP_ICON = 28;

const AssetSelector: React.FC<Props> = ({ assets, selected, onSelect }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Asset</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
      {assets.map(asset => {
        const active = asset.symbol === selected;
        return (
          <Pressable
            key={asset.symbol}
            testID={`asset-chip-${asset.symbol}`}
            onPress={() => onSelect(asset.symbol)}
            style={[Layout.row, styles.chip, active && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <CoinIcon symbol={asset.symbol} imageUrl={asset.market?.image} size={CHIP_ICON} />
            <View>
              <Text style={styles.symbol}>{asset.symbol}</Text>
              <Text style={styles.balance}>{formatAmount(asset.balance)}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.xl },
  label: { ...Typography.overline, color: Colors.textSecondary, marginBottom: Spacing.sm },
  list: { gap: Spacing.sm },
  chip: {
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  symbol: { ...Typography.subtitle, color: Colors.textPrimary },
  balance: { ...Typography.caption, ...Typography.numeric, color: Colors.textSecondary, fontSize: 11 },
});

export default AssetSelector;
