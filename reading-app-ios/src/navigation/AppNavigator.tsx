import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import { MapExplorerScreen } from '../screens/wonder/MapExplorerScreen';
import { ActivityIntroScreen } from '../screens/wonder/ActivityIntroScreen';
import { HearSayScreen } from '../screens/wonder/HearSayScreen';
import { TraceCanvasScreen } from '../screens/wonder/TraceCanvasScreen';
import { BlenderBridgeScreen } from '../screens/wonder/BlenderBridgeScreen';
import { CelebrationScreen } from '../screens/wonder/CelebrationScreen';
import { StoryLibraryScreen } from '../screens/wonder/StoryLibraryScreen';
import { StoryReaderScreen } from '../screens/wonder/StoryReaderScreen';
import { StickerBookScreen } from '../screens/wonder/StickerBookScreen';
import { ParentDashboardScreen } from '../screens/wonder/ParentDashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MapExplorer"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#E0F4FF' },
      }}
    >
      <Stack.Screen name="MapExplorer" component={MapExplorerScreen} />
      <Stack.Screen name="ActivityIntro" component={ActivityIntroScreen} />
      <Stack.Screen name="HearSay" component={HearSayScreen} />
      <Stack.Screen name="TraceCanvas" component={TraceCanvasScreen} />
      <Stack.Screen name="BlenderBridge" component={BlenderBridgeScreen} />
      <Stack.Screen
        name="Celebration"
        component={CelebrationScreen}
        options={{ animation: 'none' }}
      />
      <Stack.Screen name="StoryLibrary" component={StoryLibraryScreen} />
      <Stack.Screen name="StoryReader" component={StoryReaderScreen} />
      <Stack.Screen name="StickerBook" component={StickerBookScreen} />
      <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
    </Stack.Navigator>
  );
};
