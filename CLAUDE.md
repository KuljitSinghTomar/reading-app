# CLAUDE.md - Project Context & Collaboration Guide

**Project:** Phonics Reading App for iPad  
**Status:** Planning → Development (Weeks 1-12)  
**Last Updated:** 2026-05-15  
**Owner:** Kuljit Singh Tomar

---

## Project Vision

Build a high-quality children's phonics reading app for iPad that enables a 4-year-old to progress from alphabet-only reading to independent book reading within 3 months. The app should feel like Khan Academy Kids in polish and engagement while using research-backed synthetic phonics instruction.

**Success Definition:** Child can read simple books independently by end of Week 12.

---

## Key Principles

1. **Research-First:** All phonics instruction based on peer-reviewed studies and "Science of Reading"
2. **Child-First Design:** Every feature evaluated through 4-year-old engagement lens
3. **Parent-Friendly:** Progress transparent, easy to understand, actionable recommendations
4. **Quality Over Speed:** Polish and performance matter more than feature count
5. **Sustainable Pace:** Build in iterations; perfection comes from feedback, not prediction

---

## How to Work With Me (User)

### Communication Preferences
- **Ask questions, don't assume:** I want you to clarify unclear requirements before building
- **Break tasks into chunks:** Don't implement multi-week features without checkpoints
- **Show progress:** Weekly updates on what's done, what's next, any blockers
- **Feedback loops:** User test weekly with a trusted person, not just automated QA

### Decision Authority
- **You own:** Technical choices (framework, library, architecture)
- **I own:** Feature scope, learning goals, phonics curriculum, timeline
- **Discuss together:** Design/UI decisions (reference Khan Academy Kids, show prototypes)

### When to Pause & Ask
- Anything that will take > 4 hours: check if it's the right approach first
- Any tech stack decisions: confirm it fits the vision
- Unclear requirements: ask for clarity (examples, counter-examples)
- Scope creep: ask if it's essential for MVP

---

## Project Context & Constraints

### Business Goals
1. Enable a 4-year-old to read books independently in 3 months
2. Create a high-quality, publishable app (potential future distribution)
3. Demonstrate effectiveness of phonics-based instruction with tech engagement
4. Build a foundation for future features (adaptive learning, extended content, etc.)

### Constraints
- iPad only (no Android initially)
- Offline-first (cloud sync is optional/Phase 2)
- COPPA compliance if user data collected
- Must work reliably without internet
- 4-year-old interface (no hidden tutorials, clear feedback)

### Success Metrics
- App: 60 FPS, < 2s load time, zero crashes in 20+ hours
- Learning: Child reads 10+ CVC words by Week 8, simple sentences by Week 12
- Engagement: 4+ days/week, 15-20 min per session
- Parent satisfaction: > 90%

---

## Phonics Curriculum Strategy

### Research Foundation
- **Synthetic Phonics:** Teach letter sounds → blend → words (proven most effective for early learners)
- **Systematic:** One sound at a time, clear progression
- **Comprehensive:** Phonemic awareness + phonics + fluency + vocabulary + comprehension
- **Flexible Context:** Don't teach sounds in isolation; connect to meaningful words/stories

### Curriculum Phases (Over 12 Weeks)

| Phase | Weeks | Letters | Focus | Success Marker |
|-------|-------|---------|-------|-----------------|
| 1 | 1-2 | S, A, T, P, M | Letter sounds, recognition | 5 sounds mastered |
| 2 | 3-4 | I, D, N, G, O | Blending CVC words | 10+ CVC words blended |
| 3 | 5-6 | C, K, E, R, U, L, H, F, B | Short vowel mastery | All CVC combinations |
| 4 | 7-8 | sh, ch, th, wh, ck, ll, ss, ff | Digraphs & blends | 20+ blend words |
| 5 | 9-12 | Sight words + sentences | Reading fluency | Simple book reading |

### Important Notes
- Order doesn't matter much (S, A, T, P, M or A, B, C works)
- Repetition and application are key (same letter in multiple contexts)
- Connect sounds to meaningful activities (not drill-only)
- Progress at child's pace, not calendar's pace

---

## Feature Priority & Architecture

### MVP (Weeks 1-10): Non-Negotiable
1. **Phonics Lab:** Tap to hear letter sounds
2. **Swipe Reader:** Swipe to blend letter sounds
3. **Word Blender:** Slider-based word blending
4. **Voice Read-Along:** Narrated reading with highlighting
5. **Progress Tracking:** Visual badges, streaks, parent view
6. **Character Guides:** 4 animal characters with encouragement

