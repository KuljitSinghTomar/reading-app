import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Badge } from '../store/progressSlice';
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

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badge,
  size = 'medium',
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 100 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeMap = {
    small: { width: 60, height: 60, fontSize: 24 },
    medium: { width: 100, height: 100, fontSize: 40 },
    large: { width: 140, height: 140, fontSize: 56 },
  };

  const size_config = sizeMap[size];

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          width: size_config.width,
          height: size_config.height,
        },
        animatedStyle,
      ]}
    >
      <Text style={{ fontSize: size_config.fontSize }}>
        {badge.icon}
      </Text>
      {size !== 'small' && (
        <Text style={styles.title}>{badge.title}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.yellow,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
  },
  title: {
    ...Typography.label,
    color: Colors.white,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 11,
  },
});
