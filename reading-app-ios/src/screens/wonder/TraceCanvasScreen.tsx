import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import { HudButton, Buddy, ProgressBar } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { getLesson, LESSONS } from '../../data/lessons';
import { playLetterSound } from '../../utils/phonicsLabHelpers';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export const TraceCanvasScreen: React.FC<RootScreenProps<'TraceCanvas'>> = ({
  navigation,
  route,
}) => {
  const { lessonIndex } = route.params;
  const lesson = getLesson(lessonIndex);
  const { width, height } = useWindowDimensions();

  const boxSize = Math.min(height * 0.6, width * 0.46);
  const TARGET = boxSize * 2.6;

  const [progress, setProgress] = useState(0);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [traced, setTraced] = useState(false);

  const cumulative = useRef(0);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const trailId = useRef(0);

  const fillScale = useSharedValue(1);
  const startPulse = useSharedValue(0);

  React.useEffect(() => {
    startPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0, { duration: 700 })
      ),
      -1
    );
  }, []);

  const completeTrace = () => {
    if (traced) return;
    setTraced(true);
    setProgress(1);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
    playLetterSound(lesson.letter, lesson.sound).catch(() => {});
    fillScale.value = withSequence(
      withTiming(1.14, { duration: 220, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 220 })
    );
  };

  const addPoint = (x: number, y: number, begin: boolean) => {
    if (traced) return;
    if (begin || !lastPoint.current) {
      lastPoint.current = { x, y };
    } else {
      const dx = x - lastPoint.current.x;
      const dy = y - lastPoint.current.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 4) return;
      cumulative.current = Math.min(TARGET, cumulative.current + d);
      lastPoint.current = { x, y };
    }
    trailId.current += 1;
    setTrail((prev) => [...prev.slice(-15), { x, y, id: trailId.current }]);
    const p = cumulative.current / TARGET;
    setProgress(p);
    if (p >= 1) completeTrace();
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onBegin((e) => addPoint(e.x, e.y, true))
    .onUpdate((e) => addPoint(e.x, e.y, false))
    .onEnd(() => {
      lastPoint.current = null;
    });

  const reset = () => {
    cumulative.current = 0;
    lastPoint.current = null;
    setTrail([]);
    setProgress(0);
    setTraced(false);
  };

  const fillStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, progress * 1.1),
    transform: [{ scale: fillScale.value }],
  }));
  const startStyle = useAnimatedStyle(() => ({
    opacity: traced ? 0 : 0.5 + startPulse.value * 0.5,
    transform: [{ scale: 1 + startPulse.value * 0.25 }],
  }));

  return (
    <View style={styles.root}>
      <View style={styles.dots} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <HudButton size={56} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={30} color={Palette.text} />
        </HudButton>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>TRACE THE LETTER</Text>
          <Text style={styles.headerSub}>
            Mastering letter {lesson.letter}
          </Text>
        </View>
        <View style={styles.progressWrap}>
          <ProgressBar
            progress={(lessonIndex + 0.55) / LESSONS.length}
            color={Palette.primary}
          />
        </View>
      </View>

      {/* Trace area */}
      <View style={styles.canvas}>
        <GestureDetector gesture={pan}>
          <View
            style={[
              styles.traceBox,
              { width: boxSize, height: boxSize },
            ]}
          >
            {/* Gray track letter */}
            <Text
              style={[
                styles.letter,
                { fontSize: boxSize * 0.92, lineHeight: boxSize, color: '#E2DDD6' },
              ]}
            >
              {lesson.letter}
            </Text>
            {/* Coral fill letter */}
            <Animated.Text
              style={[
                styles.letter,
                styles.letterFill,
                {
                  fontSize: boxSize * 0.92,
                  lineHeight: boxSize,
                  color: Palette.primary,
                },
                fillStyle,
              ]}
            >
              {lesson.letter}
            </Animated.Text>
            {/* Brush trail */}
            {trail.map((pt, i) => (
              <View
                key={pt.id}
                style={[
                  styles.trailDot,
                  {
                    left: pt.x - 14,
                    top: pt.y - 14,
                    opacity: 0.25 + (i / trail.length) * 0.6,
                  },
                ]}
              />
            ))}
            {/* Start dot */}
            <Animated.View style={[styles.startDot, startStyle]}>
              <MaterialCommunityIcons
                name="gesture-tap"
                size={26}
                color={Palette.white}
              />
            </Animated.View>
          </View>
        </GestureDetector>

        {/* Buddy companion */}
        <View style={styles.buddyWrap}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              {traced ? 'You did it! 🎉' : 'Trace along the letter!'}
            </Text>
          </View>
          <Buddy state={traced ? 'celebrating' : 'idle'} size={120} />
        </View>

        {/* Tool palette */}
        <View style={styles.tools}>
          <View style={[styles.tool, styles.toolActive]}>
            <MaterialCommunityIcons name="pencil" size={26} color={Palette.white} />
          </View>
          <Pressable style={styles.tool} onPress={reset}>
            <MaterialCommunityIcons name="eraser" size={26} color={Palette.muted} />
          </Pressable>
        </View>
      </View>

      {/* Swipe-to-read bar */}
      <SwipeToRead
        word={lesson.traceWord}
        enabled={traced}
        width={Math.min(width * 0.66, 720)}
        onComplete={() =>
          navigation.navigate('BlenderBridge', { lessonIndex })
        }
      />
    </View>
  );
};

