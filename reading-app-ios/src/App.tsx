import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from './styles/colors';
import { Typography } from './styles/typography';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phonics Reading App</Text>
      <Text style={styles.subtitle}>Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.heading1,
    color: Colors.text,
    marginBottom: 16,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
