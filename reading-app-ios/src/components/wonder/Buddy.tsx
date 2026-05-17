import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Palette } from '../../theme';

export type BuddyState =
  | 'idle'
  | 'happy'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'sad';

interface BuddyProps {
  state?: BuddyState;
  size?: number;
  framed?: boolean;
  style?: StyleProp<ViewStyle>;
}

const buddyImage = require('../../../assets/images/wonder/buddy.png');

export const Buddy: React.FC<BuddyProps> = ({
  state = 'idle',
  size = 140,
  framed = true,
  style,
}) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(translateY);
    cancelAnimation(rotate);
    cancelAnimation(scale);

    switch (state) {
      case 'idle':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) })
          ),
          -1
        );
        rotate.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(1, { duration: 200 });
        break;

      case 'happy':
        scale.value = withSequence(
          withTiming(1.12, { duration: 160 }),
          withTiming(1, { duration: 220 })
        );
        rotate.value = withSequence(
          withTiming(7, { duration: 110 }),
          withTiming(-7, { duration: 110 }),
          withTiming(0, { duration: 110 })
        );
        break;

      case 'celebrating':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-26, { duration: 280, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 280, easing: Easing.in(Easing.quad) })
          ),
          4
        );
        rotate.value = withRepeat(
          withSequence(
            withTiming(10, { duration: 200 }),
            withTiming(-10, { duration: 200 })
          ),
          4
        );
        break;

      case 'thinking':
        rotate.value = withRepeat(
          withSequence(
            withTiming(9, { duration: 700, easing: Easing.inOut(Easing.quad) }),
            withTiming(-3, { duration: 700, easing: Easing.inOut(Easing.quad) })
          ),
          -1
        );
        break;

      case 'encouraging':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 230 }),
            withTiming(0, { duration: 230 })
          ),
          3
        );
        break;

      case 'sad':
        // gentle "no" head shake — redirect cue
        rotate.value = withSequence(
          withTiming(-12, { duration: 110 }),
          withRepeat(
            withSequence(
              withTiming(12, { duration: 150 }),
              withTiming(-12, { duration: 150 })
            ),
            3
          ),
          withTiming(0, { duration: 110 })
        );
        break;
    }
  }, [state]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotateZ: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[animStyle, style]}>
      {framed ? (
        <View style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}>
          <Image
            source={buddyImage}
            style={{ width: size * 0.96, height: size * 0.96 }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <Image
          source={buddyImage}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  frame: {
    backgroundColor: Palette.white,
    borderWidth: 6,
    borderColor: Palette.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
});

export default Buddy;
