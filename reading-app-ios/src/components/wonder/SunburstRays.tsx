import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Palette } from '../../theme';

interface SunburstRaysProps {
  size?: number;
  rays?: number;
  color?: string;
}

export const SunburstRays: React.FC<SunburstRaysProps> = ({
  size = 520,
  rays = 16,
  color = Palette.yellow,
}) => {
  const spin = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.linear }),
      -1
    );
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${spin.value * 360}deg` }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { width: size, height: size },
        spinStyle,
      ]}
    >
      {Array.from({ length: rays }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.ray,
            {
              width: size * 0.13,
              height: size,
              backgroundColor: color,
              transform: [{ rotateZ: `${(360 / rays) * i}deg` }],
            },
          ]}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.45,
  },
  ray: {
    position: 'absolute',
    borderRadius: 999,
  },
});

export default SunburstRays;
