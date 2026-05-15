# Phonics Reading App for iPad - Requirements Document

**Project:** Children's Phonics Reading App  
**Target Platform:** iPad (iOS)  
**Target Age:** 3-5 years old (Preschool, Early Kindergarten)  
**Primary Goal:** Enable independent book reading within 3 months  
**Quality Target:** Khan Academy Kids level

---

## 1. Project Overview

A research-backed phonics learning app that teaches 4-year-olds to read through synthetic phonics instruction combined with engaging gamification, captivating character guides, and parent tracking.

### Research Foundation
- **Synthetic Phonics**: Teach individual letter sounds, then blend them into words (most effective for early learners)
- **Comprehensive Literacy**: Combine phonics with phonemic awareness, fluency, vocabulary, and comprehension
- **Systematic Progression**: One sound at a time, building to CVC words, then simple sentences
- **Flexible Learning**: Balance structured phonics with meaningful context and interactive play
- Sources: [Phonics Instruction - Reading Rockets](https://www.readingrockets.org/topics/phonics-and-decoding/articles/phonics-instruction), [Keys to Literacy](https://keystoliteracy.com/blog/systematic-phonics-scope-and-sequence/)

---

## 2. Target Learner Profile

**Age:** 3-5 years (Preschool to Early Kindergarten)  
**Reading Level:** Just learning alphabet letters (emerging readers)  
**Attention Span:** 10-15 minute sessions  
**Engagement:** Highly visual, tactile, animated, reward-driven  
**Language:** English (single language, female voice preferred)

---

## 3. Technical Specifications

### Platform & Framework
- **Platform:** iPad (iOS 14+)
- **Framework:** React Native + Expo
  - Rationale: Smooth animations, touch optimization, fast iteration, great voice/TTS support
- **Offline Capability:** All core features work offline; sync to cloud when connected
- **Storage:** Local device storage for progress, synced to backend when available

### Performance Requirements
- Load times: < 2 seconds
- 60 FPS animations
- Smooth touch response (< 100ms latency)
- Text-to-speech: Natural, calming female voice (default)

---

## 4. Core Pedagogy & Phonics Scope

### Phonics Progression (Research-Based)
1. **Phase 1: Letter Recognition & Initial Sounds (Week 1-2)**
   - Introduce 5 letters: S, A, T, P, M
   - Focus: Letter shape recognition + letter sound isolation
   - Activities: Phonics Lab (tap to hear), Swipe Reader

2. **Phase 2: Blending CVC Words (Week 3-4)**
   - Introduce 5 more letters: I, D, N, G, O
   - Focus: Blending 3 sounds into words
   - Activities: Word Blender (slider-based sound blending)
   - Words: sat, mat, pat, sit, pit, dog, got, etc.

3. **Phase 3: Short Vowel Mastery (Week 5-6)**
   - Introduce remaining basic consonants: C, K, E, R, U, L, H, F, B
   - Focus: All short vowel CVC combinations
   - Activities: Voice Read-Along, Swipe Reader with words

4. **Phase 4: Digraphs & Blends (Week 7-8)**
   - Introduce: sh, ch, th, wh, ck, ll, ss, ff
   - Focus: Beginning and ending blends
   - Activities: Word Blender advanced mode

5. **Phase 5: Sight Words & Simple Sentences (Week 9-12)**
   - High-frequency words: the, is, a, to, and, in, etc.
   - Focus: Reading simple sentences and mini-books
   - Activities: All features integrated

### Success Metrics
- Child can identify all single letter sounds by week 2
- Child can blend CVC words by week 4
- Child can read 15-20 simple words independently by week 8
- Child can read simple 3-5 word sentences by week 12

---

## 5. Core Features

### 5.1 Character Guides (Mascots)
Four friendly animal guides that introduce activities and provide encouragement:
- **Dog (Buddy)** - Energetic, enthusiastic, greets on home screen
- **Fox (Ruby)** - Clever, narrates Phonics Lab activities
- **Owl (Sage)** - Wise, guides Word Blender and advanced features
- **Bear (Oscar)** - Gentle, encourages and celebrates successes

**Behavior:**
- Characters appear contextually (not overwhelming)
- Blink, nod, wave in response to user actions
- Provide verbal encouragement and gentle prompts
- Celebrate wins with enthusiasm

### 5.2 Phonics Lab
**Core mechanic:** Tap letter blocks to hear their sounds in isolation

**Interactions:**
- Large, colorful letter blocks (one per screen or 4-6 on grid)
- Tap to hear letter sound pronounced naturally (calming female voice)
- Visual feedback: Block lights up, slight bounce animation
- Long-press (optional): Hear multiple pronunciations or see letter name

**Visual Design:**
- Blocks are 120x120px+
- Bright primary colors (each letter has unique color)
- Touch-friendly spacing
- Clear, large sans-serif letter font

**Content:**
- Presented in progression order (S, A, T, P, M, then I, D, N, etc.)
- Can return to any previously learned letters
- Progress indicator shows current phase

### 5.3 Swipe Reader
**Core mechanic:** Swipe left-to-right over letters/words to hear sounds sequentially with visual highlighting

**Interactions:**
- Word appears on screen (starts with single letters, progresses to words)
- Swipe from left to right across the word
- Each letter lights up/highlights as its sound plays
- Word is pronounced completely at end of swipe
- Visual effects: Trail animation, light pulse on each letter

**Content Progression:**
- Week 1-2: Single letters (S, A, T, P, M)
- Week 3-4: CVC words (sat, mat, pat, sit)
- Week 5+: Longer words, then sentences

**Visual Design:**
- Large, spaced-out letters (easy swipe targets)
- Rainbow gradient trail on swipe
- Particle effects on successful completion

### 5.4 Word Blender
**Core mechanic:** Slider-based sound blending where child controls speed of blending sounds into words

**Interactions:**
- Display 3 sounds (e.g., "C" + "A" + "T") with visual separation
- Slider below (0-100%) controls blend speed
- Slow mode (0-30%): Hear each sound distinctly
- Medium mode (30-70%): Natural blending
- Fast mode (70-100%): Quick, fluent word pronunciation
- Child experiments to find the "sweet spot" where they hear the complete word

**Visual Design:**
- Sounds appear in large boxes with distinct colors
- Slider is large and easy to manipulate
- Arrows show direction of blending
- Visual connection lines link the sound boxes
- Fluid animation as slider moves

**Content:**
- CVC words from Phase 1-2
- Progresses to digraphs and blends (Week 7+)
- Includes word pronunciation at top (shows target word)

### 5.5 Voice Read-Along
**Core mechanic:** Child reads aloud while hearing the app narrate; tracks progress and provides gentle encouragement

**Interactions:**
- Book or sentence appears on screen
- Tap "Read Along" button
- App narrates the text at natural pace (1-1.5x speed)
- Child reads along (optional - no voice detection required initially)
- Visual cues: Each word highlights as it's spoken
- After completion: Celebration animation with character praise

**Visual Design:**
- Large, readable text (24-32pt font)
- Clear visual highlighting of current word (background color change)
- Character reacts with nods/enthusiasm
- Particle effects on completion

**Content:**
- Starts with single words (Phase 1-2)
- Progresses to CVC sentences (Phase 3)
- Mini-books with repeated patterns (Phase 4+)

### 5.6 Progress & Reward System
**Tracking:**
- Daily streaks (consecutive days of learning)
- Letter sounds learned (visual checklist)
- Words mastered (badge system)
- Minutes spent learning
- Book completions

**Rewards:**
- Visual badges/trophies for milestones (5 letters learned, 10 words, etc.)
- Particle effects and character celebrations
- Unlock new characters skins/animations (cosmetic only, no progression blocking)
- Star ratings on completed activities (1-3 stars based on performance)

**Engagement Mechanics:**
- Daily challenges: "Learn 3 new sounds today"
- Streak notifications: "Great job! 5 days in a row!"
- Celebratory animations on every milestone
- No penalties or failure states (always encouraging)

### 5.7 Parent Dashboard
**Features:**
- View child's progress: letters learned, words mastered, time spent
- See daily/weekly activity breakdown
- View recommended next activities
- Track toward 3-month reading goal
- Export progress report
- Set daily learning time goals
- Adjust difficulty/pacing
- Mute voice/sound if needed

**Access:**
- Separate parent section (PIN protected to prevent child access)
- Accessible from home screen with gesture (e.g., 4-finger tap)
- Cloud sync of progress data (optional - local storage default)

---

## 6. Visual Design System

### Color Palette
- **Primary Colors:** Bright red, yellow, blue, green (for letter blocks, buttons)
- **Accent Colors:** Orange, purple, pink (for highlights, celebrations)
- **Background:** Soft, warm white or very light blue (#F8F9FA or #E8F4F8)
- **Text:** Dark navy (#1A1A1A) for readability
- **Success Color:** Green (#2ECC71)

### Typography
- **Font:** Rounded, friendly sans-serif (e.g., Montserrat, Quicksand)
- **Body Text:** 18-24pt (larger for 4-year-olds)
- **Letters/Phonics:** 32-48pt (very large, easy recognition)
- **UI Buttons:** 20-24pt

### Animation Principles
- Smooth, gentle transitions (200-400ms)
- No jarring movements
- Anticipation before action (slight delay before animation)
- Exaggerated but not overwhelming (bounces, floats, rotations)
- Particle effects: Confetti, stars, bubbles on success

### Character Design
- Friendly, round shapes (non-threatening)
- Simple, bold features (easy recognition)
- Expressive eyes and mouth
- 2-3 idle animations (breathing, blinking, subtle movement)
- Success animations (jumping, clapping, spinning)

---

## 7. User Experience Flow

### Home Screen
1. Character greeting (rotates: Dog, Fox, Owl, Bear)
2. Four activity cards: "Phonics Lab," "Swipe Reader," "Word Blender," "Voice Read-Along"
3. Progress streak indicator
4. Parent dashboard access (gesture-protected)

### Typical Session
1. Child taps activity card
2. Relevant character appears with brief intro
3. Activity loads (phonics content based on progression)
4. Child interacts (tap, swipe, or manipulate slider)
5. Feedback provided immediately (sound, animation, visual effect)
6. Character celebrates on completion
7. Option to continue or return home

### Difficulty Adaptation
- No explicit difficulty levels (automatically adjusts based on performance)
- Progression tracked by phase (not customizable by parent initially)
- Parent can override if needed (advanced settings)

---

## 8. Technical Requirements

### Backend (Optional, Cloud Sync)
- User account system (linked to parent email)
- Progress data storage (encrypted)
- Analytics (learning patterns, engagement)
- Version management for content updates

### Frontend (React Native + Expo)
- State management: Redux or Context API
- Audio: expo-av (text-to-speech via native APIs)
- Animations: React Native Animated API or Reanimated 2
- Storage: AsyncStorage (local), Firebase/Supabase (cloud sync)
- Voice: Google Cloud Text-to-Speech or Apple's native TTS

### Content Management
- Phonics data: JSON structure (letter, sound, example words)
- Audio files: Pre-recorded for letters and words (or TTS generated)
- Character animations: Lottie files or custom React Native animated components
- Books/sentences: Markdown or JSON for easy editing

---

## 9. Success Criteria (3-Month Goal)

### Child Learning Outcomes
- [ ] Identify and name all 26 letter sounds
- [ ] Blend simple CVC words (cat, sit, dog, etc.)
- [ ] Read 30+ sight words independently
- [ ] Read simple 3-5 word sentences
- [ ] Read a mini-book (4-6 pages) with minimal help
- [ ] Demonstrate phonemic awareness (rhyming, blending, segmenting)

### App Engagement Metrics
- [ ] 80%+ completion of Phase 1-2 activities
- [ ] 60%+ completion of Phase 3-5 activities
- [ ] 4+ days per week usage
- [ ] 15-20 minute average session length
- [ ] Positive parent feedback on child motivation

### App Quality Metrics
- [ ] 0 crashes in 50+ hours of use
- [ ] Voice quality rated "natural" by parents
- [ ] Animation performance stable (60 FPS)
- [ ] Load times < 2 seconds
- [ ] 95%+ parent satisfaction

---

## 10. Design References
- Khan Academy Kids (overall quality, character interaction, engagement)
- Duolingo (streak system, celebration mechanics)
- ABCmouse (comprehensive phonics curriculum)
- HOMER Reading Companion (voice read-along, animation quality)

---

## 11. Constraints & Assumptions

**Constraints:**
- iPad only (no Android initially)
- Offline-first (cloud sync optional)
- 4-year-old user safety (no external links, no data collection without consent)
- COPPA compliance (if cloud sync enabled)

**Assumptions:**
- Child has basic iPad familiarity (swiping, tapping)
- Parent involvement for setup and periodic progress checks
- Device has good speakers or child uses earbuds
- Consistent, regular use (goal: 15-20 min/day, 4+ days/week)
