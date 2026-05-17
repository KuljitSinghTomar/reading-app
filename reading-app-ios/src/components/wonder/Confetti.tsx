import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Palette } from '../../theme';

const COLORS = [
  Palette.primary,
  Palette.yellow,
  Palette.green,
  Palette.blue,
  Palette.pink,
  Palette.purple,
];

interface PieceProps {
  startX: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  round: boolean;
  height: number;
  drift: number;
}

const Piece: React.FC<PieceProps> = ({
  startX,
  delay,
  duration,
  color,
  size,
  round,
  height,
  drift,
}) => {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-60, height + 60]) },
      { translateX: interpolate(t.value, [0, 0.5, 1], [0, drift, 0]) },
      { rotateZ: `${interpolate(t.value, [0, 1], [0, 720])}deg` },
    ],
    opacity: interpolate(t.value, [0, 0.85, 1], [1, 1, 0]),
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          top: 0,
          width: size,
          height: round ? size : size * 0.5,
          backgroundColor: color,
          borderRadius: round ? size : 3,
        },
        style,
      ]}
    />
  );
};

interface ConfettiProps {
  count?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ count = 36 }) => {
  const { width, height } = useWindowDimensions();

  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        startX: Math.random() * width,
        delay: Math.random() * 2600,
        duration: 2400 + Math.random() * 2400,
        color: COLORS[i % COLORS.length],
        size: 10 + Math.random() * 14,
        round: Math.random() > 0.5,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count, width]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map(({ id, ...p }) => (
        <Piece key={id} height={height} {...p} />
      ))}
    </View>
  );
};

export default Confetti;
