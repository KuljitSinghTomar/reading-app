const phonicsData = require('./phonics.json');
const RAW_CURRICULUM = phonicsData;

// Type definitions
export interface Letter {
  id: string;
  name: string;
  sound: string;
  color: string;
  examples: string[];
  audioUrl: string;
  difficulty: number;
}

export interface Word {
  word: string;
  letters: string[];
  phase: number;
  type: string;
}

export interface SightWord {
  word: string;
  phase: number;
  frequency: number;
}

export interface BookPage {
  text: string;
  words: string[];
}

export interface Book {
  id: string;
  title: string;
  phase: number;
  level: number;
  pages: BookPage[];
}

export interface Phase {
  id: number;
  name: string;
  weeks: string;
  description: string;
  letters: Letter[];
  words: Word[];
}

export interface CurriculumData {
  phases: Phase[];
  sightWords: SightWord[];
  books: Book[];
}

// Main curriculum data
export const CURRICULUM: CurriculumData = RAW_CURRICULUM;

// Export phases array
export const PHASES = CURRICULUM.phases;

// Export phase names
export const PHASE_NAMES = [
  'Phase 1: Letter Recognition',
  'Phase 2: CVC Blending',
  'Phase 3: Short Vowel Mastery',
  'Phase 4: Digraphs & Blends',
  'Phase 5: Sight Words & Simple Sentences',
];

// Export phase descriptions
export const PHASE_DESCRIPTIONS = [
  'Introduction to letter sounds and letter shape recognition',
  'Introduction to blending three sounds into words',
  'Master all short vowels and common consonants',
  'Introduction to consonant digraphs and blends',
  'Reading sight words and simple sentences',
];

// Map letters by phase
export const LETTERS_BY_PHASE: { [key: number]: Letter[] } = {};
PHASES.forEach((phase) => {
  LETTERS_BY_PHASE[phase.id] = phase.letters;
});

// Map words by phase
export const WORDS_BY_PHASE: { [key: number]: Word[] } = {};
PHASES.forEach((phase) => {
  WORDS_BY_PHASE[phase.id] = phase.words;
});

// All letters across all phases
export const ALL_LETTERS = PHASES.reduce((acc: Letter[], phase) => {
  return [...acc, ...phase.letters];
}, []);

// All words across all phases
export const ALL_WORDS = PHASES.reduce((acc: Word[], phase) => {
  return [...acc, ...phase.words];
}, []);

// Sight words
export const SIGHT_WORDS = CURRICULUM.sightWords;

// Books
export const BOOKS = CURRICULUM.books;

// Books by phase
export const BOOKS_BY_PHASE: { [key: number]: Book[] } = {};
BOOKS.forEach((book) => {
  if (!BOOKS_BY_PHASE[book.phase]) {
    BOOKS_BY_PHASE[book.phase] = [];
  }
  BOOKS_BY_PHASE[book.phase].push(book);
});

// Helper function to get phase by ID
export const getPhaseById = (phaseId: number): Phase | undefined => {
  return PHASES.find((phase) => phase.id === phaseId);
};

// Helper function to get letter by ID
export const getLetterById = (letterId: string): Letter | undefined => {
  return ALL_LETTERS.find((letter) => letter.id === letterId);
};

// Helper function to get word by text
export const getWordByText = (wordText: string): Word | undefined => {
  return ALL_WORDS.find((word) => word.word === wordText);
};

// Helper function to get book by ID
export const getBookById = (bookId: string): Book | undefined => {
  return BOOKS.find((book) => book.id === bookId);
};

// Helper function to get letters for a word
export const getLettersForWord = (wordText: string): Letter[] => {
  const word = getWordByText(wordText);
  if (!word) return [];

  return word.letters
    .map((letterId) => getLetterById(letterId.toUpperCase()))
    .filter((letter): letter is Letter => letter !== undefined);
};

// Helper function to get total letters learned up to phase
export const getTotalLettersUpToPhase = (phaseId: number): number => {
  let total = 0;
  for (let i = 1; i <= phaseId; i++) {
    const phase = getPhaseById(i);
    if (phase) {
      total += phase.letters.length;
    }
  }
  return total;
};

// Helper function to get total words learned up to phase
export const getTotalWordsUpToPhase = (phaseId: number): number => {
  let total = 0;
  for (let i = 1; i <= phaseId; i++) {
    const phase = getPhaseById(i);
    if (phase) {
      total += phase.words.length;
    }
  }
  return total;
};

// Export default
export default CURRICULUM;
