import { Image, type ImageStyle, type StyleProp } from 'react-native';

const logo = require('../assets/arys-rx-logo.png');

type Props = {
  size: number;
  style?: StyleProp<ImageStyle>;
};

export function BrandLogo({ size, style }: Props) {
  const radius = size / 2;
  return (
    <Image
      accessibilityLabel="ARYS-Rx"
      accessibilityRole="image"
      source={logo}
      style={[{ width: size, height: size, borderRadius: radius }, style]}
    />
  );
}
