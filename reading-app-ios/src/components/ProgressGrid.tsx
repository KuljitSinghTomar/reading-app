import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
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

interface ProgressGridProps {
  stats: {
    lettersLearned: number;
    wordsMastered: number;
    sessionsCompleted: number;
    totalMinutes: number;
    streakDays: number;
    badges: number;
  };
}

interface GridItemData {
  value: number | string;
  label: string;
  icon: string;
  color: string;
}

export const ProgressGrid: React.FC<ProgressGridProps> = ({ stats }) => {
  const gridItems: GridItemData[] = [
    {
      value: `${stats.lettersLearned}/26`,
      label: 'Letters',
      icon: '🔤',
      color: Colors.blue,
    },
    {
      value: stats.wordsMastered,
      label: 'Words',
      icon: '📖',
      color: Colors.green,
    },
    {
      value: stats.sessionsCompleted,
      label: 'Sessions',
      icon: '⏱️',
      color: Colors.red,
    },
    {
      value: `${stats.totalMinutes}m`,
      label: 'Time',
      icon: '⏰',
      color: Colors.orange,
    },
    {
      value: `${stats.streakDays}`,
      label: 'Streak',
      icon: '🔥',
      color: Colors.yellow,
    },
    {
      value: stats.badges,
      label: 'Badges',
      icon: '⭐',
      color: Colors.purple,
    },
  ];

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - Spacing.lg * 2 - Spacing.md * 2) / 3;

  return (
    <View style={styles.grid}>
      {gridItems.map((item, index) => (
        <GridItem
          key={index}
          item={item}
          width={itemWidth}
        />
      ))}
    </View>
  );
};

interface GridItemProps {
  item: GridItemData;
  width: number;
}

const GridItem: React.FC<GridItemProps> = ({ item, width }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 5,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.gridItem,
        {
          width,
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        },
      ]}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={[styles.value, { color: item.color }]}>
        {item.value}
      </Text>
      <Text style={styles.label}>{item.label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  value: {
    ...Typography.heading2,
    marginBottom: 4,
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
