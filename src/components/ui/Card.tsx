import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

interface Props {
  title?: string;
  variant?: 'padded' | 'list';
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ title, variant = 'padded', style, children }) => (
  <View style={[styles.card, variant === 'padded' ? styles.padded : styles.list, style]}>
    {title ? <Text style={styles.title}>{title}</Text> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  padded: { padding: Spacing.lg },
  list: { paddingVertical: Spacing.xs },
  title: { ...Typography.overline, color: Colors.textSecondary },
});

export default Card;
