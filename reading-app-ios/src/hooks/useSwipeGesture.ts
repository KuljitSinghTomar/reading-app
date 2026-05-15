import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface UseSwipeGestureReturn {
  gesture: any;
  animatedStyle: Animated.AnimateStyle<{
    transform: Array<any>;
    opacity: number;
  }>;
  translateX: Animated.SharedValue<number>;
  reset: () => void;
}

export const useSwipeGesture = (): UseSwipeGestureReturn => {
  const translateX = useSharedValue(0);
  const isActive = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only respond to left-to-right swipes (positive translationX)
      if (event.translationX > 0) {
        translateX.value = event.translationX;
        isActive.value = 1;
      }
    })
    .onEnd(() => {
      // Reset position with smooth animation
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.quad),
      });
      isActive.value = withTiming(0, { duration: 300 });
    })
    .onFinalize(() => {
      // Ensure cleanup
      translateX.value = 0;
      isActive.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: isActive.value,
  }));

  const reset = useCallback(() => {
    translateX.value = 0;
    isActive.value = 0;
  }, [translateX, isActive]);

  return { gesture, animatedStyle, translateX, reset };
};
