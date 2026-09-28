import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Radius, Sizes, Spacing, Typography } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const VARIANTS: Record<Variant, { bg: string; pressed: string; text: string; border: string }> = {
  primary: { bg: Colors.primary, pressed: Colors.primaryPressed, text: Colors.textOnPrimary, border: Colors.primary },
  secondary: {
    bg: Colors.surfaceRaised,
    pressed: Colors.surfaceHighlight,
    text: Colors.textPrimary,
    border: Colors.border,
  },
  ghost: { bg: 'transparent', pressed: Colors.surfaceRaised, text: Colors.textSecondary, border: 'transparent' },
  danger: { bg: Colors.negative, pressed: Colors.negativePressed, text: Colors.textOnPrimary, border: Colors.negative },
};

const AppButton: React.FC<Props> = ({ title, onPress, variant = 'primary', icon, loading, disabled, style, testID }) => {
  const palette = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: pressed ? palette.pressed : palette.bg, borderColor: palette.border },
        disabled && !loading && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={18} color={palette.text} style={styles.icon} /> : null}
          <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    ...Layout.row,
    justifyContent: 'center',
    height: Sizes.control,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
  },
  disabled: { opacity: 0.45 },
  icon: { marginRight: Spacing.sm },
  title: { ...Typography.bodyStrong, fontSize: 16 },
});

export default AppButton;
