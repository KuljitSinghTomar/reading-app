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

const BearHead: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={[
      {
        width: size * 0.65,
        height: size * 0.62,
        borderRadius: size * 0.32,
        backgroundColor: Colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      },
    ]}
  >
    {/* Left Ear */}
    <View
      style={{
        position: 'absolute',
        left: size * 0.05,
        top: -size * 0.1,
        width: size * 0.16,
        height: size * 0.2,
        backgroundColor: Colors.blue,
        borderRadius: size * 0.1,
      }}
    />

    {/* Right Ear */}
    <View
      style={{
        position: 'absolute',
        right: size * 0.05,
        top: -size * 0.1,
        width: size * 0.16,
        height: size * 0.2,
        backgroundColor: Colors.blue,
        borderRadius: size * 0.1,
      }}
    />

    {/* Left Eye */}
    <View
      style={{
        position: 'absolute',
        width: size * 0.11,
        height: size * 0.14,
        left: size * 0.13,
        top: size * 0.15,
        backgroundColor: Colors.black,
        borderRadius: size * 0.07,
      }}
    />

    {/* Right Eye */}
    <View
      style={{
        position: 'absolute',
        width: size * 0.11,
        height: size * 0.14,
        right: size * 0.13,
        top: size * 0.15,
        backgroundColor: Colors.black,
        borderRadius: size * 0.07,
      }}
    />

    {/* Nose */}
    <View
      style={{
        position: 'absolute',
        width: size * 0.1,
        height: size * 0.1,
        backgroundColor: Colors.black,
        borderRadius: size * 0.05,
        bottom: size * 0.12,
      }}
    />

    {/* Snout area */}
    <View
      style={{
        position: 'absolute',
        width: size * 0.35,
        height: size * 0.25,
        backgroundColor: Colors.green,
        borderRadius: size * 0.18,
        bottom: size * 0.1,
      }}
    />
  </View>
);

const BearBody: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={{
      width: size * 0.55,
      height: size * 0.48,
      borderRadius: size * 0.28,
      backgroundColor: Colors.blue,
      marginTop: size * 0.06,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {/* Belly spot */}
    <View
      style={{
        width: size * 0.25,
        height: size * 0.25,
        backgroundColor: Colors.green,
        borderRadius: size * 0.125,
      }}
    />
  </View>
);

export const Bear: React.FC<CharacterProps> = ({ state = 'idle', size = 'medium', onAnimationComplete }) => {
  const sizeMap = {
    small: 60,
    medium: 100,
    large: 140,
  };

  const containerSize = sizeMap[size];
  const armRaise = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const blinkValue = useSharedValue(1);

  // Arm raising for encouraging/thumbs up
  useEffect(() => {
    if (state === 'encouraging') {
      armRaise.value = withRepeat(
        withSequence(
          withTiming(30, { duration: 400, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) })
        ),
        3
      );
    } else if (state === 'celebrating') {
      armRaise.value = withRepeat(
        withSequence(
          withTiming(35, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        4
      );
    } else {
      armRaise.value = 0;
    }
  }, [state]);

  // Scale for happy state
  useEffect(() => {
    if (state === 'happy') {
      scaleValue.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 250 }),
          withTiming(1, { duration: 250 })
        ),
        3
      );
    } else {
      scaleValue.value = 1;
    }
  }, [state]);

  // Blinking animation
  useEffect(() => {
    if (state === 'idle' || state === 'thinking' || state === 'encouraging') {
      blinkValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3500 }),
          withTiming(0.15, { duration: 140 }),
          withTiming(1, { duration: 120 })
        ),
        -1
      );
    } else {
      blinkValue.value = 1;
    }
  }, [state]);

  const armAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${armRaise.value}deg` }],
  }));

  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const eyesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: blinkValue.value,
  }));

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {/* Head */}
      <View style={{ alignItems: 'center' }}>
        <BearHead size={containerSize} />

        {/* Eyes blink overlay */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: containerSize * 0.12,
              width: containerSize * 0.4,
              height: containerSize * 0.14,
              backgroundColor: Colors.blue,
              borderRadius: containerSize * 0.3,
            },
            eyesAnimatedStyle,
          ]}
        />
      </View>

      {/* Body */}
      <Animated.View style={[{ alignItems: 'center' }, bodyAnimatedStyle]}>
        <BearBody size={containerSize} />
      </Animated.View>

      {/* Left Arm */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: containerSize * 0.02,
            top: containerSize * 0.35,
            width: containerSize * 0.15,
            height: containerSize * 0.22,
            backgroundColor: Colors.blue,
            borderRadius: containerSize * 0.08,
          },
          armAnimatedStyle,
        ]}
      />

      {/* Right Arm - Thumbs up */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            right: containerSize * 0.02,
            top: containerSize * 0.35,
            width: containerSize * 0.15,
            height: containerSize * 0.22,
            backgroundColor: Colors.blue,
            borderRadius: containerSize * 0.08,
          },
          armAnimatedStyle,
        ]}
      >
        {/* Thumb for thumbs up state */}
        {(state === 'encouraging' || state === 'celebrating') && (
          <View
            style={{
              position: 'absolute',
              width: containerSize * 0.08,
              height: containerSize * 0.08,
              backgroundColor: Colors.blue,
              borderRadius: containerSize * 0.04,
              right: containerSize * 0.02,
              top: -containerSize * 0.08,
            }}
          />
        )}
      </Animated.View>

      {/* Happy smile indicator */}
      {state === 'happy' && (
        <View
          style={{
            position: 'absolute',
            bottom: containerSize * 0.22,
            width: containerSize * 0.1,
            height: containerSize * 0.08,
            backgroundColor: Colors.pink,
            borderBottomLeftRadius: containerSize * 0.06,
            borderBottomRightRadius: containerSize * 0.06,
          }}
        />
      )}

      {/* Love hearts for celebrating */}
      {state === 'celebrating' && (
        <>
          <View
            style={{
              position: 'absolute',
              top: containerSize * 0.05,
              left: containerSize * 0.05,
              width: containerSize * 0.12,
              height: containerSize * 0.12,
              backgroundColor: Colors.pink,
              borderRadius: containerSize * 0.06,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: containerSize * 0.05,
              right: containerSize * 0.05,
              width: containerSize * 0.12,
              height: containerSize * 0.12,
              backgroundColor: Colors.pink,
              borderRadius: containerSize * 0.06,
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
