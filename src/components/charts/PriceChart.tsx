import React, { useMemo, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { Colors } from '../../theme';
import { areaPath, downsample, linePath, toPoints } from './buildPath';

interface Props {
  data: number[];
  height?: number;
  onScrub?: (price: number | null) => void;
}

const PriceChart: React.FC<Props> = ({ data, height = 200, onScrub }) => {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const values = useMemo(() => downsample(data, 120), [data]);
  const points = useMemo(() => toPoints(values, width, height, 12), [values, width, height]);
  const up = values.length > 1 && values[values.length - 1] >= values[0];
  const color = up ? Colors.positive : Colors.negative;

  const handleTouch = (e: GestureResponderEvent) => {
    if (!points.length) {
      return;
    }
    const x = Math.min(Math.max(e.nativeEvent.locationX, 0), width);
    const index = Math.round((x / width) * (points.length - 1));
    setActiveIndex(index);
    onScrub?.(values[index]);
  };

  const release = () => {
    setActiveIndex(null);
    onScrub?.(null);
  };

  const active = activeIndex !== null ? points[activeIndex] : null;

  return (
    <View
      style={{ height }}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={handleTouch}
      onResponderMove={handleTouch}
      onResponderRelease={release}
      onResponderTerminate={release}>
      {width > 0 && points.length > 0 ? (
        <Svg width={width} height={height} pointerEvents="none">
          <Defs>
            <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.28} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={areaPath(points, height)} fill="url(#area)" />
          <Path d={linePath(points)} stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
          {active ? (
            <>
              <Line x1={active.x} y1={0} x2={active.x} y2={height} stroke={Colors.textTertiary} strokeDasharray="4 4" />
              <Circle cx={active.x} cy={active.y} r={9} fill={color} opacity={0.25} />
              <Circle cx={active.x} cy={active.y} r={4.5} fill={color} stroke={Colors.background} strokeWidth={2} />
            </>
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
};

export default PriceChart;
