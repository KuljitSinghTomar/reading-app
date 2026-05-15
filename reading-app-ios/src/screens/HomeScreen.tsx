import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { CharacterContainer, CharacterType, CharacterState } from '../characters';
import { ActivityCard } from '../components/ActivityCard';
import { StreakCounter } from '../components/StreakCounter';
import { useProgress } from '../hooks/useProgress';
import { Colors } from '../styles/colors';
import { Typography } from '../styles/typography';

const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

interface HomeScreenProps {
  navigation: any;
}

const GREETINGS = [
  "Let's learn phonics!",
  'Ready to read?',
  'Time to practice!',
  'You can do it!',
];

const CHARACTERS: CharacterType[] = ['dog', 'fox', 'owl', 'bear'];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [characterIndex, setCharacterIndex] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const { progress } = useProgress();

  useEffect(() => {
    setGreeting(GREETINGS[characterIndex]);
  }, [characterIndex]);

  useEffect(() => {
    // Rotate character on a timer
    const timer = setInterval(() => {
      setCharacterIndex((prev) => (prev + 1) % CHARACTERS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleActivityPress = (screen: string) => {
    navigation.navigate(screen);
  };

  const lettersLearned = progress.lettersLearned?.length || 0;
  const progressPercentage = lettersLearned / 26;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Reading Academy</Text>
        </View>

        {/* Character Greeting Section */}
        <View style={styles.characterSection}>
          <Pressable
            onPress={() => {
              setCharacterState('happy');
              setTimeout(() => setCharacterState('idle'), 1000);
            }}
          >
            <CharacterContainer
              character={CHARACTERS[characterIndex]}
              state={characterState}
              size="large"
            />
          </Pressable>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>

        {/* Streak Display - Prominent */}
        <View style={styles.streakSection}>
          <StreakCounter days={progress.streakDays || 0} />
        </View>

        {/* Today's Goal Indicator */}
        <View style={styles.goalSection}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>Letters Learned</Text>
            <Text style={styles.goalValue}>
              {lettersLearned} / 26
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(progressPercentage * 100, 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.goalMessage}>
            {lettersLearned === 0
              ? 'Start learning your first letter!'
              : lettersLearned < 13
              ? `Great progress! Keep going to learn all 26 letters.`
              : lettersLearned < 26
              ? `You're almost there! ${26 - lettersLearned} letters to go.`
              : 'Amazing! You learned all 26 letters! 🎉'}
          </Text>
        </View>

        {/* Activity Cards Section */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Choose an Activity</Text>

          <ActivityCard
            title="Phonics Lab"
            icon="🔤"
            color={Colors.red}
            onPress={() => handleActivityPress('PhonicsLab')}
          />

          <ActivityCard
            title="Swipe Reader"
            icon="👆"
            color={Colors.yellow}
            onPress={() => handleActivityPress('SwipeReader')}
          />

          <ActivityCard
            title="Word Blender"
            icon="🎚️"
            color={Colors.green}
            onPress={() => handleActivityPress('WordBlender')}
            isLocked={lettersLearned < 5}
          />

          <ActivityCard
            title="Read Along"
            icon="📖"
            color={Colors.blue}
            onPress={() => handleActivityPress('VoiceReadAlong')}
            isLocked={lettersLearned < 10}
          />
        </View>

        {/* Next Recommendation */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationIcon}>⭐</Text>
          <View>
            <Text style={styles.recommendationTitle}>Next: Practice Phonics Lab</Text>
            <Text style={styles.recommendationText}>
              You're learning Phase {(progress.currentPhase || 0) + 1}
            </Text>
          </View>
        </View>

        {/* Footer Spacing */}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    ...Typography.heading1,
    color: Colors.text,
  },
  characterSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  greeting: {
    ...Typography.heading2,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  streakSection: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  goalSection: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  goalLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  goalValue: {
    ...Typography.heading2,
    color: Colors.blue,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 6,
  },
  goalMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  activitiesSection: {
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading2,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    color: Colors.text,
  },
  recommendationSection: {
    backgroundColor: Colors.backgroundAlt,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  recommendationTitle: {
    ...Typography.heading3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  recommendationText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  footerSpacer: {
    height: Spacing.xl,
  },
});
