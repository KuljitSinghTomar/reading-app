import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import {
  SquishyButton,
  Confetti,
  SunburstRays,
  ProgressBar,
} from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { getLesson, LESSONS, countCompletedLessons } from '../../data/lessons';
import { useProgress } from '../../hooks/useProgress';

const celebrationBg = require('../../../assets/images/wonder/celebration-bg.png');

export const CelebrationScreen: React.FC<RootScreenProps<'Celebration'>> = ({
  navigation,
  route,
}) => {
  const { lessonIndex } = route.params;
  const lesson = getLesson(lessonIndex);
  const { progress, recordLetterLearned, recordWordMastered, updateDailyStreak } =
    useProgress();
  const recorded = useRef(false);

  const [opened, setOpened] = useState(false);

  const shake = useSharedValue(0);
  const giftScale = useSharedValue(1);
  const stickerScale = useSharedValue(0);
  const bannerY = useSharedValue(20);

  useEffect(() => {
    if (!recorded.current) {
      recorded.current = true;
      recordLetterLearned(lesson.letter);
      recordWordMastered(lesson.blend.word);
      updateDailyStreak();
    }
    shake.value = withRepeat(
      withSequence(
        withTiming(-1, { duration: 110 }),
        withTiming(1, { duration: 110 })
      ),
      -1,
      true
    );
    Speech.speak('Hooray! You did it!', { rate: 0.95, pitch: 1.2 });
  }, []);

  const openGift = () => {
    if (opened) return;
    setOpened(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
    shake.value = 0;
    giftScale.value = withSequence(
      withTiming(1.3, { duration: 160 }),
      withTiming(0, { duration: 220 })
    );
    stickerScale.value = withSequence(
      withTiming(0, { duration: 200 }),
      withSpring(1, { damping: 8, stiffness: 120 })
    );
    bannerY.value = withSpring(0, { damping: 9 });
    Speech.speak(`You unlocked the ${lesson.reward.name}!`, {
      rate: 0.95,
      pitch: 1.15,
    });
  };

  const giftStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: giftScale.value },
      { rotateZ: `${shake.value * 7}deg` },
    ],
  }));
  const stickerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stickerScale.value }],
  }));
  const bannerStyle = useAnimatedStyle(() => ({
    opacity: bannerY.value === 20 ? 0 : 1,
    transform: [{ translateY: bannerY.value }],
  }));

  const treasures = countCompletedLessons(progress.lettersLearned || []);

  return (
    <View style={styles.root}>
      <ImageBackground source={celebrationBg} style={styles.bg} resizeMode="cover">
        <View style={styles.tint} />
        <Confetti count={44} />

        {/* Treasure progress */}
        <View style={styles.top}>
          <View style={styles.treasureCard}>
            <View style={styles.treasureHead}>
              <MaterialCommunityIcons
                name="trophy"
                size={22}
                color={Palette.yellow}
              />
              <Text style={styles.treasureTitle}>TREASURE PROGRESS</Text>
              <View style={styles.treasureCount}>
                <Text style={styles.treasureCountText}>
                  {treasures}/{LESSONS.length}
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={treasures / LESSONS.length}
              color={Palette.yellow}
              height={16}
            />
          </View>
        </View>

        {/* Center reward */}
        <View style={styles.center}>
          <View style={styles.raysWrap} pointerEvents="none">
            <SunburstRays size={460} />
          </View>

          {!opened && (
            <Pressable onPress={openGift}>
              <Animated.View style={[styles.gift, giftStyle]}>
                <MaterialCommunityIcons
                  name="gift"
                  size={130}
                  color={Palette.white}
                />
              </Animated.View>
              <Text style={styles.tapHint}>TAP TO OPEN!</Text>
            </Pressable>
          )}

          {opened && (
            <View style={styles.rewardWrap}>
              <Animated.View style={[styles.banner, bannerStyle]}>
                <Text style={styles.bannerText}>NEW TREASURE!</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.stickerCard,
                  { borderColor: lesson.reward.color },
                  stickerStyle,
                ]}
              >
                <Text style={styles.stickerEmoji}>{lesson.reward.emoji}</Text>
              </Animated.View>
              <Text style={styles.rewardName}>{lesson.reward.name}</Text>
            </View>
          )}
        </View>

        {/* Continue */}
        <View style={styles.bottom}>
          <SquishyButton
            variant="primary"
            radius={36}
            depth={12}
            onPress={() => navigation.navigate('MapExplorer')}
            faceStyle={{ paddingVertical: 20, paddingHorizontal: 56 }}
          >
            <Text style={styles.yay}>YAY!</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={40}
              color={Palette.white}
              style={{ marginLeft: 14 }}
            />
          </SquishyButton>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sky },
  bg: { flex: 1 },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.12)' },
  top: { alignItems: 'center', paddingTop: 26 },
  treasureCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 28,
    padding: 16,
    minWidth: 360,
    borderWidth: 4,
    borderColor: Palette.white,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  treasureHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  treasureTitle: {
    flex: 1,
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Palette.textSoft,
    letterSpacing: 1,
  },
  treasureCount: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 999,
  },
  treasureCountText: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Palette.white,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  raysWrap: { position: 'absolute' },
  gift: {
    width: 200,
    height: 200,
    borderRadius: 44,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: Palette.white,
  },
  tapHint: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Palette.text,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
  },
  rewardWrap: { alignItems: 'center' },
  banner: {
    backgroundColor: Palette.white,
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: Palette.yellow,
    marginBottom: 14,
    zIndex: 2,
  },
  bannerText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: '#E07B1A',
    letterSpacing: 1,
  },
  stickerCard: {
    width: 210,
    height: 210,
    borderRadius: 40,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
  stickerEmoji: { fontSize: 124 },
  rewardName: {
    fontFamily: Fonts.display,
    fontSize: 30,
    color: Palette.text,
    marginTop: 16,
  },
  bottom: { alignItems: 'center', paddingBottom: 30 },
  yay: { fontFamily: Fonts.display, fontSize: 42, color: Palette.white },
});
