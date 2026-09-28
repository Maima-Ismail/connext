import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../theme';

interface Props {
  width: DimensionValue;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

const PULSE_MS = 700;

const Skeleton: React.FC<Props> = ({ width, height, radius = Radius.sm, style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: PULSE_MS, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: PULSE_MS, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.base, { width, height, borderRadius: radius, opacity }, style]} />;
};

const styles = StyleSheet.create({
  base: { backgroundColor: Colors.surfaceHighlight },
});

export default Skeleton;
