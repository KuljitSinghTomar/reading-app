import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { RootScreenProps } from '../../navigation/types';
import { HudButton } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { useProgress } from '../../hooks/useProgress';
import {
  LESSONS,
  getCurrentLessonIndex,
  isLessonComplete,
  countCompletedLessons,
} from '../../data/lessons';

const mapBg = require('../../../assets/images/wonder/map-bg.png');

// Node anchor points along a winding island trail (fractions of the screen).
const NODE_POS = [
  { x: 0.11, y: 0.74 },
  { x: 0.24, y: 0.55 },
  { x: 0.37, y: 0.7 },
  { x: 0.49, y: 0.5 },
  { x: 0.61, y: 0.68 },
  { x: 0.73, y: 0.46 },
  { x: 0.84, y: 0.64 },
  { x: 0.93, y: 0.42 },
];

type NodeStatus = 'done' | 'current' | 'locked';

const MapNode: React.FC<{
  status: NodeStatus;
  size: number;
  onPress: () => void;
}> = ({ status, size, onPress }) => {
  const press = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (status === 'current') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
        ),
        -1
      );
    }
  }, [status]);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: press.value * 6 - pulse.value * 8 },
      { scale: 1 + pulse.value * 0.06 },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.5 - pulse.value * 0.5,
    transform: [{ scale: 1 + pulse.value * 0.5 }],
  }));

  const face =
    status === 'done'
      ? Palette.yellow
      : status === 'current'
      ? Palette.primary
      : Palette.muted;
  const shadow =
    status === 'done'
      ? Palette.yellowShadow
      : status === 'current'
      ? Palette.primaryShadow
      : Palette.mutedShadow;
  const icon =
    status === 'done' ? 'star' : status === 'current' ? 'play' : 'lock';

  return (
    <Pressable
      onPressIn={() => (press.value = withTiming(1, { duration: 70 }))}
      onPressOut={() => (press.value = withTiming(0, { duration: 110 }))}
      onPress={() => {
        if (status === 'locked') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress();
      }}
      style={{ width: size, height: size + 8 }}
    >
      {status === 'current' && (
        <Animated.View
          style={[
            styles.pulseRing,
            { width: size, height: size, borderRadius: size / 2 },
            ringStyle,
          ]}
        />
      )}
      <View style={[StyleSheet.absoluteFill, { top: 8 }]}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: shadow,
          }}
        />
      </View>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: face,
            borderWidth: 6,
            borderColor: Palette.white,
            alignItems: 'center',
            justifyContent: 'center',
          },
          faceStyle,
        ]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={size * 0.5}
          color={Palette.white}
        />
      </Animated.View>
    </Pressable>
  );
};

const Sailboat: React.FC<{ x: number; y: number; delay: number; range: number }> = ({
  x,
  y,
  delay,
  range,
}) => {
  const drift = useSharedValue(0);
  useEffect(() => {
    drift.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.sin) })
        ),
        -1
      )
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: drift.value * range }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y }, style]}>
      <MaterialCommunityIcons name="sail-boat" size={42} color="rgba(255,255,255,0.85)" />
    </Animated.View>
  );
};

export const MapExplorerScreen: React.FC<RootScreenProps<'MapExplorer'>> = ({
  navigation,
}) => {
  const { width, height } = useWindowDimensions();
  const { progress } = useProgress();
  const lettersLearned = progress.lettersLearned || [];
  const currentIndex = getCurrentLessonIndex(lettersLearned);
  const completed = countCompletedLessons(lettersLearned);

  // Cloud-wipe reveal on entry.
  const cloud = useSharedValue(1);
  useFocusEffect(
    React.useCallback(() => {
      cloud.value = 1;
      cloud.value = withTiming(0, { duration: 850, easing: Easing.out(Easing.cubic) });
    }, [])
  );
  const cloudStyle = useAnimatedStyle(() => ({
    opacity: cloud.value,
    transform: [{ scale: 1 + (1 - cloud.value) * 1.6 }],
  }));

  const points = NODE_POS.map((p) => ({ x: p.x * width, y: p.y * height }));
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(0)} ${p.y.toFixed(0)}`)
    .join(' ');

  const nodeStatus = (i: number): NodeStatus => {
    if (isLessonComplete(LESSONS[i], lettersLearned)) return 'done';
    if (i === currentIndex) return 'current';
    return 'locked';
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={mapBg} style={styles.bg} resizeMode="cover">
        <Sailboat x={width * 0.3} y={height * 0.2} delay={0} range={60} />
        <Sailboat x={width * 0.66} y={height * 0.78} delay={3000} range={-50} />

        {/* Winding adventure path */}
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Path
            d={pathD}
            stroke="rgba(45,55,72,0.35)"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray="2 26"
            fill="none"
          />
        </Svg>

        {/* Level nodes */}
        {LESSONS.map((lesson, i) => {
          const status = nodeStatus(i);
          const size = status === 'current' ? 100 : 74;
          return (
            <View
              key={lesson.id}
              style={{
                position: 'absolute',
                left: points[i].x - size / 2,
                top: points[i].y - size / 2,
              }}
            >
              <MapNode
                status={status}
                size={size}
                onPress={() =>
                  navigation.navigate('ActivityIntro', { lessonIndex: i })
                }
              />
            </View>
          );
        })}

        {/* HUD: top-left settings */}
        <View style={styles.topLeft}>
          <HudButton
            size={66}
            onPress={() => navigation.navigate('ParentDashboard')}
          >
            <MaterialCommunityIcons name="cog" size={34} color={Palette.textSoft} />
          </HudButton>
        </View>

        {/* HUD: top-right sticker book */}
        <View style={styles.topRight}>
          <HudButton
            size={78}
            variant="surface"
            badge={completed}
            onPress={() => navigation.navigate('StickerBook')}
          >
            <MaterialCommunityIcons name="star" size={42} color={Palette.yellow} />
          </HudButton>
        </View>

        {/* HUD: bottom-right story library */}
        <View style={styles.bottomRight}>
          <HudButton
            size={78}
            variant="surface"
            onPress={() => navigation.navigate('StoryLibrary')}
          >
            <MaterialCommunityIcons
              name="book-open-variant"
              size={40}
              color={Palette.primary}
            />
          </HudButton>
        </View>

        {/* Banner */}
        <View style={styles.banner} pointerEvents="none">
          <Text style={styles.bannerText}>WONDER ISLAND</Text>
        </View>

        {/* Cloud-wipe reveal */}
        <Animated.View
          pointerEvents="none"
          style={[styles.cloudWipe, cloudStyle]}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sky },
  bg: { flex: 1 },
  topLeft: { position: 'absolute', top: 28, left: 32 },
  topRight: { position: 'absolute', top: 28, right: 32 },
  bottomRight: { position: 'absolute', bottom: 28, right: 32 },
  banner: {
    position: 'absolute',
    top: 34,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bannerText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Palette.text,
    letterSpacing: 2,
  },
  pulseRing: {
    position: 'absolute',
    top: 8,
    backgroundColor: Palette.primary,
  },
  cloudWipe: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Palette.white,
  },
});
