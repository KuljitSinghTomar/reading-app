# Architecture & Component Contracts

This document defines component interfaces and shared patterns to prevent conflicts during parallel development.

---

## Directory Structure (LOCKED)

```
src/
├── screens/
│   ├── HomeScreen.tsx
│   ├── PhonicsLabScreen.tsx
│   ├── SwipeReaderScreen.tsx
│   ├── WordBlenderScreen.tsx
│   ├── VoiceReadAlongScreen.tsx
│   ├── ProgressScreen.tsx
│   └── ParentDashboardScreen.tsx
├── components/
│   ├── buttons/
│   │   ├── PrimaryButton.tsx
│   │   ├── IconButton.tsx
│   │   └── index.ts
│   ├── cards/
│   │   ├── ActivityCard.tsx
│   │   ├── LetterBlock.tsx
│   │   ├── WordCard.tsx
│   │   └── index.ts
│   ├── common/
│   │   ├── ParticleEffect.tsx
│   │   ├── AnimatedContainer.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   └── index.ts
├── characters/
│   ├── types.ts (CharacterType, CharacterState)
│   ├── Dog.tsx (Buddy)
│   ├── Fox.tsx (Ruby)
│   ├── Owl.tsx (Sage)
│   ├── Bear.tsx (Oscar)
│   ├── CharacterContainer.tsx
│   └── useCharacterAnimation.ts
├── data/
│   ├── phonics.json
│   ├── curriculum.ts (exported constants)
│   └── books.json
├── services/
│   ├── audioService.ts (playSound, playTTS, getVoiceQuality)
│   ├── progressService.ts (saveProgress, getProgress, updateMetric)
│   ├── storageService.ts (localStorage wrapper)
│   └── analyticsService.ts (logEvent, trackTime)
├── styles/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── animations.ts
├── utils/
│   ├── soundBlending.ts (calculateBlendPhase, playBlendedSound)
│   ├── wordHelpers.ts
│   └── helpers.ts
├── hooks/
│   ├── usePhonicsProgress.ts
│   ├── useAudio.ts
│   ├── useAnimation.ts
│   └── useProgress.ts
├── store/
│   ├── slices/
│   │   ├── progressSlice.ts
│   │   ├── contentSlice.ts
│   │   └── characterSlice.ts
│   ├── hooks.ts
│   └── index.ts
└── App.tsx
```

---

## Core Type Definitions

### Progress & Character State

```typescript
// src/store/types.ts
export interface ProgressState {
  lettersLearned: string[]; // ["S", "A", "T", ...]
  wordsMastered: string[];
  sessionsCompleted: number;
  currentPhase: number;
  streakDays: number;
  totalMinutes: number;
  lastSessionDate: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  type: "letters" | "words" | "streak" | "phase";
  title: string;
  unlockedAt: number;
}

export type CharacterState = "idle" | "happy" | "thinking" | "celebrating" | "encouraging";

export interface Character {
  id: "dog" | "fox" | "owl" | "bear";
  name: string;
  state: CharacterState;
  isVisible: boolean;
}
```

### Feature Data

```typescript
// src/data/types.ts
export interface Phoneme {
  id: string;
  letter: string;
  sound: string;
  color: string;
  examples: string[];
}

export interface Word {
  word: string;
  letters: string[];
  phase: number;
  type: "cvc" | "digraph" | "blend" | "sight";
}

export interface PhonicsPhase {
  id: number;
  name: string;
  weeks: string;
  phonemes: Phoneme[];
  words: Word[];
}
```

---

## Component Contracts

### Characters (All characters implement this)

```typescript
// characters/types.ts
export interface ICharacter {
  render(state: CharacterState): JSX.Element;
  animate(animation: "enter" | "celebrate" | "encourage" | "exit"): void;
  speak(text: string, voice?: "female" | "male"): Promise<void>;
}

// All character components must export:
export const Dog: React.FC<{
  state: CharacterState;
  size?: "small" | "medium" | "large";
  onAnimationComplete?: () => void;
}>;
```

### Audio Service Contract

```typescript
// services/audioService.ts
export interface IAudioService {
  // Play a single letter sound
  playLetterSound(letter: string, speed?: "slow" | "normal" | "fast"): Promise<void>;
  
  // Play TTS with callback
  playTTS(text: string, rate?: number): Promise<void>;
  
  // Blend sounds together
  playBlendedSounds(sounds: string[], blendPhase: number): Promise<void>;
  
  // Play sound effect
  playEffect(effectName: string): Promise<void>;
  
  // Check voice quality
  getVoiceQuality(): "excellent" | "good" | "fair";
}
```

