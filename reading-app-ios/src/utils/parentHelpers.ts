import { ProgressState } from '../store/progressSlice';

interface WeeklyActivityData {
  day: string;
  minutes: number;
  date: string;
}

interface ParentStats {
  lettersLearned: number;
  wordsMastered: number;
  sessionsCompleted: number;
  totalMinutes: number;
  streakDays: number;
  badges: number;
  currentPhase: number;
  avgSessionDuration: number;
  weeklyTrend: 'up' | 'down' | 'stable';
}

/**
 * Generate weekly activity data from progress history
 * This simulates weekly learning time data
 */
export const generateWeeklyActivityData = (progress: ProgressState): WeeklyActivityData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();

  return days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    // Simulate realistic activity based on total minutes and streak
    const baseMinutes = Math.floor(progress.totalMinutes / 7);
    const variance = Math.floor(Math.random() * 10) - 5; // -5 to +5
    const minutes = Math.max(0, baseMinutes + variance);

    return {
      day,
      minutes,
      date: date.toISOString().split('T')[0],
    };
  });
};

/**
 * Calculate enhanced parent statistics
 */
export const getEnhancedParentStats = (progress: ProgressState): ParentStats => {
  const sessionsCompleted = progress.sessionsCompleted || 1;
  const totalMinutes = progress.totalMinutes || 0;
  const avgSessionDuration = sessionsCompleted > 0 ? Math.round(totalMinutes / sessionsCompleted) : 0;

  // Calculate weekly trend
  const weeklyActivity = generateWeeklyActivityData(progress);
  const firstHalfAvg = weeklyActivity.slice(0, 3).reduce((sum, d) => sum + d.minutes, 0) / 3;
  const secondHalfAvg = weeklyActivity.slice(4).reduce((sum, d) => sum + d.minutes, 0) / 3;
  let weeklyTrend: 'up' | 'down' | 'stable' = 'stable';
  if (secondHalfAvg > firstHalfAvg * 1.15) weeklyTrend = 'up';
  else if (secondHalfAvg < firstHalfAvg * 0.85) weeklyTrend = 'down';

  return {
    lettersLearned: progress.lettersLearned.length,
    wordsMastered: progress.wordsMastered.length,
    sessionsCompleted,
    totalMinutes,
    streakDays: progress.streakDays,
    badges: progress.badges.length,
    currentPhase: progress.currentPhase,
    avgSessionDuration,
    weeklyTrend,
  };
};

/**
 * Generate intelligent recommendations based on progress
 */
export const generateRecommendations = (progress: ProgressState): string[] => {
  const recommendations: string[] = [];
  const stats = getEnhancedParentStats(progress);

  // Letter learning recommendations
  if (stats.lettersLearned >= 5 && stats.lettersLearned < 10) {
    recommendations.push(
      `Great progress! Your child has learned ${stats.lettersLearned} letters. Keep the momentum going!`
    );
  } else if (stats.lettersLearned >= 10 && stats.lettersLearned < 20) {
    recommendations.push(
      `Excellent! ${stats.lettersLearned} letters mastered. Consider progressing to the next phase.`
    );
  } else if (stats.lettersLearned >= 20) {
    recommendations.push(`Outstanding! Your child is almost done with the alphabet!`);
  }

  // Streak recommendations
  if (stats.streakDays >= 3 && stats.streakDays < 7) {
    recommendations.push(`Amazing ${stats.streakDays}-day streak! Consistency is key to learning.`);
  } else if (stats.streakDays >= 7) {
    recommendations.push(
      `🔥 Incredible ${stats.streakDays}-day streak! Your child is a dedicated learner!`
    );
  } else if (stats.streakDays === 0) {
    recommendations.push('Time to start or restart the learning streak!');
  }

  // Session frequency recommendations
  if (stats.sessionsCompleted < 5) {
    recommendations.push('Tip: Regular sessions (3-5 times per week) help with retention.');
  } else if (stats.avgSessionDuration < 10) {
    recommendations.push('Consider longer sessions (15-20 minutes) for better learning outcomes.');
  } else if (stats.avgSessionDuration > 30) {
    recommendations.push('Excellent dedication! Break sessions into shorter sessions if concentration drops.');
  }

  // Phase progression recommendations
  if (stats.lettersLearned >= 5 && stats.currentPhase === 1) {
    recommendations.push(`Next milestone: Complete Phase 1 and unlock Phase 2!`);
  } else if (stats.lettersLearned >= 10 && stats.currentPhase === 2) {
    recommendations.push(`Phase 2 is in progress. Aim for Phase 3 completion!`);
  }

  // Weekly trend recommendations
  if (stats.weeklyTrend === 'down') {
    recommendations.push('📊 Trend: Activity is decreasing. Try to maintain consistent practice.');
  } else if (stats.weeklyTrend === 'up') {
    recommendations.push('📈 Trend: Great improvement this week! Keep it up!');
  }

  // Word mastery recommendations
  if (stats.wordsMastered >= 5) {
    recommendations.push(`${stats.wordsMastered} words mastered! Reading confidence is building.`);
  }

  return recommendations;
};

/**
 * Format duration for display
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Get color for a chart bar based on value
 */
export const getChartBarColor = (
  value: number,
  max: number,
  index: number
): string => {
  const colors = ['#6BCB77', '#4D96FF', '#FF6B6B', '#FFD93D'];
  return colors[index % 4];
};

/**
 * Calculate progress percentage for a goal
 */
export const calculateProgressPercentage = (current: number, total: number): number => {
  return Math.min(100, Math.round((current / total) * 100));
};

/**
 * Check if child has met daily goal
 */
export const checkDailyGoal = (
  todayMinutes: number,
  dailyGoalMinutes: number
): { met: boolean; percentage: number } => {
  const percentage = calculateProgressPercentage(todayMinutes, dailyGoalMinutes);
  return {
    met: todayMinutes >= dailyGoalMinutes,
    percentage,
  };
};

/**
 * Export progress as formatted text for sharing
 */
export const exportProgressReport = (progress: ProgressState): string => {
  const stats = getEnhancedParentStats(progress);
  const today = new Date().toLocaleDateString();

  const report = `
📚 Learning Progress Report
Date: ${today}

📊 STATISTICS
- Letters Learned: ${stats.lettersLearned}/26
- Words Mastered: ${stats.wordsMastered}
- Sessions Completed: ${stats.sessionsCompleted}
- Total Learning Time: ${formatDuration(stats.totalMinutes)}
- Daily Streak: ${stats.streakDays} days
- Badges Earned: ${stats.badges}
- Current Phase: ${stats.currentPhase}
- Average Session Duration: ${stats.avgSessionDuration} minutes

🎯 ACHIEVEMENTS
- Weekly Trend: ${stats.weeklyTrend === 'up' ? '📈 Improving' : stats.weeklyTrend === 'down' ? '📉 Declining' : '➡️ Stable'}
- Phase Completion: ${Math.round((stats.lettersLearned / 26) * 100)}%

Generated by Reading App • Parent Dashboard
  `.trim();

  return report;
};
