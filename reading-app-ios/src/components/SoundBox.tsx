import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Typography } from '../styles/typography';

interface SoundBoxProps {
  sound: string;
  color: string;
  isActive: boolean;
  size?: number;
}

export const SoundBox: React.FC<SoundBoxProps> = ({ sound, color, isActive, size = 100 }) => {
  const scale = useSharedValue(isActive ? 1.1 : 1);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.1 : 1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
      restSpeedThreshold: 2,
      restDisplacementThreshold: 2,
    });
    opacity.value = withSpring(isActive ? 1 : 0.5, {
      damping: 10,
      mass: 1,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size * 0.12,
        },
        animatedStyle,
      ]}
    >
      <Text style={[styles.soundText, { fontSize: size * 0.4 }]}>{sound.toUpperCase()}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  soundText: {
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
