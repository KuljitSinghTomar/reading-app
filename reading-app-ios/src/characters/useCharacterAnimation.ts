import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { CharacterState } from './types';

export const useCharacterAnimation = (state: CharacterState) => {
  const scaleValue = useSharedValue(1);
  const rotationValue = useSharedValue(0);
  const opacityValue = useSharedValue(1);
  const bounceValue = useSharedValue(0);

  useEffect(() => {
    switch (state) {
      case 'celebrating':
        // Bounce animation
        scaleValue.value = withSequence(
          withTiming(1.15, { duration: 200, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 200, easing: Easing.in(Easing.cubic) })
        );
        bounceValue.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 300, easing: Easing.out(Easing.cubic) }),
            withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) })
          ),
          2
        );
        break;

      case 'happy':
        // Scale up and wiggle
        scaleValue.value = withTiming(1.1, { duration: 300, easing: Easing.out(Easing.cubic) });
        rotationValue.value = withSequence(
          withTiming(5, { duration: 100 }),
          withTiming(-5, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
        break;

      case 'thinking':
        // Gentle tilt
        rotationValue.value = withSequence(
          withTiming(10, { duration: 600, easing: Easing.inOut(Easing.quad) }),
          withTiming(-10, { duration: 600, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 300 })
        );
        scaleValue.value = 1;
        break;

      case 'encouraging':
        // Nod animation
        rotationValue.value = withSequence(
          withTiming(8, { duration: 200 }),
          withTiming(-8, { duration: 200 }),
          withTiming(0, { duration: 200 })
        );
        scaleValue.value = 1;
        break;

      case 'idle':
      default:
        // Subtle breathing animation
        scaleValue.value = withRepeat(
          withSequence(
            withTiming(1.02, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) })
          ),
          -1
        );
        rotationValue.value = 0;
        break;
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleValue.value },
      { rotateZ: `${rotationValue.value}deg` },
      { translateY: bounceValue.value },
    ],
    opacity: opacityValue.value,
  }));

  return {
    scaleValue,
    rotationValue,
    opacityValue,
    bounceValue,
    animatedStyle,
  };
};
