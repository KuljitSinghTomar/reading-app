# Project Plan - Phonics Reading App for iPad

**Project Name:** Phonics Reading App for iPad  
**Duration:** 12 weeks (6 weeks accelerated / 12 weeks sustainable pace)  
**Target Launch:** 12 weeks from start  
**Team:** You + Claude Code agents (specializing in different areas)  
**Success Criteria:** App ready for 3-month learning study with a 4-year-old

---

## Timeline Overview

```
Week 1:   Project Setup + Design System + Character Design
Week 2:   Phonics Data + Character Framework
Week 3:   Phonics Lab Feature
Week 4:   Swipe Reader Feature  
Week 5:   Word Blender Feature + Voice Read-Along Start
Week 6:   Voice Read-Along Complete + Progress System
Week 7:   Character Cosmetics + Home Screen
Week 8:   Parent Dashboard
Week 9:   Polish + QA Cycle 1
Week 10:  Polish + QA Cycle 2 + User Testing
Week 11:  Final Fixes + Documentation
Week 12:  Launch Prep + Deployment
```

---

## Week-by-Week Breakdown

### **Week 1: Foundation & Design System**

**Goal:** All infrastructure, design system, and character design specs ready

**Tasks:**
- A1: Project initialization (React Native + Expo)
- A2: Design system (colors, components, documentation)
- A3: Navigation setup
- A4: Audio/TTS integration
- C1: Character architecture
- C2: Character design specs for all 4 characters

**Deliverables:**
- [ ] Running React Native + Expo app
- [ ] Design system component library (buttons, text, cards, animations)
- [ ] Character design specs (visual guidelines)
- [ ] TTS working with female voice
- [ ] Navigation flow stubbed

**Blockers to Check:**
- Can we get natural-sounding female TTS?
- Do animations run smoothly on iPad?

---

### **Week 2: Curriculum & Characters**

**Goal:** All phonics content ready, characters fully implemented

**Tasks:**
- B1: Phonics data structure (all 5 phases)
- B2: Content validation
- C3: Character interactions and animations
- Character asset optimization

**Deliverables:**
- [ ] Complete phonics curriculum JSON (letters, words, sentences)
- [ ] All 4 characters with idle + 3 emotional states each
- [ ] Character speech bubble system
- [ ] Character entrance/exit animations tested
- [ ] Content validation report (against research standards)

**Dependencies:**
- Depends on Week 1 completion

---

### **Week 3: Phonics Lab Feature**

**Goal:** Phonics Lab fully functional and polished

**Tasks:**
- D1: UI & layout (letter blocks, grid, progress)
- D2: Tap interaction + TTS
- D3: Visual effects (glow, bounce, animations)
- D4: Progress tracking + badge rewards

**Deliverables:**
- [ ] Phonics Lab fully playable
- [ ] All letter sounds playable and clear
- [ ] Progress tracked and displayed
- [ ] Character integration working
- [ ] 5-10 min of gameplay feels polished
- [ ] iPad performance tested (60 FPS)

**Testing:**
- Test with family member (adult)
- Verify sound quality and clarity

---

### **Week 4: Swipe Reader Feature**

**Goal:** Swipe Reader fully functional and integrated

**Tasks:**
- E1: UI & word display
- E2: Swipe gesture + sound sequencing
- E3: Visual effects (trails, highlighting)
- E4: Progression system
- E5: Character integration

**Deliverables:**
- [ ] Swipe Reader playable (single letters first)
- [ ] Gesture detection working smoothly
- [ ] Sound playback aligned with swipe
- [ ] Visual effects polished
- [ ] Progression from Phase 1→2 working
- [ ] Performance optimized

**Testing:**
- Test swipe sensitivity on iPad
- Verify sound timing with gesture

---

### **Week 5: Word Blender & Voice Read-Along Start**

**Goal:** Word Blender ready, Voice Read-Along foundation set

**Tasks:**
- F1-F5: Word Blender feature (UI, slider, blending audio, effects)
- G1-G2: Voice Read-Along foundation (TTS narration, highlighting)

**Deliverables:**
- [ ] Word Blender fully playable
- [ ] Slider smooth and responsive
- [ ] Sound blending smooth across speeds
- [ ] Voice Read-Along narration working
- [ ] Word highlighting synchronized
- [ ] Both features character-integrated

**Testing:**
- Test slider smoothness and latency
- Test voice narration quality and timing

---

### **Week 6: Voice Read-Along Complete + Progress System**

**Goal:** All 4 core features complete, progress system done

**Tasks:**
- G3-G5: Voice Read-Along completion (visual effects, books)
- H1-H5: Progress tracking, badges, streaks, analytics

**Deliverables:**
- [ ] Voice Read-Along complete with mini-books
- [ ] All 4 core features fully playable
- [ ] Progress tracking accurate and persistent
- [ ] Badge system working and celebratory
- [ ] Daily streak system functional
- [ ] Parent dashboard data ready

