import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import {
  calculateSwipedLetters,
  getSwipeProgress,
  isSwipeComplete,
  getLetterColor,
} from '../utils/swipeHelpers';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';

export interface SwipeTargetProps {
  text: string;
  letters: string[];
  onSwipeComplete: (word: string) => void;
  onLetterHit?: (index: number) => void;
  enabled?: boolean;
}

const SWIPE_WIDTH = 300;
const COMPLETE_THRESHOLD = 0.9;

export const SwipeTarget: React.FC<SwipeTargetProps> = ({
  text,
  letters,
  onSwipeComplete,
  onLetterHit,
  enabled = true,
}) => {
  const { gesture, animatedStyle, translateX, reset } = useSwipeGesture();
  const previousSwipedCount = useRef(0);
  const hasCompletedRef = useRef(false);
  const containerWidth = useSharedValue(SWIPE_WIDTH);
  const pulseScale = useSharedValue(1);

  // Handle swipe completion
  useEffect(() => {
    const unsubscribe = translateX.addListener(({ value }) => {
      const progress = getSwipeProgress(value, SWIPE_WIDTH);
      const swipedLetters = calculateSwipedLetters(
        value,
        letters.length,
        SWIPE_WIDTH
      );

      // Trigger letter hit callbacks for newly swiped letters
      if (onLetterHit && swipedLetters.length > previousSwipedCount.current) {
        const newLetterIndex = swipedLetters.length - 1;
        runOnJS(onLetterHit)(newLetterIndex);
      }
      previousSwipedCount.current = swipedLetters.length;

      // Check if swipe is complete
      if (
        isSwipeComplete(progress, COMPLETE_THRESHOLD) &&
        !hasCompletedRef.current &&
        enabled
      ) {
        hasCompletedRef.current = true;
        // Trigger completion with slight delay
        setTimeout(() => {
          runOnJS(onSwipeComplete)(text);
        }, 100);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [letters.length, onLetterHit, onSwipeComplete, text, translateX, enabled]);

  // Reset state when word changes
  useEffect(() => {
    previousSwipedCount.current = 0;
    hasCompletedRef.current = false;
    reset();
  }, [text, reset]);

  // Animated styles for individual letters
  const animatedLetterStyles = letters.map((_, index) => {
    return useAnimatedStyle(() => {
      const progress = getSwipeProgress(translateX.value, SWIPE_WIDTH);
      const swipedLetters = calculateSwipedLetters(
        translateX.value,
        letters.length,
        SWIPE_WIDTH
      );
      const isHit = swipedLetters.includes(index);

      return {
        backgroundColor: isHit ? Colors.yellow : '#E8E8E8',
        transform: [{ scale: isHit ? 1.1 : 1 }],
      };
    });
  });

  // Swipe trail animation
  const trailAnimatedStyle = useAnimatedStyle(() => ({
    width: Math.max(translateX.value, 0),
    opacity: Math.min(translateX.value / SWIPE_WIDTH, 1),
  }));

  // Pulse effect on word completion
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <GestureDetector gesture={enabled ? gesture : undefined}>
      <View style={styles.container}>
        {/* Word Display */}
        <Text style={[styles.word, { color: Colors.text }]}>{text}</Text>

        {/* Swipe Container */}
        <View style={styles.swipeContainer}>
          {/* Swipe Trail Background */}
          <Animated.View style={[styles.swipeTrailBg, trailAnimatedStyle]} />

          {/* Letter Boxes */}
          <View style={styles.letterRow}>
            {letters.map((letter, index) => (
              <Animated.View
                key={index}
                style={[styles.letterBox, animatedLetterStyles[index]]}
              >
                <Text style={[styles.letter, { color: Colors.text }]}>
                  {letter.toUpperCase()}
                </Text>
              </Animated.View>
            ))}
          </View>

          {/* Active Swipe Trail Indicator */}
          <Animated.View style={[styles.activeTrail, animatedStyle]} />
        </View>

        {/* Instructions */}
        <Text style={[styles.instruction, { color: Colors.textSecondary }]}>
          ← Swipe left to right →
        </Text>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                useAnimatedStyle(() => ({
                  width: `${Math.min((translateX.value / SWIPE_WIDTH) * 100, 100)}%`,
                })),
              ]}
            />
          </View>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  word: {
    ...Typography.heading2,
    marginBottom: 20,
    letterSpacing: 2,
  },
  swipeContainer: {
    position: 'relative',
    width: SWIPE_WIDTH,
    height: 100,
    marginBottom: 16,
  },
  swipeTrailBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    opacity: 0.3,
  },
  activeTrail: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 8,
    backgroundColor: Colors.blue,
    borderRadius: 4,
    opacity: 0.7,
  },
  letterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  letterBox: {
    width: 50,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#E8E8E8',
  },
  letter: {
    ...Typography.phonicsLetter,
    fontWeight: '700',
  },
  instruction: {
    ...Typography.body,
    marginBottom: 12,
    marginTop: 8,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 3,
  },
});
