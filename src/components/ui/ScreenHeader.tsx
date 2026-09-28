import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Layout, Sizes, Spacing, Typography } from '../../theme';
import IconButton from './IconButton';

interface Props {
  title: string;
  onBack: () => void;
}

const ScreenHeader: React.FC<Props> = ({ title, onBack }) => (
  <View style={[Layout.rowBetween, styles.container]}>
    <IconButton icon="chevron-back" accessibilityLabel="Go back" onPress={onBack} />
    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>
    <View style={styles.spacer} />
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  title: { ...Layout.flex, ...Typography.h3, color: Colors.textPrimary, textAlign: 'center' },
  spacer: { width: Sizes.iconButton },
});

export default ScreenHeader;
