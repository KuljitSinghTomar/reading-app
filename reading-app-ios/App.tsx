import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const content = (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );

  if (Platform.OS === 'web') {
    return (
      <Provider store={store}>
        {content}
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {content}
      </GestureHandlerRootView>
    </Provider>
  );
}
