import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Dog } from '../characters/Dog';
import { SwipeTarget } from '../components/SwipeTarget';
import { pronounceText, pronounceLetters } from '../utils/swipeHelpers';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';
import phonticsData from '../data/phonics.json';

// Extended phonics data with more words for Phase 1
const EXTENDED_WORDS = [
  { word: 'sat', letters: ['s', 'a', 't'] },
  { word: 'sit', letters: ['s', 'i', 't'] },
  { word: 'sit', letters: ['s', 'i', 't'] },
  { word: 'tap', letters: ['t', 'a', 'p'] },
  { word: 'pat', letters: ['p', 'a', 't'] },
  { word: 'mat', letters: ['m', 'a', 't'] },
  { word: 'map', letters: ['m', 'a', 'p'] },
  { word: 'mop', letters: ['m', 'o', 'p'] },
  { word: 'top', letters: ['t', 'o', 'p'] },
  { word: 'apt', letters: ['a', 'p', 't'] },
];

type CharacterState = 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';

interface WordData {
  word: string;
  letters: string[];
}

export const SwipeReaderScreen: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [swipesCompleted, setSwipesCompleted] = useState(0);
  const [character, setCharacter] = useState<CharacterState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const scaleValue = useSharedValue(1);

  const wordsToRead: WordData[] = EXTENDED_WORDS;
  const currentWord = wordsToRead[currentWordIndex];
  const isPhaseComplete = currentWordIndex >= wordsToRead.length - 1;

  // Character scale animation
  const scaleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  // Handle letter being swiped
  const handleLetterHit = useCallback(
    async (index: number) => {
      if (!currentWord || isProcessing) return;

      try {
        const letter = currentWord.letters[index];
        if (letter) {
          // Pronounce the letter with elevated pitch for feedback
          await pronounceText(letter.toUpperCase(), 1.0);
        }
      } catch (error) {
        console.error('Error on letter hit:', error);
      }
    },
    [currentWord, isProcessing]
  );

  // Handle swipe completion
  const handleSwipeComplete = useCallback(
    async (word: string) => {
      if (!currentWord || isProcessing) return;

      setIsProcessing(true);

      try {
        // Play happy animation on character
        setCharacter('happy');

        // Pronounce the complete word with slower rate
        await pronounceText(word, 0.7);

        // Update stats
        const newCompleted = swipesCompleted + 1;
        setSwipesCompleted(newCompleted);

        // Trigger celebration animation
        scaleValue.value = withSequence(
          withTiming(1.15, { duration: 200, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 200, easing: Easing.in(Easing.cubic) })
        );

        // Wait for celebration
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Move to next word
        if (currentWordIndex < wordsToRead.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setCharacter('encouraging');

          // Reset character after encouragement
          await new Promise((resolve) => setTimeout(resolve, 1200));
          setCharacter('idle');
        } else {
          // Phase complete - celebrate!
          setCharacter('celebrating');
        }
      } catch (error) {
        console.error('Error on swipe complete:', error);
        setCharacter('idle');
      } finally {
        setIsProcessing(false);
      }
    },
    [currentWord, isProcessing, currentWordIndex, swipesCompleted, wordsToRead.length, scaleValue]
  );

  // Handle phase completion
  const handleRestartPhase = useCallback(() => {
    setCurrentWordIndex(0);
    setSwipesCompleted(0);
    setCharacter('idle');
  }, []);

  // Set initial thinking state on mount
  useEffect(() => {
    setCharacter('thinking');
    const timer = setTimeout(() => {
      setCharacter('idle');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: Colors.text }]}>
            Swipe Reader
          </Text>
          <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
            Phase 1: Letter Recognition
          </Text>
        </View>

        {/* Character Section */}
        <View style={styles.characterSection}>
          <Animated.View style={[styles.characterContainer, scaleAnimatedStyle]}>
            <Dog state={character} size="large" />
          </Animated.View>
          <Text style={[styles.characterState, { color: Colors.textSecondary }]}>
            {character === 'idle' && 'Ready to learn!'}
            {character === 'thinking' && 'Let me prepare...'}
            {character === 'happy' && 'Great job!'}
            {character === 'encouraging' && 'You can do it!'}
            {character === 'celebrating' && 'Amazing work!'}
          </Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={[styles.progressLabel, { color: Colors.textSecondary }]}>
                Words
              </Text>
              <Text style={[styles.progressValue, { color: Colors.blue }]}>
                {currentWordIndex + 1} / {wordsToRead.length}
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={[styles.progressLabel, { color: Colors.textSecondary }]}>
                Completed
              </Text>
              <Text style={[styles.progressValue, { color: Colors.green }]}>
                {swipesCompleted}
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={[styles.progressLabel, { color: Colors.textSecondary }]}>
                Accuracy
              </Text>
              <Text style={[styles.progressValue, { color: Colors.orange }]}>
                {swipesCompleted > 0
                  ? Math.round((swipesCompleted / (currentWordIndex + 1)) * 100)
                  : 0}
                %
              </Text>
            </View>
          </View>
        </View>

        {/* Swipe Target Section */}
        {!isPhaseComplete ? (
          <View style={styles.swipeSection}>
            {currentWord && (
              <SwipeTarget
                text={currentWord.word}
                letters={currentWord.letters}
                onSwipeComplete={handleSwipeComplete}
                onLetterHit={handleLetterHit}
                enabled={!isProcessing}
              />
            )}
          </View>
        ) : (
          <View style={styles.completionSection}>
            <Text style={[styles.completionTitle, { color: Colors.text }]}>
              Phase 1 Complete!
            </Text>
            <Text style={[styles.completionMessage, { color: Colors.textSecondary }]}>
              You've successfully learned to read {swipesCompleted} words!
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>
                  Total Words Read
                </Text>
                <Text style={[styles.statNumber, { color: Colors.blue }]}>
                  {swipesCompleted}
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>
                  Attempts
                </Text>
                <Text style={[styles.statNumber, { color: Colors.orange }]}>
                  {currentWordIndex + 1}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={[styles.footerText, { color: Colors.textSecondary }]}>
            {isPhaseComplete
              ? 'Great job completing Phase 1!'
              : 'Swipe left to right across the word to learn'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    ...Typography.heading1,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.label,
  },
  characterSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  characterContainer: {
    marginBottom: 12,
  },
  characterState: {
    ...Typography.body,
    fontStyle: 'italic',
  },
  progressSection: {
    marginVertical: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressLabel: {
    ...Typography.label,
    marginBottom: 4,
  },
  progressValue: {
    ...Typography.heading2,
    marginBottom: 0,
  },
  swipeSection: {
    marginVertical: 16,
  },
  completionSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginVertical: 16,
  },
  completionTitle: {
    ...Typography.heading1,
    marginBottom: 12,
  },
  completionMessage: {
    ...Typography.bodyLarge,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statLabel: {
    ...Typography.label,
    marginBottom: 8,
  },
  statNumber: {
    ...Typography.heading2,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    ...Typography.body,
    textAlign: 'center',
  },
});
