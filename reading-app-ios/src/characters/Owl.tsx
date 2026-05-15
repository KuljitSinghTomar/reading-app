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

const OwlHead: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={[
      {
        width: size * 0.6,
        height: size * 0.65,
        borderRadius: size * 0.3,
        backgroundColor: Colors.purple,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      },
    ]}
  >
    {/* Left Eye Circle Background */}
    <View
      style={[
        {
          position: 'absolute',
          width: size * 0.18,
          height: size * 0.22,
          left: size * 0.08,
          top: size * 0.12,
          backgroundColor: Colors.white,
          borderRadius: size * 0.11,
        },
      ]}
    >
      {/* Left Eye Pupil */}
      <View
        style={{
          width: size * 0.08,
          height: size * 0.08,
          backgroundColor: Colors.black,
          borderRadius: size * 0.04,
          marginLeft: size * 0.04,
          marginTop: size * 0.06,
        }}
      />
    </View>

    {/* Right Eye Circle Background */}
    <View
      style={[
        {
          position: 'absolute',
          width: size * 0.18,
          height: size * 0.22,
          right: size * 0.08,
          top: size * 0.12,
          backgroundColor: Colors.white,
          borderRadius: size * 0.11,
        },
      ]}
    >
      {/* Right Eye Pupil */}
      <View
        style={{
          width: size * 0.08,
          height: size * 0.08,
          backgroundColor: Colors.black,
          borderRadius: size * 0.04,
          marginLeft: size * 0.06,
          marginTop: size * 0.06,
        }}
      />
    </View>

    {/* Beak */}
    <View
      style={{
        position: 'absolute',
        bottom: size * 0.08,
        width: size * 0.1,
        height: size * 0.12,
        backgroundColor: Colors.yellow,
        borderRadius: size * 0.05,
      }}
    />

    {/* Left Tuft (ear) */}
    <View
      style={{
        position: 'absolute',
        left: size * 0.08,
        top: -size * 0.08,
        width: size * 0.12,
        height: size * 0.2,
        backgroundColor: Colors.purple,
        borderRadius: size * 0.06,
        transform: [{ rotateZ: '-15deg' }],
      }}
    />

    {/* Right Tuft (ear) */}
    <View
      style={{
        position: 'absolute',
        right: size * 0.08,
        top: -size * 0.08,
        width: size * 0.12,
        height: size * 0.2,
        backgroundColor: Colors.purple,
        borderRadius: size * 0.06,
        transform: [{ rotateZ: '15deg' }],
      }}
    />
  </View>
);

const OwlBody: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={{
      width: size * 0.5,
      height: size * 0.45,
      borderRadius: size * 0.25,
      backgroundColor: Colors.purple,
      marginTop: size * 0.05,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {/* Wing pattern */}
    <View
      style={{
        position: 'absolute',
        left: size * 0.05,
        width: size * 0.1,
        height: size * 0.3,
        backgroundColor: Colors.blue,
        borderRadius: size * 0.08,
        opacity: 0.6,
      }}
    />
    <View
      style={{
        position: 'absolute',
        right: size * 0.05,
        width: size * 0.1,
        height: size * 0.3,
        backgroundColor: Colors.blue,
        borderRadius: size * 0.08,
        opacity: 0.6,
      }}
    />
  </View>
);

export const Owl: React.FC<CharacterProps> = ({ state = 'idle', size = 'medium', onAnimationComplete }) => {
  const sizeMap = {
    small: 60,
    medium: 100,
    large: 140,
  };

  const containerSize = sizeMap[size];
  const headNod = useSharedValue(0);
  const blinkValue = useSharedValue(1);

  // Nodding animation for encouraging state
  useEffect(() => {
    if (state === 'encouraging') {
      headNod.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 300, easing: Easing.out(Easing.cubic) }),
          withTiming(-8, { duration: 300, easing: Easing.in(Easing.cubic) })
        ),
        3
      );
    } else if (state === 'happy') {
      headNod.value = withRepeat(
        withSequence(
          withTiming(6, { duration: 250 }),
          withTiming(-6, { duration: 250 })
        ),
        2
      );
    } else {
      headNod.value = 0;
    }
  }, [state]);

  // Blinking animation
  useEffect(() => {
    if (state === 'idle' || state === 'encouraging' || state === 'thinking') {
      blinkValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000 }),
          withTiming(0.1, { duration: 150 }),
          withTiming(1, { duration: 150 })
        ),
        -1
      );
    } else {
      blinkValue.value = 1;
    }
  }, [state]);

  const headAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${headNod.value}deg` }],
  }));

  const eyesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: blinkValue.value,
  }));

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {/* Main head with nod animation */}
      <Animated.View style={[{ alignItems: 'center' }, headAnimatedStyle]}>
        <OwlHead size={containerSize} />
      </Animated.View>

      {/* Eyes blink overlay */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: containerSize * 0.15,
            width: containerSize * 0.6,
            height: containerSize * 0.15,
            backgroundColor: Colors.purple,
            borderRadius: containerSize * 0.3,
          },
          eyesAnimatedStyle,
        ]}
      />

      {/* Body */}
      <OwlBody size={containerSize} />

      {/* Thumbs up indicator for encouraging state */}
      {state === 'encouraging' && (
        <View
          style={{
            position: 'absolute',
            bottom: containerSize * 0.05,
            right: containerSize * 0.02,
            width: containerSize * 0.15,
            height: containerSize * 0.2,
            backgroundColor: Colors.blue,
            borderRadius: containerSize * 0.08,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: containerSize * 0.02,
          }}
        >
          {/* Thumb */}
          <View
            style={{
              width: containerSize * 0.08,
              height: containerSize * 0.08,
              backgroundColor: Colors.blue,
              borderRadius: containerSize * 0.04,
            }}
          />
        </View>
      )}

      {/* Celebrating stars */}
      {state === 'celebrating' && (
        <>
          <View
            style={{
              position: 'absolute',
              top: -containerSize * 0.1,
              left: containerSize * 0.05,
              width: containerSize * 0.1,
              height: containerSize * 0.1,
              backgroundColor: Colors.yellow,
              borderRadius: containerSize * 0.05,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: -containerSize * 0.1,
              right: containerSize * 0.05,
              width: containerSize * 0.1,
              height: containerSize * 0.1,
              backgroundColor: Colors.yellow,
              borderRadius: containerSize * 0.05,
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
