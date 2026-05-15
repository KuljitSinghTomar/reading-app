import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SwipeReaderScreen } from './screens/SwipeReaderScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { View } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Temporarily showing both screens - integrate with navigation later */}
        <View style={{ flex: 1 }}>
          <SwipeReaderScreen />
          {/* <ProgressScreen /> */}
        </View>
      </GestureHandlerRootView>
    </Provider>
  );
}
