import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import { CloudCard, SquishyButton, HudButton, Buddy } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { getLesson } from '../../data/lessons';
import { playLetterSound } from '../../utils/phonicsLabHelpers';

const mapBg = require('../../../assets/images/wonder/map-bg.png');

export const ActivityIntroScreen: React.FC<RootScreenProps<'ActivityIntro'>> = ({
  navigation,
  route,
}) => {
  const { lessonIndex } = route.params;
  const lesson = getLesson(lessonIndex);
  const { width } = useWindowDimensions();

  const enter = useSharedValue(0);
  const cover = useSharedValue(0);

  useEffect(() => {
    enter.value = withDelay(
      80,
      withSpring(1, { damping: 11, stiffness: 130, mass: 0.9 })
    );
    playLetterSound(lesson.letter, lesson.sound).catch(() => {});
  }, []);

  const cloudStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 0.6 + enter.value * 0.4 }],
  }));

  const coverStyle = useAnimatedStyle(() => ({
    opacity: cover.value,
    transform: [{ scale: 0.2 + cover.value * 3 }],
  }));

  const goToHearSay = () => {
    navigation.navigate('HearSay', { lessonIndex });
  };

  const handleGo = () => {
    cover.value = withTiming(
      1,
      { duration: 420, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(goToHearSay)();
      }
    );
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={mapBg} style={styles.bg} resizeMode="cover">
        <View style={styles.dim} />

        {/* Header */}
        <View style={styles.header}>
          <HudButton size={62} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={32}
              color={Palette.text}
            />
          </HudButton>
          <View style={styles.levelPill}>
            <View style={styles.levelDot}>
              <Text style={styles.levelDotText}>{lesson.id}</Text>
            </View>
            <Text style={styles.levelText}>{lesson.area}</Text>
          </View>
          <View style={{ width: 62 }} />
        </View>

        {/* Cloud modal */}
        <View style={styles.center}>
          <Animated.View style={[{ width: Math.min(width * 0.62, 640) }, cloudStyle]}>
            <CloudCard cloud style={styles.cloud}>
              <Text style={styles.kicker}>TODAY'S SOUND</Text>
              <View style={styles.divider} />
              <View style={styles.letterTile}>
                <Text style={styles.letter}>{lesson.letter}</Text>
              </View>
              <Text style={styles.prompt}>
                Let's learn the “{lesson.letter}” sound and find the {lesson.reward.name}!
              </Text>
            </CloudCard>
            {/* GO button overlapping the cloud edge */}
            <View style={styles.goWrap}>
              <SquishyButton variant="green" onPress={handleGo} radius={32}>
                <Text style={styles.goText}>GO!</Text>
                <View style={styles.goIcon}>
                  <MaterialCommunityIcons
                    name="play"
                    size={30}
                    color={Palette.white}
                  />
                </View>
              </SquishyButton>
            </View>
          </Animated.View>
        </View>

        {/* Footer: guide */}
        <View style={styles.footer}>
          <View style={styles.guideCard}>
            <Buddy state="happy" size={52} />
            <View>
              <Text style={styles.guideKicker}>YOUR GUIDE</Text>
              <Text style={styles.guideName}>Buddy is ready!</Text>
            </View>
          </View>
        </View>

        {/* Cloud wipe transition */}
        <Animated.View pointerEvents="none" style={[styles.cover, coverStyle]} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sky },
  bg: { flex: 1 },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.4)' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 26,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  levelDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelDotText: { fontFamily: Fonts.display, color: Palette.white, fontSize: 16 },
  levelText: { fontFamily: Fonts.display, color: Palette.text, fontSize: 18 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cloud: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 40 },
  kicker: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Palette.primary,
    letterSpacing: 3,
  },
  divider: {
    width: 56,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,75,75,0.2)',
    marginTop: 8,
    marginBottom: 18,
  },
  letterTile: {
    width: 150,
    height: 150,
    borderRadius: 36,
    backgroundColor: Palette.sand,
    borderWidth: 8,
    borderColor: 'rgba(255,75,75,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: { fontFamily: Fonts.display, fontSize: 96, color: Palette.text },
  prompt: {
    fontFamily: Fonts.body,
    fontSize: 19,
    color: Palette.textSoft,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 27,
    maxWidth: 380,
  },
  goWrap: { alignItems: 'center', marginTop: -28 },
  goText: { fontFamily: Fonts.display, fontSize: 38, color: Palette.white },
  goIcon: {
    marginLeft: 14,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { position: 'absolute', bottom: 26, left: 32 },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    paddingRight: 22,
    borderRadius: 999,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  guideKicker: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: Palette.muted,
  },
  guideName: { fontFamily: Fonts.display, fontSize: 16, color: Palette.text },
  cover: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Palette.white,
  },
});
