import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Layout, Radius, Spacing, Typography } from '../../theme';

interface Option<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

const SegmentedControl = <T extends string>({ options, value, onChange }: Props<T>) => (
  <View style={[Layout.row, styles.container]}>
    {options.map(option => {
      const active = option.value === value;
      return (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.segment, active && styles.segmentActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}>
          <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.xs },
  segment: { ...Layout.flex, alignItems: 'center', paddingVertical: Spacing.sm, borderRadius: Radius.sm },
  segmentActive: { backgroundColor: Colors.surfaceHighlight },
  label: { ...Typography.overline, color: Colors.textTertiary },
  labelActive: { color: Colors.textPrimary },
});

export default SegmentedControl;
