import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';

export interface ReadAlongContentProps {
  text: string;
  currentWordIndex: number;
  isPlaying: boolean;
}

export const ReadAlongContent: React.FC<ReadAlongContentProps> = ({
  text,
  currentWordIndex,
  isPlaying,
}) => {
  const words = useMemo(() => text.split(/\s+/).filter((word) => word.length > 0), [text]);

  // Animation for the highlighted word
  const highlightScale = useSharedValue(1);

  React.useEffect(() => {
    if (currentWordIndex > 0) {
      highlightScale.value = withTiming(1.1, {
        duration: 150,
        easing: Easing.out(Easing.cubic),
      });
      highlightScale.value = withTiming(1, {
        duration: 150,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [currentWordIndex, highlightScale]);

  const getWordAnimatedStyle = (index: number) => {
    const isCurrentWord = index === currentWordIndex - 1; // -1 because we update after speaking
    const isPastWord = index < currentWordIndex - 1;

    if (isCurrentWord) {
      return useAnimatedStyle(() => ({
        transform: [{ scale: highlightScale.value }],
      }));
    }

    return {};
  };

  return (
    <View style={styles.container}>
      <View style={styles.textBox}>
        {words.map((word, index) => {
          const isCurrentWord = index === currentWordIndex - 1;
          const isPastWord = index < currentWordIndex - 1;
          const animatedStyle = getWordAnimatedStyle(index);

          return (
            <Animated.Text
              key={`${index}-${word}`}
              style={[
                styles.word,
                isCurrentWord && styles.currentWord,
                isPastWord && styles.pastWord,
                isCurrentWord && animatedStyle,
              ]}
            >
              {word}{' '}
            </Animated.Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  textBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.blue,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  word: {
    ...Typography.bodyLarge,
    color: Colors.text,
    marginRight: 6,
    marginBottom: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  currentWord: {
    backgroundColor: Colors.blue,
    color: Colors.white,
    fontWeight: '700',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pastWord: {
    opacity: 0.4,
  },
});
