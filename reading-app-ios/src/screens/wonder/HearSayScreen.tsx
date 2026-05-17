import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import {
  HudButton,
  ProgressBar,
  Buddy,
  BuddyState,
  SquishyButton,
  Confetti,
} from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { getLesson, LESSONS } from '../../data/lessons';
import { playLetterSound } from '../../utils/phonicsLabHelpers';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const HOLD_MS = 1700;
const RING_R = 78;
const CIRC = 2 * Math.PI * RING_R;

const speakWord = (word: string, rate = 0.85): Promise<void> =>
  new Promise((resolve) => {
    Speech.speak(word, {
      language: 'en-US',
      rate,
      pitch: 1.05,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });

export const HearSayScreen: React.FC<RootScreenProps<'HearSay'>> = ({
  navigation,
  route,
}) => {
  const { lessonIndex } = route.params;
  const lesson = getLesson(lessonIndex);
  const { width } = useWindowDimensions();
  const words = lesson.sentence.replace(/[.]/g, '').split(' ');

  const [hasListened, setHasListened] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [holding, setHolding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [earlyReleases, setEarlyReleases] = useState(0);
  const [buddy, setBuddy] = useState<BuddyState>('idle');

  const ring = useSharedValue(0);
  const ripple = useSharedValue(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const succeeded = useRef(false);

  useEffect(() => {
    return () => {
      Speech.stop().catch(() => {});
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  const hint = success
    ? 'Wonderful! You said it just right!'
    : !hasListened
    ? `Tap play to hear the “${lesson.letter}” sound, then hold the mic and say it.`
    : earlyReleases >= 2
    ? 'Take a big breath — hold the mic and say it nice and loud!'
    : earlyReleases === 1
    ? 'Hold the mic a little longer, then say the sound out loud.'
    : `Now hold the mic and say: “${lesson.letter}” ... ${lesson.sentence}`;

  const playPrompt = async (rate = 0.85) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    setBuddy('thinking');
    await Speech.stop().catch(() => {});
    await playLetterSound(lesson.letter, lesson.sound).catch(() => {});
    await new Promise((r) => setTimeout(r, 250));
    for (let i = 0; i < words.length; i++) {
      setHighlight(i);
      await speakWord(words[i], rate);
    }
    setHighlight(-1);
    setIsSpeaking(false);
    setHasListened(true);
    setBuddy('happy');
    setTimeout(() => setBuddy('idle'), 900);
  };

  const startHold = () => {
    if (isSpeaking || success) return;
    if (!hasListened) {
      setBuddy('sad');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => {}
      );
      playPrompt();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    succeeded.current = false;
    setHolding(true);
    setBuddy('encouraging');
    ring.value = withTiming(1, { duration: HOLD_MS, easing: Easing.linear });
    ripple.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    holdTimer.current = setTimeout(finishHold, HOLD_MS);
  };

  const stopRipple = () => {
    cancelAnimation(ripple);
    ripple.value = 0;
  };

  const endHold = () => {
    if (succeeded.current) return;
    if (holdTimer.current) clearTimeout(holdTimer.current);
    cancelAnimation(ring);
    ring.value = withTiming(0, { duration: 200 });
    stopRipple();
    if (holding) {
      setHolding(false);
      setEarlyReleases((n) => n + 1);
      setBuddy('idle');
    }
  };

  const finishHold = () => {
    succeeded.current = true;
    setHolding(false);
    setSuccess(true);
    setBuddy('celebrating');
    stopRipple();
    ring.value = withTiming(1, { duration: 120 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
    Speech.speak('Great job! You said it!', { rate: 0.95, pitch: 1.15 });
  };

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRC * (1 - ring.value),
  }));
  const rippleStyle = useAnimatedStyle(() => ({
    opacity: holding ? 0.45 * (1 - ripple.value) : 0,
    transform: [{ scale: 1 + ripple.value * 1.1 }],
  }));

  const micColor = holding ? Palette.green : success ? Palette.green : Palette.primary;
  const micShadow = holding || success ? Palette.greenShadow : Palette.primaryShadow;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <HudButton size={56} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={30} color={Palette.text} />
        </HudButton>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>HEAR &amp; SAY</Text>
          <Text style={styles.headerSub}>
            Level {lesson.id} • {lesson.area}
          </Text>
        </View>
        <View style={styles.progressWrap}>
          <ProgressBar
            progress={(lessonIndex + 0.25) / LESSONS.length}
            color={Palette.primary}
          />
        </View>
      </View>

      <View style={styles.body}>
        {/* Left: audio prompt */}
        <View style={styles.left}>
          <View style={styles.promptCard}>
            <Buddy state={buddy} size={150} />
            <Pressable
              style={styles.playRow}
              onPress={() => playPrompt(0.85)}
              disabled={isSpeaking}
            >
              <View style={[styles.playBtn, { opacity: isSpeaking ? 0.6 : 1 }]}>
                <MaterialCommunityIcons
                  name={isSpeaking ? 'volume-high' : 'play'}
                  size={30}
                  color={Palette.white}
                />
              </View>
              <View style={styles.waveform}>
                {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.7, 0.35, 0.6].map((h, i) => (
                  <View
                    key={i}
                    style={{
                      width: 5,
                      height: 36 * h,
                      borderRadius: 3,
                      backgroundColor:
                        isSpeaking && i <= (highlight % 9)
                          ? Palette.primary
                          : 'rgba(255,75,75,0.22)',
                    }}
                  />
                ))}
              </View>
            </Pressable>
          </View>
          <View style={styles.callout}>
            <View style={styles.calloutIcon}>
              <MaterialCommunityIcons name="bullhorn" size={22} color={Palette.white} />
            </View>
            <Text style={styles.calloutText}>
              Listen to Buddy, then say it back clearly!
            </Text>
          </View>
        </View>

        {/* Right: practice */}
        <View style={styles.right}>
          <View style={styles.bigLetterRow}>
            <Text style={styles.bigLetter}>{lesson.letter}</Text>
          </View>
          <View style={styles.sentence}>
            {words.map((w, i) => (
              <Pressable key={i} onPress={() => speakWord(w, 0.8)}>
                <Text
                  style={[
                    styles.word,
                    highlight === i && styles.wordActive,
                  ]}
                >
                  {w}
                </Text>
              </Pressable>
            ))}
          </View>

          {success ? (
            <View style={styles.successRow}>
              <SquishyButton
                variant="green"
                onPress={() =>
                  navigation.navigate('TraceCanvas', { lessonIndex })
                }
              >
                <Text style={styles.continueText}>CONTINUE</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={28}
                  color={Palette.white}
                  style={{ marginLeft: 12 }}
                />
              </SquishyButton>
            </View>
          ) : (
            <View style={styles.micArea}>
              <Pressable
                onPressIn={startHold}
                onPressOut={endHold}
                style={styles.micPress}
              >
                <Animated.View style={[styles.ripple, rippleStyle]} />
                <View style={[styles.micShadow, { backgroundColor: micShadow }]} />
                <View style={[styles.mic, { backgroundColor: micColor }]}>
                  <MaterialCommunityIcons
                    name="microphone"
                    size={56}
                    color={Palette.white}
                  />
                  <Text style={styles.micLabel}>
                    {holding ? 'KEEP GOING' : 'HOLD'}
                  </Text>
                </View>
                <Svg
                  width={(RING_R + 14) * 2}
                  height={(RING_R + 14) * 2}
                  style={styles.ringSvg}
                >
                  <Circle
                    cx={RING_R + 14}
                    cy={RING_R + 14}
                    r={RING_R}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={10}
                    fill="none"
                  />
                  <AnimatedCircle
                    cx={RING_R + 14}
                    cy={RING_R + 14}
                    r={RING_R}
                    stroke={Palette.yellow}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={CIRC}
                    animatedProps={ringProps}
                    transform={`rotate(-90 ${RING_R + 14} ${RING_R + 14})`}
                  />
                </Svg>
              </Pressable>
              <View style={styles.secondary}>
                <Pressable
                  style={styles.secBtn}
                  onPress={() => playPrompt(0.5)}
                  disabled={isSpeaking}
                >
                  <MaterialCommunityIcons
                    name="turtle"
                    size={26}
                    color={Palette.textSoft}
                  />
                  <Text style={styles.secLabel}>SLOWER</Text>
                </Pressable>
                <Pressable
                  style={styles.secBtn}
                  onPress={() => playPrompt(0.85)}
                  disabled={isSpeaking}
                >
                  <MaterialCommunityIcons
                    name="help-circle"
                    size={26}
                    color={Palette.blue}
                  />
                  <Text style={styles.secLabel}>HELP</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Adaptive hint */}
          <View style={[styles.hintCard, success && styles.hintCardSuccess]}>
            <View
              style={[
                styles.hintIcon,
                { backgroundColor: success ? Palette.green : Palette.yellow },
              ]}
            >
              <MaterialCommunityIcons
                name={success ? 'check-bold' : 'lightbulb-on'}
                size={22}
                color={Palette.white}
              />
            </View>
            <Text style={styles.hintText}>{hint}</Text>
          </View>
        </View>
      </View>

      {success && <Confetti count={30} />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sand },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 14,
    gap: 18,
    backgroundColor: Palette.white,
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
  body: { flex: 1, flexDirection: 'row', padding: 24, gap: 22 },
  left: { width: '40%', justifyContent: 'center', gap: 16 },
  promptCard: {
    backgroundColor: Palette.white,
    borderRadius: 34,
    padding: 24,
    alignItems: 'center',
    gap: 18,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 40,
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF3ED',
    borderRadius: 22,
    padding: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,75,75,0.12)',
  },
  calloutIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutText: {
    flex: 1,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Palette.text,
  },
  right: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: 34,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bigLetterRow: { alignItems: 'center' },
  bigLetter: {
    fontFamily: Fonts.display,
    fontSize: 78,
    color: Palette.primary,
  },
  sentence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  word: {
    fontFamily: Fonts.display,
    fontSize: 32,
    color: Palette.text,
  },
  wordActive: {
    color: Palette.primary,
    textDecorationLine: 'underline',
  },
  micArea: { alignItems: 'center', gap: 14 },
  micPress: {
    width: (RING_R + 14) * 2,
    height: (RING_R + 14) * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSvg: { position: 'absolute' },
  ripple: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Palette.green,
  },
  micShadow: {
    position: 'absolute',
    width: 138,
    height: 138,
    borderRadius: 69,
    top: (RING_R + 14) - 69 + 8,
  },
  mic: {
    width: 138,
    height: 138,
    borderRadius: 69,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micLabel: {
    fontFamily: Fonts.display,
    fontSize: 13,
    color: Palette.white,
    letterSpacing: 2,
    marginTop: 2,
  },
  secondary: { flexDirection: 'row', gap: 36 },
  secBtn: { alignItems: 'center', gap: 4 },
  secLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: Palette.muted,
  },
  successRow: { alignItems: 'center' },
  continueText: { fontFamily: Fonts.display, fontSize: 26, color: Palette.white },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 22,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FCE5B0',
    alignSelf: 'stretch',
  },
  hintCardSuccess: {
    backgroundColor: '#EAFBF1',
    borderColor: '#B6ECCB',
  },
  hintIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Palette.text,
  },
});
