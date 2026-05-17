import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import { HudButton } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { useProgress } from '../../hooks/useProgress';
import { progressService } from '../../services/progressService';
import { LESSONS, isLessonComplete, countCompletedLessons } from '../../data/lessons';

const StatChip: React.FC<{ icon: any; value: string | number; label: string; color: string }> = ({
  icon,
  value,
  label,
  color,
}) => (
  <View style={styles.statChip}>
    <View style={[styles.statIcon, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={26} color={Palette.white} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const StickerBookScreen: React.FC<RootScreenProps<'StickerBook'>> = ({
  navigation,
}) => {
  const { progress } = useProgress();
  const stats = progressService.getStats(progress);
  const lettersLearned = progress.lettersLearned || [];
  const treasures = countCompletedLessons(lettersLearned);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <HudButton size={58} variant="primary" onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={32} color={Palette.white} />
        </HudButton>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>My Sticker Book</Text>
          <Text style={styles.subtitle}>
            {treasures} of {LESSONS.length} treasures found
          </Text>
        </View>
        <View style={styles.streakPill}>
          <MaterialCommunityIcons name="fire" size={26} color={Palette.yellow} />
          <Text style={styles.streakText}>{progress.streakDays || 0} day streak</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatChip
            icon="alphabetical-variant"
            value={stats.lettersLearned}
            label="Letters"
            color={Palette.primary}
          />
          <StatChip
            icon="text"
            value={stats.wordsMastered}
            label="Words"
            color={Palette.green}
          />
          <StatChip
            icon="star"
            value={treasures}
            label="Treasures"
            color={Palette.yellow}
          />
          <StatChip
            icon="clock-outline"
            value={`${stats.totalMinutes}m`}
            label="Playtime"
            color={Palette.blue}
          />
        </View>

        {/* Sticker grid */}
        <Text style={styles.sectionTitle}>Treasure Collection</Text>
        <View style={styles.grid}>
          {LESSONS.map((lesson) => {
            const unlocked = isLessonComplete(lesson, lettersLearned);
            return (
              <View
                key={lesson.id}
                style={[
                  styles.sticker,
                  {
                    borderColor: unlocked ? lesson.reward.color : '#D9DEE5',
                    backgroundColor: unlocked ? Palette.white : '#EEF1F4',
                  },
                ]}
              >
                <Text style={[styles.stickerEmoji, !unlocked && styles.locked]}>
                  {unlocked ? lesson.reward.emoji : '🔒'}
                </Text>
                <Text style={styles.stickerName}>
                  {unlocked ? lesson.reward.name : '???'}
                </Text>
                <View
                  style={[
                    styles.letterTag,
                    { backgroundColor: unlocked ? lesson.reward.color : '#C7CCD4' },
                  ]}
                >
                  <Text style={styles.letterTagText}>{lesson.letter}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Letter progress */}
        <Text style={styles.sectionTitle}>Letters I Know</Text>
        <View style={styles.letterGrid}>
          {progressService.getAllLetters().map((letter: string) => {
            const known = progressService.isLetterLearned(letter, lettersLearned);
            return (
              <View
                key={letter}
                style={[styles.letterBox, known && styles.letterBoxKnown]}
              >
                <Text
                  style={[styles.letterBoxText, known && styles.letterBoxTextKnown]}
                >
                  {letter}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sky },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 12,
    gap: 18,
  },
  titleWrap: { flex: 1 },
  title: { fontFamily: Fonts.display, fontSize: 30, color: Palette.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 15, color: Palette.textSoft },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  streakText: { fontFamily: Fonts.display, fontSize: 16, color: Palette.text },
  body: { padding: 28, gap: 8 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  statChip: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: { fontFamily: Fonts.display, fontSize: 26, color: Palette.text },
  statLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
    color: Palette.muted,
  },
  sectionTitle: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Palette.text,
    marginTop: 18,
    marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  sticker: {
    width: 150,
    borderRadius: 24,
    borderWidth: 4,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  stickerEmoji: { fontSize: 56 },
  locked: { opacity: 0.7 },
  stickerName: {
    fontFamily: Fonts.display,
    fontSize: 15,
    color: Palette.text,
    textAlign: 'center',
  },
  letterTag: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterTagText: { fontFamily: Fonts.display, fontSize: 17, color: Palette.white },
  letterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  letterBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E6EC',
  },
  letterBoxKnown: {
    backgroundColor: Palette.green,
    borderColor: Palette.green,
  },
  letterBoxText: { fontFamily: Fonts.display, fontSize: 24, color: Palette.muted },
  letterBoxTextKnown: { color: Palette.white },
});
