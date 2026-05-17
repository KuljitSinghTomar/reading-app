import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import { HudButton } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { getReadAlongBooks } from '../../utils/readAlongHelpers';
import { useProgress } from '../../hooks/useProgress';
import { countCompletedLessons } from '../../data/lessons';

const COVER_META = [
  { color: '#5B8DEF', emoji: '🐱' },
  { color: '#48BB78', emoji: '🐶' },
  { color: '#FF8BCB', emoji: '👏' },
  { color: '#FFC837', emoji: '🦇' },
  { color: '#FF7A5C', emoji: '🥁' },
  { color: '#9B6BD8', emoji: '🐷' },
  { color: '#4AA9FF', emoji: '🪑' },
  { color: '#F6995C', emoji: '🫙' },
];

const BookCard: React.FC<{
  title: string;
  color: string;
  emoji: string;
  locked: boolean;
  onPress: () => void;
}> = ({ title, color, emoji, locked, onPress }) => {
  const press = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * 8 }],
  }));

  return (
    <Pressable
      onPressIn={() => !locked && (press.value = withTiming(1, { duration: 70 }))}
      onPressOut={() => (press.value = withTiming(0, { duration: 110 }))}
      onPress={() => {
        if (locked) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress();
      }}
    >
      <View style={styles.bookSlot}>
        <View style={[styles.bookShadow, { backgroundColor: '#00000022' }]} />
        <Animated.View
          style={[
            styles.book,
            { backgroundColor: locked ? '#C7CCD4' : color },
            faceStyle,
          ]}
        >
          <Text style={styles.bookEmoji}>{locked ? '🔒' : emoji}</Text>
          <View style={styles.bookTitleWrap}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {title}
            </Text>
          </View>
          <View style={styles.bookSpine} />
        </Animated.View>
      </View>
    </Pressable>
  );
};

export const StoryLibraryScreen: React.FC<RootScreenProps<'StoryLibrary'>> = ({
  navigation,
}) => {
  const books = getReadAlongBooks();
  const { progress } = useProgress();
  const unlockedCount = Math.max(1, countCompletedLessons(progress.lettersLearned || []));

  const shelves = [books.slice(0, 4), books.slice(4, 8)];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <HudButton size={58} variant="primary" onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={32} color={Palette.white} />
        </HudButton>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Story Library</Text>
          <Text style={styles.subtitle}>Pick a book to read along</Text>
        </View>
        <View style={{ width: 58 }} />
      </View>

      <ScrollView contentContainerStyle={styles.shelves}>
        {shelves.map((shelf, si) => (
          <View key={si} style={styles.shelfBlock}>
            <View style={styles.shelfRow}>
              {shelf.map((book, bi) => {
                const index = si * 4 + bi;
                const meta = COVER_META[index % COVER_META.length];
                return (
                  <BookCard
                    key={book.id}
                    title={book.title}
                    color={meta.color}
                    emoji={meta.emoji}
                    locked={index > unlockedCount}
                    onPress={() =>
                      navigation.navigate('StoryReader', { bookIndex: index })
                    }
                  />
                );
              })}
            </View>
            <View style={styles.shelfPlank} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sky },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 18,
  },
  titleWrap: { flex: 1 },
  title: { fontFamily: Fonts.display, fontSize: 30, color: Palette.text },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Palette.textSoft,
  },
  shelves: { padding: 28, gap: 10 },
  shelfBlock: { marginBottom: 14 },
  shelfRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  shelfPlank: {
    height: 22,
    backgroundColor: '#C49A6C',
    borderRadius: 8,
    marginTop: -4,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  bookSlot: { width: 168, height: 224, justifyContent: 'flex-end' },
  bookShadow: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 8,
    bottom: 0,
    borderRadius: 20,
  },
  book: {
    width: 160,
    height: 210,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  bookEmoji: { fontSize: 56, marginTop: 8 },
  bookTitleWrap: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
  },
  bookTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Palette.text,
    textAlign: 'center',
  },
  bookSpine: {
    position: 'absolute',
    left: 10,
    top: 12,
    bottom: 12,
    width: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
