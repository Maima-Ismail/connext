import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Sizes, Spacing, Typography } from '../../theme';
import AppButton from './AppButton';
import Card from './Card';

interface Props {
  icon: string;
  title: string;
  message?: string;
  tone?: 'neutral' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

const ICON_SIZE = 60;

const StateView: React.FC<Props> = ({ icon, title, message, tone = 'neutral', actionLabel, onAction }) => {
  const isError = tone === 'error';
  return (
    <Card style={styles.container}>
      <View style={[styles.iconWrap, isError ? styles.iconError : styles.iconNeutral]}>
        <Icon name={icon} size={28} color={isError ? Colors.negative : Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <AppButton title={actionLabel} icon="refresh" variant="secondary" onPress={onAction} style={styles.action} />
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: Spacing.xl },
  iconWrap: {
    ...Layout.center,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    marginBottom: Spacing.lg,
  },
  iconNeutral: { backgroundColor: Colors.primarySoft },
  iconError: { backgroundColor: Colors.negativeSoft },
  title: { ...Typography.h3, color: Colors.textPrimary, textAlign: 'center' },
  message: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 19,
  },
  action: { marginTop: Spacing.lg, height: Sizes.controlSmall, alignSelf: 'stretch' },
});

export default StateView;
