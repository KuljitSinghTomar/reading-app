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

interface ParentChartProps {
  data: { label: string; value: number }[];
  title: string;
  type: 'bar' | 'line';
  height?: number;
}

export const ParentChart: React.FC<ParentChartProps> = ({
  data,
  title,
  type = 'bar',
  height = 200,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 10);
  const chartColors = [
    Colors.blue,
    Colors.green,
    Colors.red,
    Colors.yellow,
    Colors.orange,
    Colors.purple,
    Colors.pink,
  ];

  const getColor = (index: number) => chartColors[index % chartColors.length];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.chart, { height }]}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const animatedHeight = React.useRef(new Animated.Value(0)).current;

          React.useEffect(() => {
            Animated.timing(animatedHeight, {
              toValue: percentage,
              duration: 800,
              useNativeDriver: false,
            }).start();
          }, [percentage]);

          return (
            <View key={index} style={styles.barContainer}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: animatedHeight.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: getColor(index),
                  },
                ]}
              />
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    ...Typography.heading2,
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  value: {
    ...Typography.label,
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  label: {
    ...Typography.label,
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
