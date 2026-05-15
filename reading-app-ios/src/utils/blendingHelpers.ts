import * as Speech from 'expo-speech';

/**
 * Calculate blend rate based on slider value
 * - 0-30%: Slow (0.5x speed) - distinct sounds with gaps
 * - 30-70%: Medium (1.0x speed) - natural blending
 * - 70-100%: Fast (1.5x speed) - quick, fluent pronunciation
 */
export const calculateBlendRate = (sliderValue: number): number => {
  if (sliderValue < 30) return 0.5;
  if (sliderValue < 70) return 1.0;
  return 1.5;
};

/**
 * Get speed category label for current slider value
 */
export const getSpeedCategory = (sliderValue: number): 'slow' | 'medium' | 'fast' => {
  if (sliderValue < 30) return 'slow';
  if (sliderValue < 70) return 'medium';
  return 'fast';
};

/**
 * Play blended sounds with rate determined by slider position
 * Joins sounds and plays them as a continuous blend
 */
export const playBlendedSounds = async (
  sounds: string[],
  sliderValue: number
): Promise<void> => {
  try {
    const rate = calculateBlendRate(sliderValue);
    // Convert letters to their phonetic sounds
    const soundString = sounds.join('');

    await Speech.speak(soundString, {
      language: 'en-US',
      pitch: 1.0,
      rate: rate,
      onDone: () => {
        // Sound playback complete
      },
      onError: (error) => {
        console.warn('Error during blended sound playback:', error);
      },
    });
  } catch (error) {
    console.error('Error playing blended sounds:', error);
  }
};

/**
 * Play the complete word at slower pace for clarity
 */
export const playWord = async (word: string): Promise<void> => {
  try {
    await Speech.speak(word, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
      onDone: () => {
        // Word playback complete
      },
      onError: (error) => {
        console.warn('Error during word playback:', error);
      },
    });
  } catch (error) {
    console.error('Error playing word:', error);
  }
};

/**
 * Stop current speech
 */
export const stopSpeech = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};

/**
 * Check if currently speaking
 */
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('Error checking if speaking:', error);
    return false;
  }
};

/**
 * Determine which sounds should be "active" based on blend progress
 * Returns array of indices for active sounds
 */
export const getActiveSoundIndices = (
  soundCount: number,
  sliderValue: number
): number[] => {
  const activeIndices: number[] = [];
  const progressPerSound = 100 / soundCount;

  for (let i = 0; i < soundCount; i++) {
    const soundStartProgress = i * progressPerSound;
    if (sliderValue >= soundStartProgress) {
      activeIndices.push(i);
    }
  }

  return activeIndices;
};
