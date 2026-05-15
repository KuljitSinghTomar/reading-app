import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Typography } from '../styles/typography';
import { Colors } from '../styles/colors';

interface BlendSliderProps {
  onSlideChange: (value: number) => void;
  currentValue: number;
}

export const BlendSlider: React.FC<BlendSliderProps> = ({ onSlideChange, currentValue }) => {
  const sliderWidth = 280;
  const thumbWidth = 24;
  const minX = 0;
  const maxX = sliderWidth - thumbWidth;

  const thumbX = useSharedValue(0);
  const thumbScale = useSharedValue(1);

  // Update thumbX based on currentValue
  useEffect(() => {
    const newX = (currentValue / 100) * maxX;
    thumbX.value = withSpring(newX, {
      damping: 15,
      mass: 1,
      overshootClamping: false,
    });
  }, [currentValue]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      let newX = event.x;

      // Constrain to min/max
      if (newX < minX) newX = minX;
      if (newX > maxX) newX = maxX;

      thumbX.value = newX;
      thumbScale.value = 1.2;

      // Calculate percentage and call callback
      const percentage = Math.round((newX / maxX) * 100);
      onSlideChange(percentage);
    })
    .onFinalize(() => {
      thumbScale.value = withSpring(1, {
        damping: 10,
        mass: 1,
      });
    });

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: thumbX.value },
      { scale: thumbScale.value },
    ],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${(currentValue / 100) * 100}%`,
  }));

  // Determine speed label based on current value
  const getSpeedLabel = () => {
    if (currentValue < 30) return 'Slow';
    if (currentValue < 70) return 'Medium';
    return 'Fast';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Blending Speed</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.speedLabel}>Slow</Text>

        <GestureDetector gesture={panGesture}>
          <View style={[styles.sliderTrack, { width: sliderWidth }]}>
            {/* Background track */}
            <View style={styles.trackBackground} />

            {/* Progress indicator */}
            <Animated.View
              style={[styles.trackProgress, progressAnimatedStyle]}
            />

            {/* Thumb */}
            <Animated.View
              style={[
                styles.thumb,
                {
                  width: thumbWidth,
                  height: thumbWidth,
                  borderRadius: thumbWidth / 2,
                },
                thumbAnimatedStyle,
              ]}
            >
              <View style={styles.thumbInner} />
            </Animated.View>
          </View>
        </GestureDetector>

        <Text style={styles.speedLabel}>Fast</Text>
      </View>

      {/* Speed indicator display */}
      <View style={styles.indicator}>
        <Text style={styles.speedValue}>{getSpeedLabel()}</Text>
        <View style={styles.indicatorBars}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.indicatorBar,
                {
                  opacity:
                    index === 0
                      ? 1
                      : index === 1
                        ? currentValue >= 30
                          ? 1
                          : 0.3
                        : currentValue >= 70
                          ? 1
                          : 0.3,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.percentageLabel}>{currentValue}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: 16,
    fontSize: 14,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    columnGap: 16,
  },
  speedLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  sliderTrack: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  trackBackground: {
    position: 'absolute',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    left: 12,
    right: 12,
  },
  trackProgress: {
    position: 'absolute',
    height: 6,
    backgroundColor: Colors.green,
    borderRadius: 3,
    left: 12,
  },
  thumb: {
    position: 'absolute',
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  thumbInner: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    columnGap: 8,
  },
  speedValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  indicatorBars: {
    flexDirection: 'row',
    columnGap: 6,
  },
  indicatorBar: {
    width: 8,
    height: 24,
    backgroundColor: Colors.green,
    borderRadius: 2,
  },
  percentageLabel: {
    ...Typography.label,
    color: Colors.green,
    fontSize: 14,
    fontWeight: '700',
  },
});
