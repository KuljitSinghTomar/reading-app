import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Palette, Radius, softShadow } from '../../theme';

interface CloudCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Asymmetric "cloud" corners instead of uniform rounding. */
  cloud?: boolean;
  color?: string;
  padded?: boolean;
}

export const CloudCard: React.FC<CloudCardProps> = ({
  children,
  style,
  cloud = false,
  color = Palette.surface,
  padded = true,
}) => {
  return (
    <View
      style={[
        styles.base,
        cloud ? styles.cloudCorners : { borderRadius: Radius.lg },
        { backgroundColor: color },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    ...softShadow,
  },
  padded: {
    padding: 24,
  },
  cloudCorners: {
    borderTopLeftRadius: 48,
    borderTopRightRadius: 64,
    borderBottomRightRadius: 52,
    borderBottomLeftRadius: 44,
  },
});

export default CloudCard;
