import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Badge {
  id: string;
  type: 'letters' | 'words' | 'streak' | 'phase';
  title: string;
  unlockedAt: number;
  icon: string;
}

export interface ProgressState {
  lettersLearned: string[];
  wordsMastered: string[];
  sessionsCompleted: number;
  totalMinutes: number;
  streakDays: number;
  lastSessionDate: string | null;
  badges: Badge[];
  currentPhase: number;
  sessionStartTime: number | null;
}

const initialState: ProgressState = {
  lettersLearned: [],
  wordsMastered: [],
  sessionsCompleted: 0,
  totalMinutes: 0,
  streakDays: 0,
  lastSessionDate: null,
  badges: [],
  currentPhase: 0,
  sessionStartTime: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    recordLetter: (state, action: PayloadAction<string>) => {
      const letter = action.payload.toUpperCase();
      if (!state.lettersLearned.includes(letter)) {
        state.lettersLearned.push(letter);
      }
    },

    recordWord: (state, action: PayloadAction<string>) => {
      const word = action.payload.toLowerCase();
      if (!state.wordsMastered.includes(word)) {
        state.wordsMastered.push(word);
      }
    },

    startSession: (state) => {
      state.sessionStartTime = Date.now();
    },

    endSession: (state) => {
      if (state.sessionStartTime) {
        const minutes = Math.floor((Date.now() - state.sessionStartTime) / 60000);
        state.totalMinutes += minutes;
        state.sessionsCompleted += 1;
        state.sessionStartTime = null;
      }
    },

    addBadge: (state, action: PayloadAction<Badge>) => {
      if (!state.badges.find((b) => b.id === action.payload.id)) {
        state.badges.push(action.payload);
      }
    },

    setPhase: (state, action: PayloadAction<number>) => {
      state.currentPhase = action.payload;
    },

    updateStreak: (state, action: PayloadAction<number>) => {
      state.streakDays = action.payload;
      state.lastSessionDate = new Date().toISOString().split('T')[0];
    },

    loadProgress: (state, action: PayloadAction<ProgressState>) => {
      return action.payload;
    },

    resetProgress: () => {
      return initialState;
    },
  },
});

export const {
  recordLetter,
  recordWord,
  startSession,
  endSession,
  addBadge,
  setPhase,
  updateStreak,
  loadProgress,
  resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
