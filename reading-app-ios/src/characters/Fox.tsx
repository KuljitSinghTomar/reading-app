import React, { useEffect } from 'react';
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

const FoxHead: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={[
      styles.head,
      {
        width: size * 0.65,
        height: size * 0.6,
        borderRadius: size * 0.32,
        backgroundColor: Colors.red,
      },
    ]}
  >
    {/* Left Ear */}
    <View
      style={[
        styles.ear,
        {
          width: size * 0.18,
          height: size * 0.32,
          left: size * 0.05,
          top: -size * 0.12,
          backgroundColor: Colors.red,
          borderRadius: size * 0.09,
        },
      ]}
    >
      {/* Ear inner */}
      <View
        style={{
          width: size * 0.08,
          height: size * 0.16,
          backgroundColor: Colors.pink,
          borderRadius: size * 0.04,
          alignSelf: 'center',
          marginTop: size * 0.04,
        }}
      />
    </View>

    {/* Right Ear */}
    <View
      style={[
        styles.ear,
        {
          width: size * 0.18,
          height: size * 0.32,
          right: size * 0.05,
          top: -size * 0.12,
          backgroundColor: Colors.red,
          borderRadius: size * 0.09,
        },
      ]}
    >
      {/* Ear inner */}
      <View
        style={{
          width: size * 0.08,
          height: size * 0.16,
          backgroundColor: Colors.pink,
          borderRadius: size * 0.04,
          alignSelf: 'center',
          marginTop: size * 0.04,
        }}
      />
    </View>

    {/* Left Eye */}
    <View
      style={[
        styles.eye,
        {
          width: size * 0.1,
          height: size * 0.14,
          left: size * 0.12,
          top: size * 0.14,
          backgroundColor: Colors.black,
          borderRadius: size * 0.07,
        },
      ]}
    />

    {/* Right Eye */}
    <View
      style={[
        styles.eye,
        {
          width: size * 0.1,
          height: size * 0.14,
          right: size * 0.12,
          top: size * 0.14,
          backgroundColor: Colors.black,
          borderRadius: size * 0.07,
        },
      ]}
    />

    {/* Nose */}
    <View
      style={[
        styles.nose,
        {
          width: size * 0.09,
          height: size * 0.09,
          backgroundColor: Colors.black,
          borderRadius: size * 0.045,
          bottom: size * 0.12,
        },
      ]}
    />
  </View>
);

const FoxBody: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={[
      {
        width: size * 0.5,
        height: size * 0.45,
        borderRadius: size * 0.25,
        backgroundColor: Colors.red,
        marginTop: size * 0.08,
      },
    ]}
  >
    {/* Belly spot */}
    <View
      style={{
        width: size * 0.2,
        height: size * 0.15,
        backgroundColor: Colors.pink,
        borderRadius: size * 0.1,
        alignSelf: 'center',
        marginTop: size * 0.08,
      }}
    />
  </View>
);

export const Fox: React.FC<CharacterProps> = ({ state = 'idle', size = 'medium', onAnimationComplete }) => {
  const sizeMap = {
    small: 60,
    medium: 100,
    large: 140,
  };

  const containerSize = sizeMap[size];
  const headTilt = useSharedValue(0);
  const blinkValue = useSharedValue(1);
  const noseValue = useSharedValue(0);

  // Head tilt animation for thinking
  useEffect(() => {
    if (state === 'thinking') {
      headTilt.value = withSequence(
        withTiming(12, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(-12, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 400 })
      );
    } else if (state === 'happy') {
      headTilt.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 200 }),
          withTiming(-5, { duration: 200 })
        ),
        3
      );
    } else {
      headTilt.value = 0;
    }
  }, [state]);

  // Blinking animation
  useEffect(() => {
    if (state === 'thinking' || state === 'idle') {
      blinkValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3500 }),
          withTiming(0.2, { duration: 120 }),
          withTiming(1, { duration: 100 })
        ),
        -1
      );
    } else {
      blinkValue.value = 1;
    }
  }, [state]);

  // Nose twitch for clever/thinking
  useEffect(() => {
    if (state === 'thinking') {
      noseValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0.7, { duration: 150 }),
          withTiming(1, { duration: 150 })
        ),
        -1
      );
    } else {
      noseValue.value = 0;
    }
  }, [state]);

  const headAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${headTilt.value}deg` }],
  }));

  const eyesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: blinkValue.value,
  }));

  const noseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + noseValue.value * 0.15 }],
  }));

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {/* Main animated head */}
      <Animated.View style={[{ alignItems: 'center' }, headAnimatedStyle]}>
        <FoxHead size={containerSize} />

        {/* Eyes blink effect */}
        <Animated.View
          style={[
            { position: 'absolute', width: containerSize * 0.65, height: containerSize * 0.2, top: containerSize * 0.18 },
            eyesAnimatedStyle,
          ]}
        />

        {/* Nose twitch effect */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: containerSize * 0.09,
              height: containerSize * 0.09,
              backgroundColor: Colors.black,
              borderRadius: containerSize * 0.045,
              bottom: containerSize * 0.22,
            },
            noseAnimatedStyle,
          ]}
        />
      </Animated.View>

      {/* Body */}
      <FoxBody size={containerSize} />

      {/* Tail */}
      <View
        style={{
          position: 'absolute',
          bottom: containerSize * 0.08,
          right: -containerSize * 0.12,
          width: containerSize * 0.28,
          height: containerSize * 0.22,
          backgroundColor: Colors.red,
          borderRadius: containerSize * 0.14,
          borderTopRightRadius: containerSize * 0.02,
          borderBottomRightRadius: containerSize * 0.02,
        }}
      >
        {/* Tail tip - white */}
        <View
          style={{
            position: 'absolute',
            bottom: containerSize * 0.01,
            right: containerSize * 0.01,
            width: containerSize * 0.1,
            height: containerSize * 0.08,
            backgroundColor: Colors.white,
            borderRadius: containerSize * 0.05,
          }}
        />
      </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  eye: {
    position: 'absolute',
  },
  nose: {
    position: 'absolute',
  },
});
