import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Spacing, Typography } from '../../theme';
import AppButton from './AppButton';
import BottomSheet from './BottomSheet';

interface Props {
  visible: boolean;
  icon: string;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
}

const ICON_SIZE = 64;

const ConfirmSheet: React.FC<Props> = ({
  visible,
  icon,
  title,
  message,
  confirmLabel,
  tone = 'primary',
  onConfirm,
  onCancel,
  testID,
}) => {
  const danger = tone === 'danger';

  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <View style={styles.header}>
        <View style={[Layout.center, styles.icon, danger ? styles.iconDanger : styles.iconPrimary]}>
          <Icon name={icon} size={28} color={danger ? Colors.negative : Colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <AppButton testID={testID} title={confirmLabel} variant={tone} onPress={onConfirm} />
      <AppButton title="Cancel" variant="ghost" onPress={onCancel} style={styles.cancel} />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  icon: { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2, marginBottom: Spacing.lg },
  iconPrimary: { backgroundColor: Colors.primarySoft },
  iconDanger: { backgroundColor: Colors.negativeSoft },
  title: { ...Typography.h2, color: Colors.textPrimary, textAlign: 'center' },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 21,
  },
  cancel: { marginTop: Spacing.sm },
});

export default ConfirmSheet;
