import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Palette, Fonts, Radius, SQUISH_DEPTH } from '../../theme';

type Variant = 'primary' | 'green' | 'yellow' | 'surface' | 'muted' | 'blue';

const VARIANTS: Record<Variant, { face: string; shadow: string; label: string }> = {
  primary: { face: Palette.primary, shadow: Palette.primaryShadow, label: Palette.white },
  green: { face: Palette.green, shadow: Palette.greenShadow, label: Palette.white },
  yellow: { face: Palette.yellow, shadow: Palette.yellowShadow, label: Palette.text },
  surface: { face: Palette.surface, shadow: Palette.surfaceShadow, label: Palette.text },
  muted: { face: Palette.muted, shadow: Palette.mutedShadow, label: Palette.white },
  blue: { face: Palette.blue, shadow: Palette.blueShadow, label: Palette.white },
};

interface SquishyButtonProps {
  label?: string;
  onPress?: () => void;
  variant?: Variant;
  depth?: number;
  radius?: number;
  disabled?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  fontSize?: number;
}

export const SquishyButton: React.FC<SquishyButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  depth = SQUISH_DEPTH,
  radius = Radius.lg,
  disabled = false,
  haptic = true,
  style,
  faceStyle,
  labelStyle,
  children,
  fontSize = 22,
}) => {
  const colors = VARIANTS[variant];
  const press = useSharedValue(0);

  const faceAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * depth }],
  }));

  const handleIn = () => {
    press.value = withTiming(1, { duration: 70 });
  };
  const handleOut = () => {
    press.value = withTiming(0, { duration: 110 });
  };
  const handlePress = () => {
    if (disabled) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPressIn={handleIn}
      onPressOut={handleOut}
      onPress={handlePress}
      disabled={disabled}
      style={[{ opacity: disabled ? 0.55 : 1 }, style]}
    >
      <View style={{ paddingBottom: depth }}>
        {/* Hard drop shadow */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { top: depth, borderRadius: radius, backgroundColor: colors.shadow },
          ]}
        />
        {/* Button face */}
        <Animated.View
          style={[
            styles.face,
            { borderRadius: radius, backgroundColor: colors.face },
            faceAnim,
            faceStyle,
          ]}
        >
          {children ?? (
            <Text style={[styles.label, { color: colors.label, fontSize }, labelStyle]}>
              {label}
            </Text>
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  face: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontFamily: Fonts.display,
    textAlign: 'center',
  },
});

export default SquishyButton;