### Nice-to-Have (Weeks 11-12 if time): Deprioritize if needed
- Character cosmetic skins
- Advanced animations
- Extended content library

### Post-MVP (Phase 2): Out of scope for now
- Cloud sync
- Adaptive learning
- Extended phonics phases
- Multi-language support
- Social features

---

## Tech Stack Decisions (Locked)

### Framework: React Native + Expo
**Why:** Smooth iPad performance, great animation support, fast iteration, built-in TTS

**Core Libraries:**
- `react-navigation` - Screen navigation
- `expo-av` - Audio playback & recording (TTS)
- `react-native-reanimated` - Smooth animations
- `redux` or `context-api` - State management
- `@react-native-async-storage` - Local storage
- `react-native-svg` - Scalable graphics

### Design System
- Colors: Bright primaries + pastels (see REQUIREMENTS.md)
- Typography: Rounded, friendly sans-serif (Montserrat or Quicksand)
- Components: Custom built (not using UI kits to maintain design control)

### Audio Strategy
- **TTS:** Native iOS APIs (AVFoundation) via Expo
- **Fallback:** Pre-recorded voice actor (if TTS too robotic)
- **Voice:** Female, calm, soothing tone
- **Sound Effects:** Simple beeps/chimes (not distracting)

---

## Code Quality Standards

### Style & Organization
- **Naming:** Clear, descriptive names (child-focused: `playLetterSound()`, not `audioEvent()`)
- **Comments:** Only for WHY (not WHAT); write code that reads itself
- **Structure:** Co-locate feature code; avoid deep nesting
- **DRY:** Reuse components aggressively; 3-line duplication → abstraction

### Performance
- **Target:** 60 FPS always, < 2s load time
- **Profile:** Use React Native Profiler weekly
- **Optimize:** Images, animations, re-renders before expanding features
- **Test:** On actual iPad, not simulator

### Testing Strategy
- **Unit:** Core logic (sound blending, progress calculation)
- **E2E:** Weekly manual playthroughs (all features in order)
- **User Testing:** Weekly tests with trusted person (not dev-only)
- **QA Checklist:** Detailed checklist before declaring feature "done"

---

## Design Reference & Inspiration

### Apps to Study
- **Khan Academy Kids:** Polish level, character interactions, progression design
- **Duolingo:** Streak system, celebration mechanics, engagement loops
- **HOMER Reading:** Voice read-along implementation
- **ABCmouse:** Comprehensive phonics curriculum structure

### Design Principles
1. **Delightful but not distracting:** Animations should reward, not confuse
2. **Clear feedback:** Every tap/swipe should have immediate visual + audio response
3. **Big touch targets:** 44x44pt minimum (easy for 4-year-old fingers)
4. **Color-coded learning:** Each letter/sound has consistent color
5. **Character personality:** Each animal has distinct visual style & voice tone

---

## File Organization

```
reading-app/
├── REQUIREMENTS.md          # Full feature spec (THIS)
├── FEATURE_BREAKDOWN.md    # Individual tasks by phase
├── PROJECT_PLAN.md         # Week-by-week timeline
├── CLAUDE.md              # This file
├── SETUP.md               # Initial project setup
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── PhonicsLabScreen.tsx
│   │   ├── SwipeReaderScreen.tsx
│   │   ├── WordBlenderScreen.tsx
│   │   ├── VoiceReadAlongScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   └── ParentDashboardScreen.tsx
│   ├── components/
│   │   ├── LetterBlock.tsx
│   │   ├── WordCard.tsx
│   │   ├── CharacterContainer.tsx
│   │   ├── ParticleEffect.tsx
│   │   └── ...
│   ├── characters/
│   │   ├── Dog.tsx  (Buddy)
│   │   ├── Fox.tsx  (Ruby)
│   │   ├── Owl.tsx  (Sage)
│   │   ├── Bear.tsx (Oscar)
│   │   └── useCharacterAnimation.ts
│   ├── data/
│   │   ├── phonics.json
│   │   ├── words.json
│   │   ├── books.json
│   │   └── curriculum.ts
│   ├── services/
│   │   ├── audioService.ts   (TTS, sounds)
│   │   ├── progressService.ts
│   │   ├── storageService.ts
│   │   └── analyticsService.ts
│   ├── styles/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── animations.ts
│   ├── utils/
│   │   ├── soundBlending.ts
│   │   ├── progressCalculation.ts
│   │   └── helpers.ts
│   ├── hooks/
│   │   ├── usePhonicsProgress.ts
│   │   ├── useAudio.ts
│   │   └── useAnimation.ts
│   ├── store/             (Redux or Context)
│   │   ├── progressSlice.ts
│   │   ├── contentSlice.ts
│   │   └── store.ts
│   └── App.tsx
├── assets/
│   ├── characters/        (SVG or Lottie files)
│   ├── sounds/           (Optional pre-recorded audio)
│   ├── images/
│   └── animations/
├── docs/
│   ├── USER_GUIDE.md
│   ├── PARENT_GUIDE.md
│   ├── PHONICS_CURRICULUM.md
│   ├── ARCHITECTURE.md
│   └── API_REFERENCE.md
├── tests/
│   ├── __tests__/
│   └── fixtures/
├── .claude/               (Claude-specific config)
│   └── settings.json
├── app.json               (Expo config)
├── tsconfig.json
├── package.json
└── README.md
```

