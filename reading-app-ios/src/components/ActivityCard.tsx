import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
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

interface ActivityCardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  isLocked?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  icon,
  color,
  onPress,
  isLocked = false,
}) => {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePress = () => {
    if (!isLocked) {
      scaleValue.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      onPress();
    }
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor: color }, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        {isLocked && <Text style={styles.lock}>🔒</Text>}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: Spacing.xl,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  pressable: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.heading2,
    color: Colors.white,
  },
  lock: {
    fontSize: 20,
    marginTop: Spacing.sm,
  },
});
