import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  recordLetter,
  recordWord,
  startSession,
  endSession,
  addBadge,
  setPhase,
  updateStreak as updateStreakAction,
  loadProgress,
  type ProgressState,
  type Badge,
} from '../store/progressSlice';
import { progressService } from '../services/progressService';
import type { RootState } from '../store/store';

export const useProgress = () => {
  const dispatch = useDispatch();
  const progress = useSelector((state: RootState) => state.progress);

  // Initialize progress from AsyncStorage on mount
  useEffect(() => {
    const initializeProgress = async () => {
      const savedProgress = await progressService.loadProgress();
      if (savedProgress) {
        dispatch(loadProgress(savedProgress));
      }
    };
    initializeProgress();
  }, [dispatch]);

  // Save progress to AsyncStorage whenever it changes
  useEffect(() => {
    progressService.saveProgress(progress);
  }, [progress]);

  const recordLetterLearned = useCallback(
    (letter: string) => {
      dispatch(recordLetter(letter));
    },
    [dispatch]
  );

  const recordWordMastered = useCallback(
    (word: string) => {
      dispatch(recordWord(word));
    },
    [dispatch]
  );

  const startNewSession = useCallback(() => {
    dispatch(startSession());
  }, [dispatch]);

  const endCurrentSession = useCallback(() => {
    dispatch(endSession());
  }, [dispatch]);

  const checkAndAwardBadges = useCallback((): Badge[] => {
    const newBadges = progressService.checkNewBadges(progress);
    newBadges.forEach((badge) => {
      dispatch(addBadge(badge));
    });
    return newBadges;
  }, [dispatch, progress]);

  const updatePhase = useCallback(
    (phase: number) => {
      dispatch(setPhase(phase));
    },
    [dispatch]
  );

  const updateDailyStreak = useCallback(() => {
    const newStreak = progressService.updateStreak(
      progress.lastSessionDate,
      progress.streakDays
    );
    dispatch(updateStreakAction(newStreak));
  }, [dispatch, progress.lastSessionDate, progress.streakDays]);

  const stats = progressService.getStats(progress);

  return {
    progress,
    stats,
    recordLetterLearned,
    recordWordMastered,
    startNewSession,
    endCurrentSession,
    checkAndAwardBadges,
    updatePhase,
    updateDailyStreak,
  };
};
