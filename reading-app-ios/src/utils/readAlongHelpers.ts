import * as Speech from 'expo-speech';

export interface ReadAlongBook {
  id: string;
  title: string;
  phase: number;
  content: string;
  words: string[];
  description?: string;
}

/**
 * Get all read-along books with CVC words from Phases 1-3
 */
export const getReadAlongBooks = (): ReadAlongBook[] => [
  {
    id: 'book1',
    title: 'Sat the Cat',
    phase: 2,
    description: 'A simple story about a cat',
    content: 'The cat sat on a mat.',
    words: ['The', 'cat', 'sat', 'on', 'a', 'mat'],
  },
  {
    id: 'book2',
    title: 'The Dog',
    phase: 2,
    description: 'A story about a dog',
    content: 'The dog sat. The cat sat.',
    words: ['The', 'dog', 'sat', 'The', 'cat', 'sat'],
  },
  {
    id: 'book3',
    title: 'Sit and Tap',
    phase: 2,
    description: 'A fun activity',
    content: 'Sit and tap. Tap and sit.',
    words: ['Sit', 'and', 'tap', 'Tap', 'and', 'sit'],
  },
  {
    id: 'book4',
    title: 'The Bat',
    phase: 2,
    description: 'A story about a bat',
    content: 'The bat is big. The bat can sit.',
    words: ['The', 'bat', 'is', 'big', 'The', 'bat', 'can', 'sit'],
  },
  {
    id: 'book5',
    title: 'Tap Tap Tap',
    phase: 2,
    description: 'Repetitive learning',
    content: 'Tap the mat. Tap tap tap.',
    words: ['Tap', 'the', 'mat', 'Tap', 'tap', 'tap'],
  },
  {
    id: 'book6',
    title: 'It is a Pig',
    phase: 2,
    description: 'Introduction to animals',
    content: 'It is a pig. The pig is big.',
    words: ['It', 'is', 'a', 'pig', 'The', 'pig', 'is', 'big'],
  },
  {
    id: 'book7',
    title: 'Can You Sit?',
    phase: 3,
    description: 'Interactive story',
    content: 'Can you sit? I can sit. You can sit.',
    words: ['Can', 'you', 'sit', 'I', 'can', 'sit', 'You', 'can', 'sit'],
  },
  {
    id: 'book8',
    title: 'The Pin and the Pot',
    phase: 3,
    description: 'A tale of two objects',
    content: 'The pin is in the pot. The pot is big.',
    words: ['The', 'pin', 'is', 'in', 'the', 'pot', 'The', 'pot', 'is', 'big'],
  },
];

/**
 * Get a specific book by index
 */
export const getBookByIndex = (index: number): ReadAlongBook | undefined => {
  const books = getReadAlongBooks();
  return books[index];
};

/**
 * Get books for a specific phase
 */
export const getBooksByPhase = (phase: number): ReadAlongBook[] => {
  return getReadAlongBooks().filter((book) => book.phase <= phase);
};

/**
 * Speak a word using expo-speech
 */
export const speakWord = async (word: string, rate: number = 0.9): Promise<void> => {
  try {
    await Speech.speak(word, {
      language: 'en-US',
      rate,
      pitch: 1.0,
    });
  } catch (error) {
    console.error('Error speaking word:', error);
  }
};

/**
 * Stop all speech
 */
export const stopSpeech = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};

/**
 * Calculate reading progress
 */
export const calculateReadingProgress = (
  currentBookIndex: number,
  totalBooks: number
): number => {
  if (totalBooks === 0) return 0;
  return Math.round(((currentBookIndex + 1) / totalBooks) * 100);
};
