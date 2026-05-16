import * as Speech from 'expo-speech';

/**
 * Play letter sound using expo-speech TTS
 */
export const playLetterSound = async (sound: string): Promise<void> => {
  try {
    await Speech.stop();
    await Speech.speak(sound, {
      language: 'en-US',
      pitch: 1.1,
      rate: 0.6,
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/**
 * Get color for a letter based on its character code
 */
export const getLetterColor = (letter: string, defaultColor?: string): string => {
  if (defaultColor) return defaultColor;

  const colors = [
    '#FF6B6B', // Red
    '#FFD93D', // Yellow
    '#6BCB77', // Green
    '#4D96FF', // Blue
    '#BB86FC', // Purple
    '#FF9D5C', // Orange
    '#FF6BB9', // Pink
    '#1ABC9C', // Teal
    '#3498DB', // Light Blue
    '#E74C3C', // Dark Red
  ];

  return colors[letter.charCodeAt(0) % colors.length];
};

/**
 * Format phase name for display
 */
export const formatPhaseName = (phase: number, name: string): string => {
  return name || `Phase ${phase}`;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (learned: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((learned / total) * 100);
};
