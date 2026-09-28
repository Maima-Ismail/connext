import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../theme';
import ScreenHeader from './ScreenHeader';

interface Props {
  title?: string;
  onBack?: () => void;
  edges?: Edge[];
  children: React.ReactNode;
}

const EXTRA_EDGE_SPACING = Platform.select({
  android: { top: Spacing.md, bottom: Spacing.lg },
  default: { top: 0, bottom: 0 },
});

const Screen: React.FC<Props> = ({ title, onBack, edges = ['top', 'bottom'], children }) => {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: edges.includes('top') ? insets.top + EXTRA_EDGE_SPACING.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom + EXTRA_EDGE_SPACING.bottom : 0,
  };

  return (
    <View style={[styles.container, padding]}>
      {title && onBack ? <ScreenHeader title={title} onBack={onBack} /> : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
});

export default Screen;
