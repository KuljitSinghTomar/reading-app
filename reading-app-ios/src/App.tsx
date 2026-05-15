import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeReaderScreen } from './screens/SwipeReaderScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SwipeReaderScreen />
    </GestureHandlerRootView>
  );
}