**Testing:**
- End-to-end test of all features
- Play through multiple sessions to test persistence
- Verify progress tracking accuracy

---

### **Week 7: Character Cosmetics & Home Screen**

**Goal:** Home screen polished, character customization optional

**Tasks:**
- I1-I2: Character skins/celebrations
- J1-J3: Home screen (layout, navigation, animations)

**Deliverables:**
- [ ] Home screen visually appealing and functional
- [ ] Character greeting system working
- [ ] Activity cards clearly labeled
- [ ] Streak display prominent
- [ ] Navigation smooth between all screens
- [ ] Character cosmetics optional but functional

**Testing:**
- Test navigation flow from home
- Verify greeting character rotates properly

---

### **Week 8: Parent Dashboard**

**Goal:** Parent dashboard fully functional

**Tasks:**
- K1-K5: Parent dashboard (auth, visualization, recommendations, settings, export)

**Deliverables:**
- [ ] Parent access protected and secure
- [ ] Progress visualization clear and meaningful
- [ ] Settings adjustable (goals, voice, etc.)
- [ ] Recommendations logic working
- [ ] Export functionality tested
- [ ] Dashboard mobile-responsive (for parent phones)

**Testing:**
- Test parent flow as a parent would use it
- Verify security (PIN/gesture protection)

---

### **Week 9: Polish & QA Cycle 1**

**Goal:** All features polished, major bugs fixed

**Tasks:**
- L1: Visual polish (animations, spacing, alignment)
- L2: Performance optimization
- L3: Accessibility review
- Initial QA pass

**Deliverables:**
- [ ] All animations smooth and consistent
- [ ] App runs at 60 FPS consistently
- [ ] Touch targets properly sized
- [ ] Color contrast accessible
- [ ] Documented bugs and fixes
- [ ] Initial user feedback incorporated

**Testing:**
- Full app playthrough by you
- User feedback session with trusted person
- Performance profiling on iPad

---

### **Week 10: Polish & QA Cycle 2 + User Testing**

**Goal:** App ready for kid testing, edge cases handled

**Tasks:**
- L4: Comprehensive QA (edge cases, crashes, data integrity)
- L5: Documentation
- Prepare for child testing

**Deliverables:**
- [ ] Zero crashes in 10+ hour test session
- [ ] Data persists across sessions
- [ ] Edge cases handled (interruptions, rapid tapping, etc.)
- [ ] User guide for parents written
- [ ] Troubleshooting guide created
- [ ] Test plan for 3-month study documented

**Testing:**
- Extended play-through (10+ hours)
- Edge case testing (interruptions, force-close, etc.)
- Prepare for parent + 4-year-old testing

---

### **Week 11: Final Fixes & Documentation**

**Goal:** Last-minute fixes, full documentation ready

**Tasks:**
- Address final issues from Week 10
- Complete all documentation
- Create setup/deployment guides
- Prepare for launch

**Deliverables:**
- [ ] All known bugs fixed
- [ ] Documentation complete
- [ ] Developer setup guide ready
- [ ] Parent onboarding guide ready
- [ ] App ready for App Store submission (if desired)
- [ ] Backup/restore functionality tested

**Testing:**
- Final smoke test

---

### **Week 12: Launch Prep & Deployment**

**Goal:** App deployed and ready for real-world use

**Tasks:**
- Final deployment checks
- App Store submission (if applicable)
- Parent onboarding
- Begin 3-month learning study

**Deliverables:**
- [ ] App deployed to device or App Store
- [ ] Parent provided with setup instructions
- [ ] Learning progress tracking system ready
- [ ] Regular check-in schedule established
- [ ] Feedback channel open for improvements

---

## Sprint Structure (Recommended)

### 2-Week Sprints
1. **Sprint 1 (Weeks 1-2):** Foundation + Curriculum
2. **Sprint 2 (Weeks 3-4):** Phonics Lab + Swipe Reader
3. **Sprint 3 (Weeks 5-6):** Word Blender + Voice Read-Along + Progress
4. **Sprint 4 (Weeks 7-8):** Home Screen + Parent Dashboard
5. **Sprint 5 (Weeks 9-10):** Polish + QA + User Testing
6. **Sprint 6 (Weeks 11-12):** Final Fixes + Launch

---

## Resource Allocation

### Week-by-Week Agent Usage

| Week | Primary Focus | Recommended Agent | Parallel Tasks |
|------|---------------|------------------|-----------------|
| 1 | Setup | General-purpose | Character design |
| 2 | Curriculum + Characters | Parallel: Curriculum agent + Design agent | - |
| 3 | Phonics Lab | Feature-builder | - |
| 4 | Swipe Reader | Feature-builder | - |
| 5 | Word Blender + Voice Start | Parallel: Feature-builder x2 | - |
| 6 | Voice Complete + Progress | Parallel: Feature-builder + Backend agent | - |
| 7 | UI Polish | Frontend-specialist | - |
| 8 | Parent Dashboard | Backend-specialist | - |
| 9 | QA | QA-agent | Polish (parallel) |
| 10 | User Testing | QA-agent + Feedback | Final fixes |
| 11 | Final Fixes | General-purpose | Documentation |
| 12 | Launch | Deployment-specialist | - |

