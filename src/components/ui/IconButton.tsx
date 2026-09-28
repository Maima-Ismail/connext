import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, HitSlop, Layout, Sizes } from '../../theme';

interface Props {
  icon: string;
  accessibilityLabel: string;
  onPress: () => void;
  testID?: string;
}

const IconButton: React.FC<Props> = ({ icon, accessibilityLabel, onPress, testID }) => (
  <Pressable
    testID={testID}
    onPress={onPress}
    hitSlop={HitSlop}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
    <Icon name={icon} size={20} color={Colors.textPrimary} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    ...Layout.center,
    width: Sizes.iconButton,
    height: Sizes.iconButton,
    borderRadius: Sizes.iconButton / 2,
    backgroundColor: Colors.surface,
  },
  pressed: { backgroundColor: Colors.surfaceRaised },
});

export default IconButton;
