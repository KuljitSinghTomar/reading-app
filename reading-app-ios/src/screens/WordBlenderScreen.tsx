import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';
import { CharacterContainer } from '../characters/CharacterContainer';
import { SoundBox } from '../components/SoundBox';
import { BlendSlider } from '../components/BlendSlider';
import {
  playBlendedSounds,
  playWord,
  getActiveSoundIndices,
  stopSpeech,
} from '../utils/blendingHelpers';
import { CURRICULUM } from '../data/curriculum';

export type CharacterState = 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';

interface WordBlenderScreenProps {
  navigation?: any;
}

export const WordBlenderScreen: React.FC<WordBlenderScreenProps> = ({ navigation }) => {
  // State management
  const [sliderValue, setSliderValue] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsBlended, setWordsBlended] = useState(0);
  const [character, setCharacter] = useState<CharacterState>('idle');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation values
  const titleScale = useSharedValue(1);
  const wordPulse = useSharedValue(1);

  // Ref to track if we already celebrated for this word
  const celebratedRef = useRef(false);

  // Get CVC words from Phase 2 (first 8 words)
  const cvcWords = CURRICULUM.phases?.[1]?.words?.slice(0, 8) || [];
  const currentWord = cvcWords[currentWordIndex];

  // Get letters with their colors
  const getLetterColor = (letterId: string): string => {
    const letter = CURRICULUM.phases?.[1]?.letters?.find(
      (l) => l.id.toUpperCase() === letterId.toUpperCase()
    );
    return letter?.color || Colors.blue;
  };

  // Handle slider change with sound playback
  const handleSliderChange = async (value: number) => {
    if (isTransitioning || !currentWord) return;

    setSliderValue(value);

    // Play blended sounds as slider moves
    if (currentWord?.letters && value > 0) {
      try {
        await playBlendedSounds(currentWord.letters, value);
      } catch (error) {
        console.warn('Error playing blended sounds:', error);
      }

      // Update character state based on slider position
      if (value > 90) {
        setCharacter('celebrating');

        // Celebrate only once per word
        if (!celebratedRef.current) {
          celebratedRef.current = true;

          // Play full word after a brief delay
          setTimeout(async () => {
            try {
              await playWord(currentWord.word);
            } catch (error) {
              console.warn('Error playing word:', error);
            }

            setWordsBlended((prev) => prev + 1);

            // Animate title
            wordPulse.value = withSpring(1.15, {
              damping: 8,
              mass: 1,
            });

            setTimeout(() => {
              wordPulse.value = withSpring(1, {
                damping: 8,
                mass: 1,
              });
            }, 200);

            // Move to next word after celebration
            setTimeout(() => {
              if (currentWordIndex < cvcWords.length - 1) {
                setIsTransitioning(true);
                setCurrentWordIndex(currentWordIndex + 1);
                setSliderValue(0);
                celebratedRef.current = false;
                setCharacter('idle');
                setIsTransitioning(false);
              } else {
                // All words completed
                setCharacter('celebrating');
              }
            }, 1500);
          }, 500);
        }
      } else if (value > 40) {
        if (character !== 'celebrating') {
          setCharacter('thinking');
        }
      } else {
        if (character !== 'celebrating') {
          setCharacter('idle');
        }
      }
    } else if (value === 0) {
      setCharacter('idle');
    }
  };

  // Reset celebration flag when word changes
  useEffect(() => {
    celebratedRef.current = false;
  }, [currentWordIndex]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech().catch((e) => console.warn('Error stopping speech:', e));
    };
  }, []);

  const wordAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wordPulse.value }],
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
    >
      {/* Character */}
      <View style={styles.characterSection}>
        <CharacterContainer character="owl" state={character} size="large" />
      </View>

      {/* Title and target word */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Word Blender</Text>
        <Text style={styles.subtitle}>Blend the sounds together</Text>
      </View>

      {/* Target word display */}
      {currentWord ? (
        <Animated.View style={[styles.wordDisplay, wordAnimatedStyle]}>
          <Text style={styles.targetWord}>{currentWord.word}</Text>
        </Animated.View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* Sound boxes */}
      {currentWord && currentWord.letters ? (
        <View style={styles.soundBoxContainer}>
          {currentWord.letters.map((letter, index) => {
            const letterUpperCase = letter.toUpperCase();
            const isActive = getActiveSoundIndices(
              currentWord.letters.length,
              sliderValue
            ).includes(index);

            return (
              <SoundBox
                key={index}
                sound={letter}
                color={getLetterColor(letterUpperCase)}
                isActive={isActive}
                size={90}
              />
            );
          })}
        </View>
      ) : null}

      {/* Blend slider */}
      <BlendSlider
        currentValue={sliderValue}
        onSlideChange={handleSliderChange}
      />

      {/* Progress and stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Words Blended</Text>
          <Text style={styles.statValue}>{wordsBlended}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Progress</Text>
          <Text style={styles.statValue}>
            {currentWordIndex + 1}/{cvcWords.length}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionSection}>
        {sliderValue === 0 ? (
          <Text style={styles.instruction}>
            Slide to blend the sounds together!
          </Text>
        ) : sliderValue < 30 ? (
          <Text style={styles.instruction}>
            Keep sliding to blend faster...
          </Text>
        ) : sliderValue < 70 ? (
          <Text style={styles.instruction}>
            Nice! You're blending well. Keep going!
          </Text>
        ) : sliderValue < 90 ? (
          <Text style={styles.instruction}>
            Almost there! Slide all the way!
          </Text>
        ) : (
          <Text style={styles.instruction}>
            Perfect! You blended the word!
          </Text>
        )}
      </View>

      {/* Completion message */}
      {currentWordIndex === cvcWords.length - 1 && sliderValue > 90 && (
        <View style={styles.completionSection}>
          <Text style={styles.completionText}>Excellent work!</Text>
          <Text style={styles.completionSubtext}>
            You've completed all words in this lesson.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  characterSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    minHeight: 180,
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.heading1,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  wordDisplay: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  targetWord: {
    ...Typography.phonicsLetter,
    color: Colors.text,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  soundBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    columnGap: 12,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    columnGap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    ...Typography.heading2,
    color: Colors.green,
    fontSize: 24,
  },
  instructionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  instruction: {
    ...Typography.body,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  completionSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  completionText: {
    ...Typography.heading2,
    color: Colors.success,
    marginBottom: 8,
  },
  completionSubtext: {
    ...Typography.body,
    color: Colors.success,
    textAlign: 'center',
  },
});
