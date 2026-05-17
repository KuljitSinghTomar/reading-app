import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Palette } from '../../theme';

interface ProgressBarProps {
  /** 0 to 1 */
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 18,
  color = Palette.primary,
  trackColor = '#E2E8F0',
  style,
}) => {
  const value = useSharedValue(0);

  useEffect(() => {
    value.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${value.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { borderRadius: height / 2, backgroundColor: color },
          fillStyle,
        ]}
      >
        <View style={[styles.gloss, { borderRadius: height / 2 }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    padding: 3,
  },
  fill: {
    height: '100%',
    minWidth: 12,
    justifyContent: 'flex-start',
  },
  gloss: {
    height: '38%',
    marginTop: 2,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

export default ProgressBar;
