import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors, Layout } from '../../theme';
import BrandLogo from './BrandLogo';

const LOGO_HEIGHT = 88;

const SplashView: React.FC = () => (
  <View style={[Layout.center, styles.container]}>
    <BrandLogo height={LOGO_HEIGHT} />
    <ActivityIndicator color={Colors.primary} style={styles.spinner} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  spinner: { position: 'absolute', bottom: '20%' },
});

export default SplashView;
