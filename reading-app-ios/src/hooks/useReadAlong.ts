import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';

export interface UseReadAlongReturn {
  isPlaying: boolean;
  currentWordIndex: number;
  isComplete: boolean;
  words: string[];
  speak: () => Promise<void>;
  reset: () => void;
  pause: () => Promise<void>;
}

export const useReadAlong = (text: string): UseReadAlongReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const words = text.split(/\s+/).filter((word) => word.length > 0);

  const speak = useCallback(async () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);
    setIsComplete(false);

    try {
      for (let i = 0; i < words.length; i++) {
        if (!isPlaying) {
          break; // Exit if pause was called
        }

        const word = words[i];

        // Speak the word
        await Speech.speak(word, {
          language: 'en-US',
          rate: 0.9,
          pitch: 1.0,
        });

        // Update current word index
        setCurrentWordIndex(i + 1);

        // Delay between words for visual effect
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setIsComplete(true);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error speaking:', error);
      setIsPlaying(false);
    }
  }, [words, isPlaying]);

  const pause = useCallback(async () => {
    setIsPlaying(false);
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
    setIsComplete(false);
    Speech.stop().catch((error) => console.error('Error stopping speech:', error));
  }, []);

  return {
    speak,
    pause,
    reset,
    isPlaying,
    currentWordIndex,
    isComplete,
    words,
  };
};
