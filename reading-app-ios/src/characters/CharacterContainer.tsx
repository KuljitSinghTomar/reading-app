import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dog } from './Dog';
import { Fox } from './Fox';
import { Owl } from './Owl';
import { Bear } from './Bear';
import { CharacterType, CharacterState } from './types';

interface CharacterContainerProps {
  character: CharacterType;
  state: CharacterState;
  size?: 'small' | 'medium' | 'large';
  onAnimationComplete?: () => void;
}

export const CharacterContainer: React.FC<CharacterContainerProps> = ({
  character,
  state,
  size = 'medium',
  onAnimationComplete,
}) => {
  const renderCharacter = () => {
    switch (character) {
      case 'dog':
        return <Dog state={state} size={size} onAnimationComplete={onAnimationComplete} />;
      case 'fox':
        return <Fox state={state} size={size} onAnimationComplete={onAnimationComplete} />;
      case 'owl':
        return <Owl state={state} size={size} onAnimationComplete={onAnimationComplete} />;
      case 'bear':
        return <Bear state={state} size={size} onAnimationComplete={onAnimationComplete} />;
      default:
        return <Dog state={state} size={size} onAnimationComplete={onAnimationComplete} />;
    }
  };

  return <View style={styles.container}>{renderCharacter()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
