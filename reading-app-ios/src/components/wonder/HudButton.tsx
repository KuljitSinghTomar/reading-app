import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Palette, Fonts } from '../../theme';

type Variant = 'surface' | 'primary' | 'green' | 'yellow' | 'muted' | 'blue';

const VARIANTS: Record<Variant, { face: string; shadow: string }> = {
  surface: { face: Palette.surface, shadow: Palette.surfaceShadow },
  primary: { face: Palette.primary, shadow: Palette.primaryShadow },
  green: { face: Palette.green, shadow: Palette.greenShadow },
  yellow: { face: Palette.yellow, shadow: Palette.yellowShadow },
  muted: { face: Palette.muted, shadow: Palette.mutedShadow },
  blue: { face: Palette.blue, shadow: Palette.blueShadow },
};

interface HudButtonProps {
  size?: number;
  depth?: number;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  badge?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const HudButton: React.FC<HudButtonProps> = ({
  size = 64,
  depth = 7,
  variant = 'surface',
  onPress,
  disabled = false,
  badge,
  children,
  style,
}) => {
  const colors = VARIANTS[variant];
  const press = useSharedValue(0);

  const faceAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * depth }],
  }));

  return (
    <Pressable
      onPressIn={() => (press.value = withTiming(1, { duration: 70 }))}
      onPressOut={() => (press.value = withTiming(0, { duration: 110 }))}
      onPress={() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      disabled={disabled}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
    >
      <View style={{ paddingBottom: depth }}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { top: depth, borderRadius: size / 2, backgroundColor: colors.shadow },
          ]}
        />
        <Animated.View
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.face,
              alignItems: 'center',
              justifyContent: 'center',
            },
            faceAnim,
          ]}
        >
          {children}
        </Animated.View>
        {badge != null && badge > 0 && (
          <View style={[styles.badge, { borderRadius: 14 }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 28,
    height: 28,
    paddingHorizontal: 6,
    backgroundColor: Palette.primary,
    borderWidth: 3,
    borderColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: Fonts.display,
    fontSize: 14,
    color: Palette.white,
  },
});

export default HudButton;
