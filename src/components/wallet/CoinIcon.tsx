import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CoinColors, Colors, Layout, Sizes } from '../../theme';
import { AssetSymbol } from '../../types';

interface Props {
  symbol: AssetSymbol;
  imageUrl?: string;
  size?: number;
}

const CoinIcon: React.FC<Props> = ({ symbol, imageUrl, size = Sizes.coinIcon }) => {
  const [failed, setFailed] = useState(false);
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (imageUrl && !failed) {
    return <Image source={{ uri: imageUrl }} style={[styles.image, shape]} onError={() => setFailed(true)} />;
  }

  return (
    <View style={[Layout.center, shape, { backgroundColor: CoinColors[symbol] }]}>
      <Text style={[styles.letter, { fontSize: size * 0.38 }]}>{symbol.charAt(0)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: { backgroundColor: Colors.surfaceRaised },
  letter: { color: Colors.textOnPrimary, fontWeight: '700' },
});

export default CoinIcon;
