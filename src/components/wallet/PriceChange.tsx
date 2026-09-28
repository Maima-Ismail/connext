import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Radius, Spacing, Typography } from '../../theme';
import { formatPercent } from '../../utils/format';

interface Props {
  value: number | null;
  variant?: 'pill' | 'text';
}

const TRENDS = {
  up: { color: Colors.positive, pill: { backgroundColor: Colors.positiveSoft }, icon: 'caret-up' },
  down: { color: Colors.negative, pill: { backgroundColor: Colors.negativeSoft }, icon: 'caret-down' },
  flat: { color: Colors.textSecondary, pill: { backgroundColor: Colors.surfaceRaised }, icon: null },
};

const PriceChange: React.FC<Props> = ({ value, variant = 'text' }) => {
  if (value === null) {
    return <Text style={[styles.text, styles.empty]}>—</Text>;
  }
  const trend = Math.abs(value) < 0.005 ? 'flat' : value > 0 ? 'up' : 'down';
  const { color, pill, icon } = TRENDS[trend];

  return (
    <View style={[Layout.row, variant === 'pill' && [styles.pill, pill]]}>
      {icon ? <Icon name={icon} size={12} color={color} /> : null}
      <Text style={[styles.text, { color }]}>{formatPercent(Math.abs(value), false)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  text: { ...Typography.captionStrong, marginLeft: Spacing.xxs },
  empty: { color: Colors.textTertiary },
});

export default PriceChange;
