import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Radius, Sizes, Spacing, Typography } from '../../theme';

interface Props extends TextInputProps {
  label: string;
  icon?: string;
  error?: string | null;
  hint?: string;
  right?: React.ReactNode;
}

const TextField = forwardRef<TextInput, Props>(
  ({ label, icon, error, hint, right, style, onFocus, onBlur, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const borderColor = error ? Colors.negative : focused ? Colors.primary : Colors.border;

    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.field, { borderColor }]}>
          {icon ? (
            <Icon name={icon} size={18} color={focused ? Colors.primary : Colors.textTertiary} style={styles.icon} />
          ) : null}
          <TextInput
            ref={ref}
            placeholderTextColor={Colors.textTertiary}
            selectionColor={Colors.primary}
            style={[styles.input, style]}
            onFocus={e => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={e => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />
          {right}
        </View>
        {error ? (
          <View style={[Layout.row, styles.message]}>
            <Icon name="alert-circle" size={14} color={Colors.negative} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : hint ? (
          <Text style={[styles.message, styles.hint]}>{hint}</Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  label: { ...Typography.overline, color: Colors.textSecondary, marginBottom: Spacing.sm },
  field: {
    ...Layout.row,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    minHeight: Sizes.control,
  },
  icon: { marginRight: Spacing.sm },
  input: { ...Layout.flex, ...Typography.body, color: Colors.textPrimary, paddingVertical: Spacing.lg },
  message: { marginTop: Spacing.sm },
  error: { ...Typography.caption, color: Colors.negative, marginLeft: Spacing.xs },
  hint: { ...Typography.caption, color: Colors.textTertiary },
});

export default TextField;
