import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { LogoColors } from '../../theme';

interface Props {
  height: number;
  background?: 'dark' | 'light';
}

const VIEWBOX_WIDTH = 1033;
const VIEWBOX_HEIGHT = 1144;

const BrandLogo: React.FC<Props> = ({ height, background = 'dark' }) => (
  <Svg
    width={(height * VIEWBOX_WIDTH) / VIEWBOX_HEIGHT}
    height={height}
    viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
    accessibilityRole="image"
    accessibilityLabel="CONNEXT logo">
    <Defs>
      <LinearGradient id="logoFront" x1="0" y1="0" x2="0.35" y2="1">
        <Stop offset="0" stopColor={LogoColors.frontStart} />
        <Stop offset="0.55" stopColor={LogoColors.front} />
      </LinearGradient>
    </Defs>
    <Path fill={LogoColors.top} d="M310,62 C560,-40 800,-10 1030,224 L812,224 C620,40 450,10 310,62 Z" />
    <Path fill={LogoColors.facet} d="M812,224 L1030,224 L879,444 L670,431 Z" />
    <Path
      fill={LogoColors.shade[background]}
      d="M310,62 C450,10 620,40 812,224 L670,431 C630,360 590,315 550,288 C350,430 420,750 560,836 C605,805 640,765 670,697 L877,697 L1025,912 C900,1040 740,1142 548,1142 C200,1142 -80,760 30,390 C80,250 170,120 310,62 Z"
    />
    <Path
      fill="url(#logoFront)"
      d="M463,258 C330,258 262,450 262,595 C262,770 350,900 470,960 C680,1065 870,1020 1025,912 L877,697 C790,830 690,885 560,836 C350,710 350,340 550,288 C520,268 492,258 463,258 Z"
    />
  </Svg>
);

export default React.memo(BrandLogo);
