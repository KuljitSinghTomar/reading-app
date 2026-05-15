import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useProgress } from '../hooks/useProgress';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { StreakCounter } from '../components/StreakCounter';
import { progressService } from '../services/progressService';
import { Badge } from '../store/progressSlice';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';

const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const ProgressScreen: React.FC = () => {
  const { progress, stats, checkAndAwardBadges, updateDailyStreak } =
    useProgress();
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // Check and award badges
    const newBadgesList = checkAndAwardBadges();
    if (newBadgesList.length > 0) {
      setNewBadges(newBadgesList);
    }

    // Update daily streak
    updateDailyStreak();
  }, []);

  const allLetters = progressService.getAllLetters();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
        </View>

        {/* Streak Counter */}
        <View style={styles.section}>
          <StreakCounter days={progress.streakDays} />
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.lettersLearned}</Text>
            <Text style={styles.statLabel}>Letters</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.wordsMastered}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        {/* New Badges Section */}
        {newBadges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎉 New Badges!</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgeScroll}
            >
              {newBadges.map((badge) => (
                <BadgeDisplay key={badge.id} badge={badge} size="large" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Badges ({stats.badges})</Text>
          {progress.badges.length === 0 ? (
            <Text style={styles.emptyText}>
              Keep learning to unlock badges!
            </Text>
          ) : (
            <View style={styles.badgeGrid}>
              {progress.badges.map((badge) => (
                <BadgeDisplay key={badge.id} badge={badge} size="medium" />
              ))}
            </View>
          )}
        </View>

        {/* Letter Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Letters Learned ({stats.lettersLearned}/26)
          </Text>
          <View style={styles.letterGrid}>
            {allLetters.map((letter) => {
              const isLearned = progressService.isLetterLearned(
                letter,
                progress.lettersLearned
              );
              return (
                <View
                  key={letter}
                  style={[
                    styles.letterBox,
                    isLearned && styles.letterBoxLearned,
                  ]}
                >
                  <Text style={styles.letterText}>{letter}</Text>
                  {isLearned && <Text style={styles.checkmark}>✓</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Words Mastered Section */}
        {progress.wordsMastered.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Words Mastered ({stats.wordsMastered})
            </Text>
            <View style={styles.wordsList}>
              {progress.wordsMastered.map((word, index) => (
                <View key={index} style={styles.wordTag}>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Phase Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phase Progress</Text>
          <View style={styles.phaseContainer}>
            <View
              style={[
                styles.phaseBox,
                progress.currentPhase >= 1 && styles.phaseBoxActive,
              ]}
            >
              <Text style={styles.phaseNumber}>1</Text>
            </View>
            <View style={styles.phaseLine} />
            <View
              style={[
                styles.phaseBox,
                progress.currentPhase >= 2 && styles.phaseBoxActive,
              ]}
            >
              <Text style={styles.phaseNumber}>2</Text>
            </View>
            <View style={styles.phaseLine} />
            <View
              style={[
                styles.phaseBox,
                progress.currentPhase >= 3 && styles.phaseBoxActive,
              ]}
            >
              <Text style={styles.phaseNumber}>3</Text>
            </View>
            <View style={styles.phaseLine} />
            <View
              style={[
                styles.phaseBox,
                progress.currentPhase >= 4 && styles.phaseBoxActive,
              ]}
            >
              <Text style={styles.phaseNumber}>4</Text>
            </View>
            <View style={styles.phaseLine} />
            <View
              style={[
                styles.phaseBox,
                progress.currentPhase >= 5 && styles.phaseBoxActive,
              ]}
            >
              <Text style={styles.phaseNumber}>5</Text>
            </View>
          </View>
        </View>

        {/* Footer spacing */}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.heading1,
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading2,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statBox: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    ...Typography.heading1,
    color: Colors.blue,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  badgeScroll: {
    paddingVertical: Spacing.md,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  letterBox: {
    width: '19%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.textSecondary,
  },
  letterBoxLearned: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  letterText: {
    ...Typography.heading2,
    color: Colors.text,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 12,
    color: Colors.white,
    marginTop: 2,
  },
  wordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  wordTag: {
    backgroundColor: Colors.blue,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
  },
  wordText: {
    ...Typography.label,
    color: Colors.white,
  },
  phaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  phaseBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.textSecondary,
  },
  phaseBoxActive: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  phaseNumber: {
    ...Typography.heading2,
    color: Colors.text,
  },
  phaseLine: {
    height: 2,
    width: 16,
    backgroundColor: Colors.backgroundAlt,
  },
  footerSpacer: {
    height: Spacing.xl,
  },
});