---

## Key Milestones & Gates

### Gate 1: End of Week 2 (Project Foundation Complete)
- [ ] All infrastructure in place
- [ ] Design system documented
- [ ] Phonics curriculum validated
- [ ] Characters fully designed
- **Decision:** Proceed with core feature development

### Gate 2: End of Week 6 (All Core Features Complete)
- [ ] All 4 activities fully playable
- [ ] Progress system working
- [ ] Character integration complete
- **Decision:** Ready for UI polish and parent dashboard

### Gate 3: End of Week 10 (QA & User Testing Complete)
- [ ] Zero critical bugs
- [ ] Performance validated
- [ ] User testing feedback incorporated
- **Decision:** Ready for launch

### Gate 4: End of Week 12 (Launch)
- [ ] App deployed
- [ ] Parent onboarded
- [ ] Learning study ready to begin

---

## Risk Management

### High Risks

1. **TTS Voice Quality** (Week 1)
   - Risk: Native TTS sounds robotic or unnatural
   - Mitigation: Test multiple voice options early; consider pre-recorded fallback
   - Backup: Record professional voice actor for core sounds

2. **Animation Performance** (Week 1-3)
   - Risk: Complex animations cause frame drops on older iPad models
   - Mitigation: Profile early and often; optimize before moving forward
   - Backup: Simplify animations if needed

3. **Touch Responsiveness** (Week 3-5)
   - Risk: Swipe/slider interactions feel laggy
   - Mitigation: Test gesture latency extensively; optimize event handling
   - Backup: Alternative interaction methods ready

### Medium Risks

4. **Phonics Curriculum Validation** (Week 2)
   - Risk: Curriculum doesn't match current research
   - Mitigation: Validate against multiple research sources
   - Backup: Work with phonics specialist for review

5. **Parent Dashboard UX** (Week 8)
   - Risk: Parents find dashboard confusing
   - Mitigation: User test with actual parents early
   - Backup: Simplify to essential metrics

### Low Risks

6. **Data Persistence** (Ongoing)
   - Risk: Progress data lost between sessions
   - Mitigation: Test extensively; automated backup system
   - Backup: Cloud sync backup (optional)

---

## Success Metrics

### App Metrics (MVP Success)
- [ ] App launches in < 2 seconds
- [ ] All features run at 60 FPS consistently
- [ ] Zero crashes in 20+ hour test session
- [ ] All sounds clear and natural-sounding
- [ ] All animations smooth and delightful
- [ ] Touch responsiveness < 100ms latency

### Learning Metrics (3-Month Goal)
- [ ] Child learns all 26 letter sounds by Week 4
- [ ] Child reads 10+ CVC words by Week 8
- [ ] Child reads simple 3-5 word sentences by Week 12
- [ ] Engagement: 4+ days/week at 15-20 min/session
- [ ] Parent reports child enjoys using app

### Quality Metrics
- [ ] Parent satisfaction > 90%
- [ ] Feature completion rate > 95%
- [ ] Documentation complete and clear
- [ ] Code well-organized and commented

---

## Communication & Feedback Loop

### Checkpoints
- **Weekly:** Review progress against timeline
- **End of each gate:** Validation before proceeding
- **Mid-sprint:** Course corrections if needed

### Feedback Channels
1. **Code Review:** Each feature reviewed before merging
2. **User Testing:** Weekly playtests with trusted person
3. **Parent Feedback:** Weekly check-ins on app experience
4. **Child Observation:** Note engagement, pain points, moments of joy

---

## File Structure (Post-Setup)

```
reading-app/
├── src/
│   ├── screens/          # Main screens (Home, Lab, Reader, etc.)
│   ├── components/       # Reusable UI components
│   ├── characters/       # Character components & animations
│   ├── features/         # Feature-specific logic
│   ├── data/             # Phonics curriculum, words, books
│   ├── services/         # Audio, storage, analytics
│   ├── styles/           # Design system, colors, typography
│   └── utils/            # Helper functions
├── assets/               # Images, sounds, animations
├── docs/                 # User guides, API docs
└── tests/                # Unit & integration tests
```

---

## How to Use This Plan

1. **Print or bookmark** this document for weekly review
2. **Update task status** weekly (mark complete as you go)
3. **Flag blockers** immediately (don't wait for weekly check-in)
4. **Adjust timeline** if needed (phases can flex, gates stay firm)
5. **Track learnings** for post-launch improvements

---

## Next Steps

1. **This Week:** Confirm this plan with you
2. **Review:** Read through FEATURE_BREAKDOWN.md for detailed task lists
3. **Setup:** Run commands in SETUP.md to initialize project
4. **Start:** Begin Week 1 tasks (Project Setup)
5. **Track:** Use TODO list to mark progress daily
