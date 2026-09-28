import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Layout, Spacing, Typography } from '../../theme';

interface Props {
  label: string;
  value: string;
  caption?: string;
  emphasis?: boolean;
  selectable?: boolean;
}

const DetailRow: React.FC<Props> = ({ label, value, caption, emphasis, selectable }) => (
  <View style={[Layout.rowBetween, styles.row]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueWrap}>
      <Text style={[styles.value, emphasis && styles.emphasis]} selectable={selectable}>
        {value}
      </Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: { alignItems: 'flex-start', paddingVertical: Spacing.md },
  label: { ...Typography.caption, color: Colors.textSecondary },
  valueWrap: { alignItems: 'flex-end', flexShrink: 1, marginLeft: Spacing.lg },
  value: { ...Typography.subtitle, ...Typography.numeric, color: Colors.textPrimary, textAlign: 'right' },
  emphasis: { fontSize: 16 },
  caption: { ...Typography.caption, color: Colors.textTertiary, marginTop: Spacing.xxs },
});

export default DetailRow;
