import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import { HudButton, Buddy, ProgressBar } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { getLesson, LESSONS } from '../../data/lessons';
import { playBlendedSounds, playWord, stopSpeech } from '../../utils/blendingHelpers';

const BLOCK_COLORS = [Palette.pink, Palette.coral, '#4B2038'];
const HANDLE = 92;

const BlenderBlock: React.FC<{
  index: number;
  letter: string;
  size: number;
  spreadPx: number;
  x: SharedValue<number>;
  maxX: number;
}> = ({ index, letter, size, spreadPx, x, maxX }) => {
  const style = useAnimatedStyle(() => {
    const ratio = x.value / maxX;
    const spread = (1 - ratio) * spreadPx;
    return { transform: [{ translateX: (index - 1) * spread }] };
  });
  return (
    <Animated.View style={style}>
      <View style={[styles.blockOuter, { width: size, height: size }]}>
        <View
          style={[
            styles.blockInner,
            { backgroundColor: BLOCK_COLORS[index % BLOCK_COLORS.length] },
          ]}
        >
          <Text style={styles.blockLetter}>{letter.toUpperCase()}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export const BlenderBridgeScreen: React.FC<RootScreenProps<'BlenderBridge'>> = ({
  navigation,
  route,
}) => {
  const { lessonIndex } = route.params;
  const lesson = getLesson(lessonIndex);
  const { width } = useWindowDimensions();
  const letters = lesson.blend.letters;

  const blockSize = 150;
  const trackW = Math.min(width * 0.72, 760);
  const maxX = trackW - HANDLE - 12;

  const x = useSharedValue(0);
  const wordPulse = useSharedValue(1);
  const [blended, setBlended] = useState(false);
  const lastStep = useRef(-1);
  const doneRef = useRef(false);

  React.useEffect(() => {
    return () => {
      stopSpeech().catch(() => {});
    };
  }, []);

  const handleRatio = (ratio: number) => {
    const step = Math.floor(ratio * 6);
    if (step !== lastStep.current && ratio > 0.05) {
      lastStep.current = step;
      playBlendedSounds(letters, ratio * 100).catch(() => {});
      Haptics.selectionAsync().catch(() => {});
    }
    if (ratio >= 0.95 && !doneRef.current) {
      doneRef.current = true;
      finishBlend();
    }
  };

  const finishBlend = () => {
    setBlended(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
    setTimeout(() => playWord(lesson.blend.word).catch(() => {}), 200);
    wordPulse.value = withSequence(
      withSpring(1.25, { damping: 6 }),
      withSpring(1, { damping: 8 })
    );
    setTimeout(() => {
      navigation.navigate('Celebration', { lessonIndex });
    }, 1700);
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onChange((e) => {
      if (doneRef.current) return;
      const next = Math.max(0, Math.min(maxX, x.value + e.changeX));
      x.value = next;
      handleRatio(next / maxX);
    })
    .onEnd(() => {
      if (doneRef.current) return;
      if (x.value < maxX * 0.95) {
        // leave it where released so kids can build up gradually
      }
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: x.value + HANDLE,
  }));
  const wordStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wordPulse.value }],
  }));

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <HudButton size={56} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={30} color={Palette.text} />
        </HudButton>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>BLENDER BRIDGE</Text>
          <Text style={styles.headerSub}>Level {lesson.id} • Blend the sounds</Text>
        </View>
        <View style={styles.progressWrap}>
          <ProgressBar
            progress={(lessonIndex + 0.85) / LESSONS.length}
            color={Palette.primary}
          />
        </View>
      </View>

      <View style={styles.body}>
        {/* Letter blocks */}
        <View style={[styles.blockRow, { height: blockSize + 30 }]}>
          {letters.map((letter, i) => (
            <BlenderBlock
              key={i}
              index={i}
              letter={letter}
              size={blockSize}
              spreadPx={blockSize * 0.62}
              x={x}
              maxX={maxX}
            />
          ))}
        </View>

        {/* Blended word */}
        <Animated.View style={[styles.wordPill, wordStyle]}>
          <Text
            style={[
              styles.wordText,
              { color: blended ? Palette.green : 'rgba(45,55,72,0.25)' },
            ]}
          >
            {lesson.blend.word.toUpperCase()}
          </Text>
        </Animated.View>

        {/* Blender slider */}
        <View style={styles.sliderPanel}>
          <View style={styles.sliderHead}>
            <View style={styles.sliderHeadLeft}>
              <MaterialCommunityIcons
                name="auto-fix"
                size={20}
                color="rgba(45,55,72,0.4)"
              />
              <Text style={styles.sliderLabel}>SLIDE TO BLEND LETTERS</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                {blended ? 'BLENDED!' : 'READY TO PLAY'}
              </Text>
            </View>
          </View>

          <View style={[styles.track, { width: trackW }]}>
            <Animated.View style={[styles.trackFill, fillStyle]} />
            <Text style={[styles.trackEnd, styles.trackStart]}>START</Text>
            <Text style={[styles.trackEnd, styles.trackFinish]}>FINISH</Text>
            <GestureDetector gesture={pan}>
              <Animated.View style={[styles.handle, handleStyle]}>
                <View style={styles.handleInner}>
                  <MaterialCommunityIcons
                    name="gesture-swipe-horizontal"
                    size={36}
                    color={Palette.white}
                  />
                </View>
              </Animated.View>
            </GestureDetector>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Buddy state={blended ? 'celebrating' : 'thinking'} size={64} />
            <View>
              <Text style={styles.footerKicker}>BLENDING WORD</Text>
              <Text style={styles.footerWord}>
                {letters.map((l) => l.toUpperCase()).join(' - ')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E9EBEF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 22,
    gap: 18,
  },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Palette.text,
    letterSpacing: 1,
  },
  headerSub: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Palette.muted,
    letterSpacing: 1.5,
  },
  progressWrap: { width: 220 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockOuter: {
    backgroundColor: Palette.white,
    borderRadius: 32,
    padding: 12,
    marginHorizontal: 2,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
  },
  blockInner: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockLetter: {
    fontFamily: Fonts.display,
    fontSize: 92,
    color: Palette.white,
  },
  wordPill: {
    backgroundColor: Palette.white,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 999,
  },
  wordText: {
    fontFamily: Fonts.display,
    fontSize: 34,
    letterSpacing: 6,
  },
  sliderPanel: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 44,
    padding: 24,
    borderWidth: 2,
    borderColor: Palette.white,
  },
  sliderHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  sliderHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sliderLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: 'rgba(45,55,72,0.5)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(72,187,120,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.green,
  },
  statusText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    color: '#1B7A45',
  },
  track: {
    height: 84,
    backgroundColor: '#D6DAE0',
    borderRadius: 42,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(72,187,120,0.45)',
    borderRadius: 42,
  },
  trackEnd: {
    position: 'absolute',
    fontFamily: Fonts.display,
    fontSize: 17,
    color: 'rgba(45,55,72,0.35)',
    letterSpacing: 2,
  },
  trackStart: { left: 44 },
  trackFinish: { right: 40 },
  handle: {
    position: 'absolute',
    left: 6,
    width: HANDLE,
    height: HANDLE,
    borderRadius: HANDLE / 2,
    backgroundColor: Palette.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: Palette.white,
  },
  handleInner: {
    width: HANDLE * 0.62,
    height: HANDLE * 0.62,
    borderRadius: HANDLE,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { flexDirection: 'row' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  footerKicker: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: Palette.muted,
  },
  footerWord: {
    fontFamily: Fonts.display,
    fontSize: 26,
    color: Palette.text,
    letterSpacing: 3,
  },
});