const HANDLE = 78;

const SwipeToRead: React.FC<{
  word: string;
  enabled: boolean;
  width: number;
  onComplete: () => void;
}> = ({ word, enabled, width, onComplete }) => {
  const letters = word.toUpperCase().split('');
  const maxX = width - HANDLE - 12;
  const x = useSharedValue(0);
  const [lit, setLit] = useState(0);
  const litRef = useRef(0);
  const doneRef = useRef(false);

  const updateLit = (count: number) => {
    if (count !== litRef.current) {
      if (count > litRef.current && count <= letters.length) {
        const letter = letters[count - 1];
        playLetterSound(letter, letter.toLowerCase()).catch(() => {});
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      litRef.current = count;
      setLit(count);
    }
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
    onComplete();
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(enabled)
    .onChange((e) => {
      const next = Math.max(0, Math.min(maxX, x.value + e.changeX));
      x.value = next;
      const ratio = next / maxX;
      updateLit(Math.round(ratio * letters.length));
    })
    .onEnd(() => {
      if (x.value > maxX * 0.85) {
        x.value = withTiming(maxX, { duration: 150 });
        updateLit(letters.length);
        finish();
      } else {
        x.value = withSpring(0);
        updateLit(0);
      }
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: x.value + HANDLE,
  }));

  return (
    <View style={styles.swipeWrap}>
      <View style={[styles.swipeBar, { width, opacity: enabled ? 1 : 0.55 }]}>
        <Animated.View style={[styles.swipeFill, fillStyle]} />
        <View style={styles.swipeLetters} pointerEvents="none">
          {letters.map((l, i) => (
            <Text
              key={i}
              style={[
                styles.swipeLetter,
                { color: i < lit ? Palette.white : 'rgba(45,55,72,0.18)' },
              ]}
            >
              {l}
            </Text>
          ))}
        </View>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.swipeHandle, handleStyle]}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={44}
              color={Palette.text}
            />
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles.swipePromptBubble}>
        <MaterialCommunityIcons name="gesture-swipe-right" size={20} color={Palette.white} />
        <Text style={styles.swipePromptText}>
          {enabled ? 'SWIPE TO READ' : 'TRACE THE LETTER FIRST'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.cream },
  dots: { ...StyleSheet.absoluteFillObject },
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
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traceBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: Fonts.display,
    textAlign: 'center',
    position: 'absolute',
  },
  letterFill: {},
  trailDot: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primary,
  },
  startDot: {
    position: 'absolute',
    top: '14%',
    left: '20%',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Palette.white,
  },
  buddyWrap: {
    position: 'absolute',
    left: 30,
    bottom: 10,
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: Palette.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: 6,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  speechText: { fontFamily: Fonts.bodyBold, fontSize: 14, color: Palette.text },
  tools: {
    position: 'absolute',
    right: 28,
    top: '30%',
    gap: 16,
  },
  tool: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  toolActive: { backgroundColor: Palette.primary },
  swipeWrap: {
    alignItems: 'center',
    paddingBottom: 28,
  },
  swipeBar: {
    height: 96,
    backgroundColor: Palette.white,
    borderRadius: 48,
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#F1EDE9',
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
  swipeFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Palette.primary,
    borderRadius: 48,
  },
  swipeLetters: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: HANDLE,
  },
  swipeLetter: {
    fontFamily: Fonts.display,
    fontSize: 40,
    letterSpacing: 2,
  },
  swipeHandle: {
    position: 'absolute',
    left: 6,
    width: HANDLE,
    height: HANDLE,
    borderRadius: HANDLE / 2,
    backgroundColor: Palette.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Palette.white,
  },
  swipePromptBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -16,
    backgroundColor: Palette.primary,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  swipePromptText: {
    fontFamily: Fonts.display,
    fontSize: 14,
    color: Palette.white,
    letterSpacing: 1.5,
  },
});