---

## Weekly Workflow Template

### Each Friday
1. [ ] Review progress against plan (mark tasks done)
2. [ ] Identify blockers or scope changes
3. [ ] User test with trusted person (15-20 min)
4. [ ] Document learnings/bugs for next week
5. [ ] Update this file if assumptions change

### Each Monday (Sprint Start)
1. [ ] Review plan for coming week
2. [ ] Confirm task priorities
3. [ ] Set up tracking (TODO list, GitHub issues)
4. [ ] Begin first task

---

## Red Flags & Course Corrections

### If Any of These Happen, Pause & Discuss
- A feature is taking 2x longer than estimated
- Animation performance drops below 50 FPS
- Phonics curriculum doesn't match research
- Parent/user feedback suggests wrong direction
- Scope creep (features not in FEATURE_BREAKDOWN.md)

### If Child Isn't Engaged (Week 10+)
- Pause on cosmetics, focus on core learning
- Re-evaluate character design/interactions
- Simplify UI if overwhelming
- Increase celebration/reward frequency

### If We're Behind Schedule
- Prioritize: core features > parent dashboard > cosmetics
- Options: reduce feature scope, extend timeline, or both
- Document what's deferred to Phase 2

---

## How to Use GitHub Issues & PRs

### Issue Template
```
**Feature:** [Feature name from FEATURE_BREAKDOWN.md]
**Task:** [Specific task, e.g., "D2: Create tap gesture detection"]
**Acceptance Criteria:**
- [ ] [Measurable done criterion]
- [ ] [Tested and working]
- [ ] [Documented]

**Blockers:** [None, or list them]
```

### PR Template
```
**Feature:** [Feature]
**What Changed:** [Brief summary]
**Testing:** [How tested, any manual steps]
**Screenshots:** [UI changes or interesting behavior]
**Known Issues:** [If any]
```

---

## Communication Touchpoints

### Synchronous (As-Needed)
- Questions during development: Ask immediately
- Blockers: Flag when discovered, don't wait
- Design reviews: Ad-hoc when feature complete

### Asynchronous
- Weekly progress update (Friday)
- GitHub issues for tracking
- This file for context (update as we learn)

---

## Success Looks Like (Week 12)

✅ App launches smoothly on real iPad  
✅ Child engages for 15-20 min sessions, 4+ days/week  
✅ Child can identify all 26 letter sounds  
✅ Child reads CVC words with parent guidance  
✅ Child reads simple sentences with app narration  
✅ Parent finds progress clear and encouraging  
✅ Zero crashes in extended play sessions  
✅ All animations smooth at 60 FPS  
✅ Code well-organized and documented  
✅ Ready for publication or extended learning study  

---

## Questions to Ask Before Starting Each Feature

1. **Why?** What learning goal does this feature serve?
2. **How?** What's the interaction model? (tap, swipe, drag?)
3. **When?** When does child see this? (phase/week?)
4. **Success?** How do we know it's working?
5. **Fallback?** What if it doesn't work? (performance, engagement?)

---

## Document Control

**Created:** 2026-05-15  
**Version:** 1.0  
**Last Review:** 2026-05-15  
**Next Review:** Weekly (Friday)

**Changelog:**
- 1.0 (2026-05-15): Initial project planning document
