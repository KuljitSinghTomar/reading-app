import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { CharacterProps } from './types';
import { Colors } from '../styles/colors';

// Dog SVG-like component
const DogHead: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={[
      styles.head,
      {
        width: size * 0.6,
        height: size * 0.65,
        borderRadius: size * 0.3,
        backgroundColor: Colors.orange,
      },
    ]}
  >
    {/* Left Ear */}
    <View
      style={[
        styles.ear,
        {
          width: size * 0.2,
          height: size * 0.35,
          left: size * 0.08,
          top: -size * 0.15,
          backgroundColor: Colors.orange,
          borderRadius: size * 0.1,
        },
      ]}
    />
    {/* Right Ear */}
    <View
      style={[
        styles.ear,
        {
          width: size * 0.2,
          height: size * 0.35,
          right: size * 0.08,
          top: -size * 0.15,
          backgroundColor: Colors.orange,
          borderRadius: size * 0.1,
        },
      ]}
    />
    {/* Left Eye */}
    <View
      style={[
        styles.eye,
        {
          width: size * 0.12,
          height: size * 0.15,
          left: size * 0.1,
          top: size * 0.15,
          backgroundColor: Colors.black,
          borderRadius: size * 0.08,
        },
      ]}
    />
    {/* Right Eye */}
    <View
      style={[
        styles.eye,
        {
          width: size * 0.12,
          height: size * 0.15,
          right: size * 0.1,
          top: size * 0.15,
          backgroundColor: Colors.black,
          borderRadius: size * 0.08,
        },
      ]}
    />
    {/* Nose */}
    <View
      style={[
        styles.nose,
        {
          width: size * 0.12,
          height: size * 0.12,
          backgroundColor: Colors.black,
          borderRadius: size * 0.06,
          bottom: size * 0.08,
        },
      ]}
    />
  </View>
);

const DogBody: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={[
      styles.body,
      {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: size * 0.25,
        backgroundColor: Colors.orange,
        marginTop: size * 0.05,
      },
    ]}
  >
    {/* Tail base indicator */}
    <View
      style={[
        styles.tailBase,
        {
          width: size * 0.15,
          height: size * 0.15,
          right: -size * 0.08,
          bottom: size * 0.1,
          backgroundColor: Colors.orange,
          borderRadius: size * 0.08,
        },
      ]}
    />
  </View>
);

export const Dog: React.FC<CharacterProps> = ({ state = 'idle', size = 'medium', onAnimationComplete }) => {
  const sizeMap = {
    small: 60,
    medium: 100,
    large: 140,
  };

  const containerSize = sizeMap[size];
  const tailRotation = useSharedValue(0);
  const blinkValue = useSharedValue(1);
  const mouthValue = useSharedValue(0);

  // Tail wagging animation
  useEffect(() => {
    if (state === 'happy' || state === 'celebrating') {
      tailRotation.value = withRepeat(
        withSequence(
          withTiming(25, { duration: 150, easing: Easing.inOut(Easing.quad) }),
          withTiming(-25, { duration: 150, easing: Easing.inOut(Easing.quad) })
        ),
        state === 'celebrating' ? 4 : 6
      );
    } else {
      tailRotation.value = withTiming(0, { duration: 300 });
    }
  }, [state]);

  // Blinking animation
  useEffect(() => {
    if (state === 'thinking' || state === 'idle') {
      blinkValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3000 }),
          withTiming(0.3, { duration: 100 }),
          withTiming(1, { duration: 100 })
        ),
        -1
      );
    } else {
      blinkValue.value = 1;
    }
  }, [state]);

  // Mouth animation for happy/celebrating
  useEffect(() => {
    if (state === 'happy') {
      mouthValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0.7, { duration: 200 })
        ),
        4
      );
    } else if (state === 'celebrating') {
      mouthValue.value = 1;
    } else {
      mouthValue.value = 0;
    }
  }, [state]);

  const tailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${tailRotation.value}deg` }],
  }));

  const eyesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: blinkValue.value,
  }));

  const mouthAnimatedStyle = useAnimatedStyle(() => ({
    opacity: mouthValue.value,
    transform: [{ scaleY: 0.7 + mouthValue.value * 0.3 }],
  }));

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {/* Head */}
      <DogHead size={containerSize} />

      {/* Eyes blink effect */}
      <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%' }, eyesAnimatedStyle]}>
        {/* Eyes covered during blink - handled by opacity */}
      </Animated.View>

      {/* Happy mouth */}
      {(state === 'happy' || state === 'celebrating') && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: containerSize * 0.15,
              alignSelf: 'center',
              width: containerSize * 0.15,
              height: containerSize * 0.1,
              borderBottomLeftRadius: containerSize * 0.08,
              borderBottomRightRadius: containerSize * 0.08,
              backgroundColor: Colors.pink,
            },
            mouthAnimatedStyle,
          ]}
        />
      )}

      {/* Body */}
      <DogBody size={containerSize} />

      {/* Tail */}
      <Animated.View style={[{ position: 'absolute', bottom: containerSize * 0.15, right: -containerSize * 0.15 }, tailAnimatedStyle]}>
        <View
          style={[
            {
              width: containerSize * 0.2,
              height: containerSize * 0.25,
              backgroundColor: Colors.orange,
              borderRadius: containerSize * 0.1,
              borderTopLeftRadius: containerSize * 0.02,
              borderTopRightRadius: containerSize * 0.15,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  head: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ear: {
    position: 'absolute',
  },
  eye: {
    position: 'absolute',
  },
  nose: {
    position: 'absolute',
  },
  body: {
    position: 'relative',
  },
  tailBase: {
    position: 'absolute',
  },
});
