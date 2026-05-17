import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import { HudButton, Buddy, SquishyButton, ProgressBar, BuddyState } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { getReadAlongBooks } from '../../utils/readAlongHelpers';

const COVERS = [
  { color: '#5B8DEF', emoji: '🐱' },
  { color: '#48BB78', emoji: '🐶' },
  { color: '#FF8BCB', emoji: '👏' },
  { color: '#FFC837', emoji: '🦇' },
  { color: '#FF7A5C', emoji: '🥁' },
  { color: '#9B6BD8', emoji: '🐷' },
  { color: '#4AA9FF', emoji: '🪑' },
  { color: '#F6995C', emoji: '🫙' },
];

const speakWord = (word: string, rate: number): Promise<void> =>
  new Promise((resolve) => {
    Speech.speak(word, {
      language: 'en-US',
      rate,
      pitch: 1.05,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });

export const StoryReaderScreen: React.FC<RootScreenProps<'StoryReader'>> = ({
  navigation,
  route,
}) => {
  const books = getReadAlongBooks();
  const { bookIndex } = route.params;
  const book = books[Math.max(0, Math.min(books.length - 1, bookIndex))];
  const cover = COVERS[bookIndex % COVERS.length];
  const words = book.content.split(/\s+/).filter(Boolean);

  const [highlight, setHighlight] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [buddy, setBuddy] = useState<BuddyState>('idle');
  const playToken = useRef(0);

  useEffect(() => {
    return () => {
      Speech.stop().catch(() => {});
    };
  }, []);

  const stop = () => {
    playToken.current += 1;
    Speech.stop().catch(() => {});
    setPlaying(false);
    setHighlight(-1);
    setBuddy('idle');
  };

  const play = async () => {
    const token = ++playToken.current;
    setPlaying(true);
    setComplete(false);
    setBuddy('thinking');
    for (let i = 0; i < words.length; i++) {
      if (playToken.current !== token) return;
      setHighlight(i);
      await speakWord(words[i].replace(/[^a-zA-Z']/g, ''), 0.82);
    }
    if (playToken.current !== token) return;
    setHighlight(-1);
    setPlaying(false);
    setComplete(true);
    setBuddy('celebrating');
  };

  const hasNext = bookIndex < books.length - 1;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <HudButton size={56} onPress={() => { stop(); navigation.goBack(); }}>
          <MaterialCommunityIcons name="arrow-left" size={30} color={Palette.text} />
        </HudButton>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{book.title}</Text>
          <Text style={styles.headerSub}>
            Story {bookIndex + 1} of {books.length}
          </Text>
        </View>
        <View style={styles.progressWrap}>
          <ProgressBar
            progress={(bookIndex + 1) / books.length}
            color={Palette.blue}
          />
        </View>
      </View>

      <View style={styles.body}>
        {/* Left: book page */}
        <View style={styles.left}>
          <View style={[styles.cover, { backgroundColor: cover.color }]}>
            <Text style={styles.coverEmoji}>{cover.emoji}</Text>
            <View style={styles.coverTitleWrap}>
              <Text style={styles.coverTitle}>{book.title}</Text>
            </View>
          </View>
          <View style={styles.buddyRow}>
            <Buddy state={buddy} size={64} />
            <Text style={styles.buddyText}>
              {complete
                ? 'You read the whole story!'
                : playing
                ? 'Read along with me...'
                : 'Press play to start!'}
            </Text>
          </View>
        </View>

        {/* Right: read-along */}
        <View style={styles.right}>
          <Text style={styles.kicker}>READ ALONG</Text>
          <View style={styles.textWrap}>
            {words.map((w, i) => (
              <Pressable key={i} onPress={() => speakWord(w.replace(/[^a-zA-Z']/g, ''), 0.7)}>
                <Text
                  style={[styles.word, highlight === i && styles.wordActive]}
                >
                  {w}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.controls}>
            <SquishyButton
              variant={playing ? 'muted' : 'blue'}
              onPress={playing ? stop : play}
              radius={30}
            >
              <MaterialCommunityIcons
                name={playing ? 'pause' : complete ? 'replay' : 'play'}
                size={30}
                color={Palette.white}
              />
              <Text style={styles.ctrlText}>
                {playing ? 'STOP' : complete ? 'READ AGAIN' : 'READ TO ME'}
              </Text>
            </SquishyButton>

            {hasNext && (
              <SquishyButton
                variant="green"
                radius={30}
                onPress={() => {
                  stop();
                  navigation.replace('StoryReader', { bookIndex: bookIndex + 1 });
                }}
              >
                <Text style={styles.ctrlText}>NEXT STORY</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={26}
                  color={Palette.white}
                  style={{ marginLeft: 10 }}
                />
              </SquishyButton>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sand },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 14,
    gap: 18,
    backgroundColor: Palette.white,
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontFamily: Fonts.display, fontSize: 24, color: Palette.text },
  headerSub: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Palette.muted,
    letterSpacing: 1.5,
  },
  progressWrap: { width: 200 },
  body: { flex: 1, flexDirection: 'row', padding: 24, gap: 22 },
  left: { width: '38%', gap: 16 },
  cover: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 7,
  },
  coverEmoji: { fontSize: 110 },
  coverTitleWrap: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  coverTitle: { fontFamily: Fonts.display, fontSize: 24, color: Palette.text },
  buddyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.white,
    borderRadius: 22,
    padding: 12,
  },
  buddyText: { flex: 1, fontFamily: Fonts.bodyBold, fontSize: 15, color: Palette.text },
  right: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: 30,
    padding: 28,
    justifyContent: 'space-between',
  },
  kicker: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 2,
    color: Palette.muted,
  },
  textWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  word: {
    fontFamily: Fonts.display,
    fontSize: 38,
    color: Palette.text,
  },
  wordActive: {
    color: Palette.white,
    backgroundColor: Palette.yellow,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 6,
  },
  controls: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  ctrlText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Palette.white,
    marginLeft: 10,
  },
});
