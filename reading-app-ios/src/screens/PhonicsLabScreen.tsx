import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';
import { LetterBlock } from '../components/cards/LetterBlock';
import { Dog } from '../characters/Dog';
import { useCharacterAnimation } from '../characters/useCharacterAnimation';
import { playLetterSound, calculateProgress } from '../utils/phonicsLabHelpers';
import { phonicsData } from '../data/phonicsData';

export interface PhonicsLabScreenProps {
  navigation?: any;
}

const { width } = Dimensions.get('window');
const GRID_COLUMNS = 3;
const BLOCK_SIZE = (width - 40) / GRID_COLUMNS - 10;

export const PhonicsLabScreen: React.FC<PhonicsLabScreenProps> = ({ navigation }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [lettersLearned, setLettersLearned] = useState<Set<string>>(new Set());
  const [characterState, setCharacterState] = useState<'idle' | 'happy' | 'celebrating'>('idle');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const phases = phonicsData.phases;
  const currentPhase = phases[currentPhaseIndex];
  const letters = currentPhase?.letters || [];

  // Character animation
  const charAnimation = useCharacterAnimation(characterState);

  // Celebration trigger with timeout
  useEffect(() => {
    if (characterState !== 'idle') {
      const timer = setTimeout(() => {
        setCharacterState('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [characterState]);

  const handleLetterTap = useCallback(
    async (letter: any) => {
      const letterId = letter.id;
      setSelectedLetter(letterId);

      try {
        // Play sound
        await playLetterSound(letter.sound);

        // Update progress
        setLettersLearned((prev) => {
          const updated = new Set(prev);
          const isNewLetter = !updated.has(letterId);

          if (isNewLetter) {
            updated.add(letterId);
            // Trigger celebration for new letters
            setCharacterState('happy');
          } else {
            // Just happy for already learned letters
            setCharacterState('happy');
          }

          return updated;
        });
      } catch (error) {
        console.error('Error handling letter tap:', error);
      }

      // Clear selection
      setTimeout(() => setSelectedLetter(null), 300);
    },
    []
  );

  const progressPercentage = calculateProgress(lettersLearned.size, letters.length);

  // Determine character celebration state
  const isMostLearned = lettersLearned.size >= letters.length * 0.8;
  const displayCharacterState = isMostLearned ? 'celebrating' : characterState;

  const handlePreviousPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1);
      setLettersLearned(new Set());
      setCharacterState('idle');
    }
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      setLettersLearned(new Set());
      setCharacterState('idle');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Character Display */}
      <View style={styles.characterContainer}>
        <Animated.View style={[charAnimation.animatedStyle]}>
          <Dog state={displayCharacterState} size="large" />
        </Animated.View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Phonics Lab</Text>
        <Text style={styles.phaseTitle}>{currentPhase?.name}</Text>
        <Text style={styles.subtitle}>Tap each letter to hear its sound</Text>
      </View>

      {/* Letter Grid */}
      <View style={styles.gridContainer}>
        {letters.map((letter, index) => (
          <View key={`${letter.id}-${index}`} style={styles.gridItem}>
            <LetterBlock
              letter={letter.id}
              color={letter.color}
              size={BLOCK_SIZE}
              onPress={() => handleLetterTap(letter)}
              isLearned={lettersLearned.has(letter.id)}
            />
          </View>
        ))}
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Letters Learned</Text>
          <Text style={styles.progressCount}>
            {lettersLearned.size} / {letters.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressPercentage}>{progressPercentage}% Complete</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <Pressable
          style={[
            styles.navButton,
            currentPhaseIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousPhase}
          disabled={currentPhaseIndex === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPhaseIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous Phase
          </Text>
        </Pressable>

        {/* Phase Indicator */}
        <View style={styles.phaseIndicator}>
          <Text style={styles.phaseIndicatorText}>
            Phase {currentPhaseIndex + 1} of {phases.length}
          </Text>
        </View>

        <Pressable
          style={[
            styles.navButton,
            currentPhaseIndex === phases.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextPhase}
          disabled={currentPhaseIndex === phases.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPhaseIndex === phases.length - 1 &&
                styles.navButtonTextDisabled,
            ]}
          >
            Next Phase
          </Text>
        </Pressable>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.description}>{currentPhase?.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  characterContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    ...Typography.heading1,
    color: Colors.text,
    marginBottom: 8,
  },
  phaseTitle: {
    ...Typography.heading2,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 24,
    justifyContent: 'center',
  },
  gridItem: {
    margin: 5,
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  progressLabel: {
    ...Typography.label,
    color: Colors.text,
  },
  progressCount: {
    ...Typography.label,
    color: Colors.success,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressPercentage: {
    ...Typography.label,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.blue,
    borderRadius: 12,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: Colors.backgroundAlt,
  },
  navButtonText: {
    ...Typography.label,
    color: Colors.white,
  },
  navButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  phaseIndicator: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  phaseIndicatorText: {
    ...Typography.label,
    color: Colors.blue,
    fontSize: 12,
  },
  descriptionSection: {
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
  },
  description: {
    ...Typography.body,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