### Progress Service Contract

```typescript
// services/progressService.ts
export interface IProgressService {
  // Get current progress
  getProgress(): Promise<ProgressState>;
  
  // Update progress
  recordLetterLearned(letter: string): Promise<void>;
  recordWordMastered(word: string): Promise<void>;
  updateSessionTime(minutes: number): Promise<void>;
  
  // Streaks
  checkStreak(): Promise<{ current: number; broken: boolean }>;
  
  // Badges
  checkNewBadges(): Promise<Badge[]>;
}
```

---

## Screen Structure (All screens follow this pattern)

```typescript
// Example: PhonicsLabScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useAppDispatch } from "../store/hooks";
import { CharacterContainer } from "../characters/CharacterContainer";
import { useAudio } from "../hooks/useAudio";
import { usePhonicsProgress } from "../hooks/usePhonicsProgress";

export const PhonicsLabScreen: React.FC<{
  navigation: any;
}> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { playLetterSound } = useAudio();
  const { currentPhase, recordLetterLearned } = usePhonicsProgress();
  const [character, setCharacter] = useState<Character>("fox");

  // Get current phoneme set for this phase
  const phonemes = CURRICULUM.phases[currentPhase]?.phonemes || [];

  const handleLetterTap = async (letter: string) => {
    // Play sound
    await playLetterSound(letter);
    
    // Update progress
    recordLetterLearned(letter);
    
    // Update character state
    setCharacterState("happy");
    
    // Check for badges
    const newBadges = await progressService.checkNewBadges();
    if (newBadges.length > 0) {
      showCelebration();
    }
  };

  return (
    <View style={styles.container}>
      <CharacterContainer character={character} state="idle" />
      
      {/* Feature-specific UI */}
      <LetterGrid phonemes={phonemes} onTap={handleLetterTap} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
});
```

---

## State Management Pattern (Redux)

```typescript
// store/slices/progressSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const progressSlice = createSlice({
  name: "progress",
  initialState: {
    lettersLearned: [],
    wordsMastered: [],
    streakDays: 0,
    // ... other fields
  },
  reducers: {
    recordLetter: (state, action) => {
      if (!state.lettersLearned.includes(action.payload)) {
        state.lettersLearned.push(action.payload);
      }
    },
    recordWord: (state, action) => {
      if (!state.wordsMastered.includes(action.payload)) {
        state.wordsMastered.push(action.payload);
      }
    },
    // ... other reducers
  },
});

// Hooks for use in components
export const useProgress = () => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state) => state.progress);
  
  return {
    progress,
    recordLetter: (letter: string) =>
      dispatch(recordLetter(letter)),
    recordWord: (word: string) =>
      dispatch(recordWord(word)),
  };
};
```

---

## Shared Constants (DO NOT DUPLICATE)

All imported from these files:

```typescript
// styles/colors.ts
export const Colors = { /* ... */ };

// styles/typography.ts
export const Typography = { /* ... */ };

// styles/spacing.ts
export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

// styles/animations.ts
export const ANIMATION_DURATIONS = { fast: 200, normal: 400, slow: 600 };

// data/curriculum.ts
export const CURRICULUM: { phases: PhonicsPhase[] } = { /* ... */ };
```

---

## Key Rules for Parallel Development

### File Ownership (NO CONFLICTS)

**Agent Feature-1 (Lab + Read-Along):**
- `src/screens/PhonicsLabScreen.tsx`
- `src/screens/VoiceReadAlongScreen.tsx`
- `src/components/cards/LetterBlock.tsx`
- `src/utils/wordHelpers.ts`

**Agent Feature-2 (Swipe Reader):**
- `src/screens/SwipeReaderScreen.tsx`
- `src/components/SwipeGestureDetector.tsx` (custom)
- `src/utils/swipeHelpers.ts` (custom)

**Agent Feature-3 (Word Blender):**
- `src/screens/WordBlenderScreen.tsx`
- `src/components/SliderControl.tsx` (custom)
- `src/utils/soundBlending.ts` (uses audioService)

**Agent Integration (Progress + Home):**
- `src/screens/HomeScreen.tsx`
- `src/screens/ProgressScreen.tsx`
- `src/store/slices/progressSlice.ts`
- `src/services/progressService.ts`

