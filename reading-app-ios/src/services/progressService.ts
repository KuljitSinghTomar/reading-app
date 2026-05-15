import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressState, Badge } from '../store/progressSlice';

const STORAGE_KEY = 'phonics_progress';

export const progressService = {
  // Load progress from AsyncStorage
  async loadProgress(): Promise<ProgressState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  },

  // Save progress to AsyncStorage
  async saveProgress(progress: ProgressState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  // Clear all progress
  async clearProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  },

  // Check for new badges
  checkNewBadges(progress: ProgressState): Badge[] {
    const newBadges: Badge[] = [];
    const existingBadgeIds = progress.badges.map((b) => b.id);

    // 5 letters learned
    if (
      progress.lettersLearned.length === 5 &&
      !existingBadgeIds.includes('badge_5_letters')
    ) {
      newBadges.push({
        id: 'badge_5_letters',
        type: 'letters',
        title: 'Letter Explorer',
        unlockedAt: Date.now(),
        icon: '✓',
      });
    }

    // 10 letters learned
    if (
      progress.lettersLearned.length === 10 &&
      !existingBadgeIds.includes('badge_10_letters')
    ) {
      newBadges.push({
        id: 'badge_10_letters',
        type: 'letters',
        title: 'Phonics Master',
        unlockedAt: Date.now(),
        icon: '🌟',
      });
    }

    // 15 letters learned
    if (
      progress.lettersLearned.length === 15 &&
      !existingBadgeIds.includes('badge_15_letters')
    ) {
      newBadges.push({
        id: 'badge_15_letters',
        type: 'letters',
        title: 'Halfway There',
        unlockedAt: Date.now(),
        icon: '⭐',
      });
    }

    // 26 letters learned (all alphabet)
    if (
      progress.lettersLearned.length === 26 &&
      !existingBadgeIds.includes('badge_26_letters')
    ) {
      newBadges.push({
        id: 'badge_26_letters',
        type: 'letters',
        title: 'Alphabet Champion',
        unlockedAt: Date.now(),
        icon: '👑',
      });
    }

    // 5 words mastered
    if (
      progress.wordsMastered.length === 5 &&
      !existingBadgeIds.includes('badge_5_words')
    ) {
      newBadges.push({
        id: 'badge_5_words',
        type: 'words',
        title: 'Word Builder',
        unlockedAt: Date.now(),
        icon: '📖',
      });
    }

    // 10 words mastered
    if (
      progress.wordsMastered.length === 10 &&
      !existingBadgeIds.includes('badge_10_words')
    ) {
      newBadges.push({
        id: 'badge_10_words',
        type: 'words',
        title: 'Word Wizard',
        unlockedAt: Date.now(),
        icon: '✨',
      });
    }

    // 25 words mastered
    if (
      progress.wordsMastered.length === 25 &&
      !existingBadgeIds.includes('badge_25_words')
    ) {
      newBadges.push({
        id: 'badge_25_words',
        type: 'words',
        title: 'Vocabulary Expert',
        unlockedAt: Date.now(),
        icon: '📚',
      });
    }

    // 50 words mastered
    if (
      progress.wordsMastered.length === 50 &&
      !existingBadgeIds.includes('badge_50_words')
    ) {
      newBadges.push({
        id: 'badge_50_words',
        type: 'words',
        title: 'Word Legend',
        unlockedAt: Date.now(),
        icon: '🔥',
      });
    }

    // 3 day streak
    if (
      progress.streakDays === 3 &&
      !existingBadgeIds.includes('badge_3_streak')
    ) {
      newBadges.push({
        id: 'badge_3_streak',
        type: 'streak',
        title: 'On a Roll',
        unlockedAt: Date.now(),
        icon: '🚀',
      });
    }

    // 5 day streak
    if (
      progress.streakDays === 5 &&
      !existingBadgeIds.includes('badge_5_streak')
    ) {
      newBadges.push({
        id: 'badge_5_streak',
        type: 'streak',
        title: 'Consistent Learner',
        unlockedAt: Date.now(),
        icon: '🔥',
      });
    }

    // 7 day streak
    if (
      progress.streakDays === 7 &&
      !existingBadgeIds.includes('badge_7_streak')
    ) {
      newBadges.push({
        id: 'badge_7_streak',
        type: 'streak',
        title: 'Weekly Champion',
        unlockedAt: Date.now(),
        icon: '💪',
      });
    }

    // 10 day streak
    if (
      progress.streakDays === 10 &&
      !existingBadgeIds.includes('badge_10_streak')
    ) {
      newBadges.push({
        id: 'badge_10_streak',
        type: 'streak',
        title: 'Unstoppable',
        unlockedAt: Date.now(),
        icon: '⚡',
      });
    }

    // Phase 1 complete (5+ letters learned)
    if (
      progress.lettersLearned.length >= 5 &&
      progress.currentPhase >= 1 &&
      !existingBadgeIds.includes('badge_phase_1')
    ) {
      newBadges.push({
        id: 'badge_phase_1',
        type: 'phase',
        title: 'Phase 1 Complete',
        unlockedAt: Date.now(),
        icon: '🎯',
      });
    }

    // Phase 2 complete (10+ letters learned)
    if (
      progress.lettersLearned.length >= 10 &&
      progress.currentPhase >= 2 &&
      !existingBadgeIds.includes('badge_phase_2')
    ) {
      newBadges.push({
        id: 'badge_phase_2',
        type: 'phase',
        title: 'Phase 2 Mastered',
        unlockedAt: Date.now(),
        icon: '🎪',
      });
    }

    // Phase 3 complete (15+ letters learned)
    if (
      progress.lettersLearned.length >= 15 &&
      progress.currentPhase >= 3 &&
      !existingBadgeIds.includes('badge_phase_3')
    ) {
      newBadges.push({
        id: 'badge_phase_3',
        type: 'phase',
        title: 'Phase 3 Achieved',
        unlockedAt: Date.now(),
        icon: '🌈',
      });
    }

    // Phase 4 complete (23+ letters learned)
    if (
      progress.lettersLearned.length >= 23 &&
      progress.currentPhase >= 4 &&
      !existingBadgeIds.includes('badge_phase_4')
    ) {
      newBadges.push({
        id: 'badge_phase_4',
        type: 'phase',
        title: 'Phase 4 Conquered',
        unlockedAt: Date.now(),
        icon: '🏆',
      });
    }

    // 10 sessions completed
    if (
      progress.sessionsCompleted === 10 &&
      !existingBadgeIds.includes('badge_10_sessions')
    ) {
      newBadges.push({
        id: 'badge_10_sessions',
        type: 'letters',
        title: 'Dedicated Learner',
        unlockedAt: Date.now(),
        icon: '📝',
      });
    }

    // 25 sessions completed
    if (
      progress.sessionsCompleted === 25 &&
      !existingBadgeIds.includes('badge_25_sessions')
    ) {
      newBadges.push({
        id: 'badge_25_sessions',
        type: 'letters',
        title: 'Learning Master',
        unlockedAt: Date.now(),
        icon: '🎓',
      });
    }

    // 100 minutes studied
    if (
      progress.totalMinutes >= 100 &&
      !existingBadgeIds.includes('badge_100_minutes')
    ) {
      newBadges.push({
        id: 'badge_100_minutes',
        type: 'streak',
        title: '100 Minute Club',
        unlockedAt: Date.now(),
        icon: '⏱️',
      });
    }

    return newBadges;
  },

  // Update daily streak
  updateStreak(lastDate: string | null, currentStreak: number): number {
    const today = new Date().toISOString().split('T')[0];

    if (!lastDate) return 1; // First session
    if (lastDate === today) return currentStreak; // Already counted today

    const lastDateObj = new Date(lastDate);
    const todayObj = new Date(today);
    const dayDiff = Math.floor(
      (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) return currentStreak + 1; // Increment streak
    return 1; // Reset streak
  },

  // Get statistics
  getStats(progress: ProgressState) {
    return {
      lettersLearned: progress.lettersLearned.length,
      wordsMastered: progress.wordsMastered.length,
      sessionsCompleted: progress.sessionsCompleted,
      totalMinutes: progress.totalMinutes,
      streakDays: progress.streakDays,
      badges: progress.badges.length,
      currentPhase: progress.currentPhase,
    };
  },

  // Get all 26 letters for display
  getAllLetters(): string[] {
    return [
      'S',
      'A',
      'T',
      'P',
      'M',
      'I',
      'D',
      'N',
      'G',
      'O',
      'C',
      'K',
      'E',
      'R',
      'U',
      'L',
      'H',
      'F',
      'B',
      'W',
      'V',
      'Y',
      'Z',
      'X',
      'J',
      'Q',
    ];
  },

  // Check if letter is learned
  isLetterLearned(letter: string, lettersLearned: string[]): boolean {
    return lettersLearned.includes(letter.toUpperCase());
  },
};
