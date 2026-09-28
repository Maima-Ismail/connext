import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Radius, Spacing, Typography } from '../../theme';

interface Props {
  message: string;
  tone?: 'error' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
}

const TONES = {
  error: { bg: Colors.negativeSoft, fg: Colors.negative, icon: 'alert-circle' },
  warning: { bg: Colors.warningSoft, fg: Colors.warning, icon: 'cloud-offline' },
};

const Banner: React.FC<Props> = ({ message, tone = 'error', actionLabel, onAction }) => {
  const { bg, fg, icon } = TONES[tone];
  const textColor = { color: fg };

  return (
    <View style={[Layout.row, styles.container, { backgroundColor: bg }]} accessibilityRole="alert">
      <Icon name={icon} size={18} color={fg} />
      <Text style={[styles.text, textColor]}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={Spacing.sm}>
          <Text style={[styles.action, textColor]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.md, borderRadius: Radius.md, gap: Spacing.sm },
  text: { ...Layout.flex, ...Typography.caption, lineHeight: 18 },
  action: { ...Typography.captionStrong, fontWeight: '700' },
});

export default Banner;
