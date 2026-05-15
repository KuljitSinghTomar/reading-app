import * as Speech from 'expo-speech';

/**
 * Calculate which letters have been "swiped" based on translation distance
 * @param translateX Current swipe distance in pixels
 * @param totalLetters Number of letters in the word
 * @param swipeWidth Total width available for swiping
 * @returns Array of indices of letters that have been swiped
 */
export const calculateSwipedLetters = (
  translateX: number,
  totalLetters: number,
  swipeWidth: number = 300
): number[] => {
  if (translateX <= 0 || totalLetters === 0) return [];

  const letterWidth = swipeWidth / totalLetters;
  const swipedCount = Math.min(
    Math.floor(translateX / letterWidth) + 1,
    totalLetters
  );

  return Array.from({ length: swipedCount }, (_, i) => i);
};

/**
 * Get the progress percentage of the swipe
 * @param translateX Current swipe distance
 * @param swipeWidth Total width needed for complete swipe
 * @returns Progress as decimal (0-1)
 */
export const getSwipeProgress = (
  translateX: number,
  swipeWidth: number = 300
): number => {
  return Math.min(translateX / swipeWidth, 1);
};

/**
 * Check if swipe is complete based on progress threshold
 * @param progress Swipe progress (0-1)
 * @param threshold Minimum progress required (default 0.8)
 * @returns true if swipe is complete
 */
export const isSwipeComplete = (progress: number, threshold: number = 0.8): boolean => {
  return progress >= threshold;
};

/**
 * Pronounce a single letter or word
 * @param text Text to speak
 * @param rate Speech rate (0.5-1.5)
 */
export const pronounceText = async (
  text: string,
  rate: number = 0.8
): Promise<void> => {
  try {
    // Stop any ongoing speech
    await Speech.stop();

    // Speak the text
    await Speech.speak(text, {
      language: 'en',
      rate,
      pitch: 1.0,
    });
  } catch (error) {
    console.error('Error pronouncing text:', error);
  }
};

/**
 * Pronounce each letter with delay between them
 * @param letters Array of letters to pronounce
 * @param delayBetween Delay in milliseconds between letters
 */
export const pronounceLetters = async (
  letters: string[],
  delayBetween: number = 200
): Promise<void> => {
  try {
    for (let i = 0; i < letters.length; i++) {
      await pronounceText(letters[i], 0.9);
      if (i < letters.length - 1) {
        // Add delay between letters
        await new Promise((resolve) => setTimeout(resolve, delayBetween));
      }
    }
  } catch (error) {
    console.error('Error pronouncing letters:', error);
  }
};

/**
 * Get color for a letter based on its hit state
 * @param isHit Whether the letter has been swiped
 * @returns Color hex code
 */
export const getLetterColor = (isHit: boolean): string => {
  return isHit ? '#FFD93D' : '#E0E0E0';
};

/**
 * Calculate letter positions for hit detection
 * @param index Letter index
 * @param totalLetters Total number of letters
 * @param containerWidth Width of the swipe container
 * @returns Pixel position where letter becomes active
 */
export const calculateLetterPosition = (
  index: number,
  totalLetters: number,
  containerWidth: number = 300
): number => {
  return (index / totalLetters) * containerWidth;
};
