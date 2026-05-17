/**
 * Wonder Island lesson map.
 * Each lesson is one node on the island path and drives the full
 * Hear & Say -> Trace -> Blend -> Celebrate loop.
 */
import { Palette } from '../theme';

export interface BlendWord {
  word: string;
  letters: string[];
}

export interface Reward {
  name: string;
  emoji: string;
  color: string;
}

export interface Lesson {
  id: number;
  letter: string;
  /** Phonetic cue used as a TTS fallback. */
  sound: string;
  /** Colour for the letter blocks/highlights in this lesson. */
  color: string;
  /** Word shown in the Trace Canvas swipe-to-read bar. */
  traceWord: string;
  /** CVC word used on the Blender Bridge. */
  blend: BlendWord;
  /** Read-along sentence for Hear & Say. */
  sentence: string;
  /** Friendly area name shown on the map / intro. */
  area: string;
  reward: Reward;
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    letter: 'S',
    sound: 'sss',
    color: Palette.primary,
    traceWord: 'SUN',
    blend: { word: 'sat', letters: ['s', 'a', 't'] },
    sentence: 'The sun is up high.',
    area: 'Sandy Cove',
    reward: { name: 'Sunshine', emoji: '☀️', color: Palette.yellow },
  },
  {
    id: 2,
    letter: 'A',
    sound: 'ah',
    color: Palette.yellow,
    traceWord: 'ANT',
    blend: { word: 'tap', letters: ['t', 'a', 'p'] },
    sentence: 'An ant ran to the mat.',
    area: 'Apple Grove',
    reward: { name: 'Red Apple', emoji: '🍎', color: Palette.primary },
  },
  {
    id: 3,
    letter: 'T',
    sound: 'tuh',
    color: Palette.green,
    traceWord: 'TENT',
    blend: { word: 'top', letters: ['t', 'o', 'p'] },
    sentence: 'The tent is on top.',
    area: 'Tall Palms',
    reward: { name: 'Palm Tree', emoji: '🌴', color: Palette.green },
  },
  {
    id: 4,
    letter: 'P',
    sound: 'puh',
    color: Palette.pink,
    traceWord: 'PIG',
    blend: { word: 'pat', letters: ['p', 'a', 't'] },
    sentence: 'The pig sat in the pen.',
    area: 'Piglet Pond',
    reward: { name: 'Pink Pig', emoji: '🐷', color: Palette.pink },
  },
  {
    id: 5,
    letter: 'M',
    sound: 'mmm',
    color: Palette.coral,
    traceWord: 'MONKEY',
    blend: { word: 'mat', letters: ['m', 'a', 't'] },
    sentence: 'The monkey can sit on a mat.',
    area: 'Coconut Bay',
    reward: { name: 'Monkey', emoji: '🐵', color: Palette.coral },
  },
  {
    id: 6,
    letter: 'I',
    sound: 'ih',
    color: Palette.blue,
    traceWord: 'IGLOO',
    blend: { word: 'sit', letters: ['s', 'i', 't'] },
    sentence: 'It is fun in the snow.',
    area: 'Icy Inlet',
    reward: { name: 'Snowflake', emoji: '❄️', color: Palette.blue },
  },
  {
    id: 7,
    letter: 'D',
    sound: 'duh',
    color: Palette.yellow,
    traceWord: 'DOG',
    blend: { word: 'dad', letters: ['d', 'a', 'd'] },
    sentence: 'The dog can dig and run.',
    area: 'Driftwood Beach',
    reward: { name: 'Happy Dog', emoji: '🐶', color: Palette.yellow },
  },
  {
    id: 8,
    letter: 'N',
    sound: 'nnn',
    color: Palette.purple,
    traceWord: 'NEST',
    blend: { word: 'nap', letters: ['n', 'a', 'p'] },
    sentence: 'The bird has a nice nest.',
    area: 'Nesting Ridge',
    reward: { name: 'Little Bird', emoji: '🐦', color: Palette.purple },
  },
];

export const getLesson = (index: number): Lesson =>
  LESSONS[Math.max(0, Math.min(LESSONS.length - 1, index))];

/** A lesson counts as complete once its letter has been learned. */
export const isLessonComplete = (lesson: Lesson, lettersLearned: string[]): boolean =>
  lettersLearned.includes(lesson.letter.toUpperCase());

/** Index of the first unfinished lesson (the pulsing "current" node). */
export const getCurrentLessonIndex = (lettersLearned: string[]): number => {
  const idx = LESSONS.findIndex((l) => !isLessonComplete(l, lettersLearned));
  return idx === -1 ? LESSONS.length - 1 : idx;
};

export const countCompletedLessons = (lettersLearned: string[]): number =>
  LESSONS.filter((l) => isLessonComplete(l, lettersLearned)).length;
