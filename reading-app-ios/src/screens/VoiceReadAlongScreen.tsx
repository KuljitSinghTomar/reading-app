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
import { ReadAlongContent } from '../components/ReadAlongContent';
import { CharacterContainer } from '../characters/CharacterContainer';
import { useCharacterAnimation } from '../characters/useCharacterAnimation';
import { useReadAlong } from '../hooks/useReadAlong';
import {
  getReadAlongBooks,
  getBookByIndex,
  calculateReadingProgress,
  stopSpeech,
} from '../utils/readAlongHelpers';
import { CharacterState } from '../characters/types';

export interface VoiceReadAlongScreenProps {
  navigation?: any;
}

const { width } = Dimensions.get('window');

export const VoiceReadAlongScreen: React.FC<VoiceReadAlongScreenProps> = ({ navigation }) => {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [characterState, setCharacterState] = useState<CharacterState>('idle');

  const books = getReadAlongBooks();
  const currentBook = getBookByIndex(currentBookIndex);

  const {
    speak,
    pause,
    reset,
    isPlaying,
    currentWordIndex,
    isComplete,
    words,
  } = useReadAlong(currentBook?.content || '');

  // Character animation
  const charAnimation = useCharacterAnimation(characterState);

  // Auto-reset character state after celebration
  useEffect(() => {
    if (characterState !== 'idle' && characterState !== 'thinking') {
      const timer = setTimeout(() => {
        setCharacterState('idle');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [characterState]);

  const handlePlayPress = useCallback(async () => {
    if (isPlaying) {
      // Pause if currently playing
      await pause();
      setCharacterState('idle');
    } else if (isComplete) {
      // Reset and replay
      reset();
      setCharacterState('thinking');
      await speak();
      setCharacterState('celebrating');
    } else {
      // Start playing
      setCharacterState('thinking');
      await speak();
      setCharacterState('celebrating');
    }
  }, [isPlaying, isComplete, speak, pause, reset]);

  const handleNextBook = useCallback(async () => {
    await stopSpeech();
    reset();

    if (currentBookIndex < books.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1);
      setCharacterState('encouraging');
    } else {
      // All books completed
      setCharacterState('celebrating');
    }
  }, [currentBookIndex, books.length, reset]);

  const handlePreviousBook = useCallback(async () => {
    await stopSpeech();
    reset();

    if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - 1);
      setCharacterState('idle');
    }
  }, [currentBookIndex, reset]);

  const progressPercentage = calculateReadingProgress(currentBookIndex, books.length);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Character Display */}
      <View style={styles.characterContainer}>
        <Animated.View style={[charAnimation.animatedStyle]}>
          <CharacterContainer character="bear" state={characterState} size="large" />
        </Animated.View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Voice Read-Along</Text>
        <Text style={styles.bookTitle}>{currentBook?.title}</Text>
        {currentBook?.description && (
          <Text style={styles.description}>{currentBook.description}</Text>
        )}
      </View>

      {/* Read-Along Content */}
      {currentBook && (
        <ReadAlongContent
          text={currentBook.content}
          currentWordIndex={currentWordIndex}
          isPlaying={isPlaying}
        />
      )}

      {/* Control Buttons */}
      <View style={styles.controlsSection}>
        <Pressable
          style={[
            styles.button,
            styles.primaryButton,
            (isPlaying || !currentBook) && styles.buttonDisabled,
          ]}
          onPress={handlePlayPress}
          disabled={!currentBook}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? '⏸ Pause' : isComplete ? '🔄 Replay' : '▶ Read Along'}
          </Text>
        </Pressable>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationSection}>
        <Pressable
          style={[
            styles.button,
            styles.secondaryButton,
            currentBookIndex === 0 && styles.buttonDisabled,
          ]}
          onPress={handlePreviousBook}
          disabled={currentBookIndex === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentBookIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Previous
          </Text>
        </Pressable>

        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            Book {currentBookIndex + 1} / {books.length}
          </Text>
          <View style={styles.progressBarBackground}>
            <View
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

        <Pressable
          style={[
            styles.button,
            styles.secondaryButton,
            currentBookIndex === books.length - 1 && styles.buttonDisabled,
          ]}
          onPress={handleNextBook}
          disabled={currentBookIndex === books.length - 1 || !isComplete}
        >
          <Text
            style={[
              styles.navButtonText,
              (currentBookIndex === books.length - 1 || !isComplete) &&
                styles.navButtonTextDisabled,
            ]}
          >
            Next →
          </Text>
        </Pressable>
      </View>

      {/* Word Count and Tips */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          {currentBook ? `${currentBook.words.length} words to read` : 'Loading...'}
        </Text>
        <Text style={styles.tipText}>Listen carefully and read along with the words</Text>
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
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    ...Typography.heading1,
    color: Colors.text,
    marginBottom: 8,
  },
  bookTitle: {
    ...Typography.heading2,
    color: Colors.blue,
    marginBottom: 8,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  controlsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: Colors.blue,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.blue,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...Typography.label,
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  navButtonText: {
    ...Typography.label,
    color: Colors.blue,
    fontWeight: '700',
  },
  navButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  navigationSection: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 20,
    gap: 12,
    alignItems: 'center',
  },
  progressIndicator: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.backgroundAlt,
  },
  progressText: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 3,
  },
  progressPercentage: {
    ...Typography.label,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 11,
  },
  infoSection: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.backgroundAlt,
  },
  infoText: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: 4,
    fontSize: 13,
  },
  tipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
