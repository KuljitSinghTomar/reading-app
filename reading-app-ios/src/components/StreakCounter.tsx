import React, { useEffect } from 'react';
import { Text, StyleSheet, View, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';

const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

interface StreakCounterProps {
  days: number;
  onLongPress?: () => void;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  days,
  onLongPress,
}) => {
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    if (days > 0) {
      scaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [days, scaleValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleLongPress = (e: GestureResponderEvent) => {
    if (onLongPress) {
      onLongPress();
    }
  };

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      onLongPress={handleLongPress}
    >
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.days}>{days}</Text>
      <Text style={styles.label}>Day Streak</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flame: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  days: {
    ...Typography.heading1,
    color: Colors.blue,
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
});
