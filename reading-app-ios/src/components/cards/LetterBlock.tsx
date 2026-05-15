import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';

export interface LetterBlockProps {
  letter: string;
  color: string;
  size?: number;
  onPress: () => void;
  isLearned?: boolean;
}

export const LetterBlock: React.FC<LetterBlockProps> = ({
  letter,
  color,
  size = 100,
  onPress,
  isLearned = false,
}) => {
  const scaleAnim = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    // Scale bounce animation
    scaleAnim.value = withSequence(
      withTiming(0.85, {
        duration: 100,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(1.15, {
        duration: 100,
        easing: Easing.out(Easing.back(1.2)),
      }),
      withTiming(1, {
        duration: 100,
        easing: Easing.in(Easing.quad),
      })
    );

    setIsPressed(true);
    onPress();

    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 300);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.blockContainer,
        {
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={[
          styles.block,
          {
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: size * 0.15,
            opacity: isPressed ? 0.8 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.letterText,
            {
              fontSize: size * 0.45,
              color: Colors.white,
            },
          ]}
        >
          {letter}
        </Text>

        {/* Learned badge */}
        {isLearned && (
          <View
            style={[
              styles.learnedBadge,
              {
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: size * 0.175,
                bottom: -size * 0.1,
              },
            ]}
          >
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blockContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  letterText: {
    fontWeight: '700',
    fontFamily: 'System',
  },
  learnedBadge: {
    position: 'absolute',
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
    borderWidth: 2,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
