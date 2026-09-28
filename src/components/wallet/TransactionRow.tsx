import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Sizes, Spacing, Typography } from '../../theme';
import { Transaction } from '../../types';
import { formatAmount, formatDateTime, shortenAddress } from '../../utils/format';

const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => (
  <View style={[Layout.row, styles.row]}>
    <View style={styles.icon}>
      <Icon name="arrow-up" size={18} color={Colors.textPrimary} />
    </View>
    <View style={Layout.flex}>
      <Text style={styles.title}>Sent {tx.symbol}</Text>
      <Text style={styles.subtitle}>
        To {shortenAddress(tx.to)} · {formatDateTime(tx.timestamp)}
      </Text>
    </View>
    <Text style={styles.title}>
      -{formatAmount(tx.amount)} {tx.symbol}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: { gap: Spacing.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  icon: {
    ...Layout.center,
    width: Sizes.iconButton,
    height: Sizes.iconButton,
    borderRadius: Sizes.iconButton / 2,
    backgroundColor: Colors.surfaceRaised,
  },
  title: { ...Typography.bodyStrong, ...Typography.numeric, color: Colors.textPrimary },
  subtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xxs },
});

export default React.memo(TransactionRow);
