import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import {
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';

import { store } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';

const LoadingScreen = () => (
  <View style={styles.loading}>
    <Text style={styles.loadingTitle}>Wonder Island</Text>
    <ActivityIndicator size="large" color="#FF4B4B" />
  </View>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  const content = (
    <>
      <StatusBar hidden />
      {fontsLoaded ? (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      ) : (
        <LoadingScreen />
      )}
    </>
  );

  if (Platform.OS === 'web') {
    return <Provider store={store}>{content}</Provider>;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>{content}</GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#E0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loadingTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2D3748',
  },
});