**Agent Parent Dashboard:**
- `src/screens/ParentDashboardScreen.tsx`
- `src/components/charts/` (custom)

**Agent Setup/Orchestrator:**
- `src/App.tsx` (navigation root)
- `src/store/index.ts` (Redux store)
- `src/services/` (all shared services)
- `src/styles/` (design system)
- `src/data/` (curriculum data)

### Shared Files (All can read, only specific agents write)

**ONLY `agent-setup` modifies:**
- `src/styles/colors.ts` ← Final design system
- `src/styles/typography.ts` ← Final design system
- `src/data/phonics.json` ← Curriculum (with agent-data input)
- `src/services/audioService.ts` ← Audio interface

**ONLY `agent-parallel-2` modifies:**
- `src/characters/` folder (complete)
- `src/characters/types.ts`

**ONLY `agent-integration-1` modifies:**
- `src/store/slices/progressSlice.ts`
- `src/services/progressService.ts`

**CONFLICT HANDLING:**
If two agents need to modify the same file, post issue to STATUS.md, I'll resolve.

---

## Redux Store Structure

```typescript
// store/index.ts
const store = configureStore({
  reducer: {
    progress: progressSlice.reducer,
    content: contentSlice.reducer,    // curriculum, current phase
    character: characterSlice.reducer, // current character, state
    ui: uiSlice.reducer,              // screen state, modals, etc.
  },
});
```

---

## Hook Patterns (Safe for Parallel Use)

```typescript
// hooks/useProgress.ts — Use in any feature screen
const { progress, recordLetter, recordWord } = useProgress();

// hooks/useAudio.ts — Use in any feature screen
const { playLetterSound, playTTS, playEffect } = useAudio();

// hooks/useAnimation.ts — Use for any animation
const { triggerAnimation, celebrate, encourage } = useAnimation();

// hooks/useCharacter.ts — Use to interact with character
const { character, setState, speak } = useCharacter();
```

---

## Asset Organization

```
assets/
├── characters/
│   ├── dog/
│   │   ├── idle.json (Lottie or animated SVG)
│   │   ├── happy.json
│   │   ├── celebrating.json
│   │   └── encouraging.json
│   ├── fox/
│   ├── owl/
│   └── bear/
├── sounds/
│   ├── letters/
│   │   └── [s.mp3, a.mp3, t.mp3, ...] (optional, for TTS fallback)
│   └── effects/
│       └── [success.mp3, tap.mp3, ...]
└── images/
    ├── icons/
    └── backgrounds/
```

---

## Navigation Hierarchy

```
Root Navigator (Bottom Tabs)
├── HomeScreen
│   ├── → PhonicsLabScreen
│   ├── → SwipeReaderScreen
│   ├── → WordBlenderScreen
│   ├── → VoiceReadAlongScreen
│   └── → ProgressScreen
└── ParentDashboardScreen (Gesture-locked)
```

---

## Data Flow Example (for reference)

```
User taps letter block in PhonicsLabScreen
  ↓
Call audioService.playLetterSound("S")
  ↓
Update Redux: progressSlice.recordLetter("S")
  ↓
Dispatch character to "happy" state
  ↓
Check progressService.checkNewBadges()
  ↓
If new badge, trigger celebration animation
  ↓
Save progress to AsyncStorage via progressService
```

---

## Testing During Build (Manual QA Only)

1. **Per Feature:** After screen is complete, tap through the flow manually
2. **Integration:** After all features, navigate between screens
3. **Progress:** Verify badges unlock and progress persists across app restart
4. **Crashes:** Note any red errors but keep building (fix in polish phase)

---

## Commits During Build

```bash
# After each phase completion:
git add .
git commit -m "Complete Phase [X]: [Description]

Features completed:
- [Task 1]
- [Task 2]

Co-Authored-By: Claude Agents <agents@reading-app.local>"
```

---

## Handoff Checklist (For Agent Transitions)

Before moving to next phase:
- [ ] All previous phase tasks marked COMPLETE in STATUS.md
- [ ] Code compiles without errors
- [ ] No console errors or warnings (ok to have task-relevant logs)
- [ ] Feature works end-to-end (tap/swipe/slider → sound plays → progress updates)
- [ ] No new dependencies added without agent-setup approval
- [ ] Updated relevant type files if new data structures
- [ ] Git commit made with clear message

---

## If Questions Arise During Build

Post to STATUS.md under **Blockers/Issues** section with:
- Agent name
- What you're trying to do
- What's blocked
- Proposed solution

I'll resolve synchronously.
