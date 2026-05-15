export type CharacterType = 'dog' | 'fox' | 'owl' | 'bear';
export type CharacterState = 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';

export interface CharacterProps {
  type?: CharacterType;
  state: CharacterState;
  size?: 'small' | 'medium' | 'large';
  onAnimationComplete?: () => void;
}

export interface CharacterConfig {
  name: string;
  color: string;
  personality: string;
}
