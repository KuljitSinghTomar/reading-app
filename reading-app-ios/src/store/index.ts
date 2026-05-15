export { store, type RootState, type AppDispatch } from './store';
export {
  recordLetter,
  recordWord,
  startSession,
  endSession,
  addBadge,
  setPhase,
  updateStreak,
  loadProgress,
  resetProgress,
  type ProgressState,
  type Badge,
} from './progressSlice';
