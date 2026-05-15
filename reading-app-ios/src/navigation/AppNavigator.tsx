import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { PhonicsLabScreen } from '../screens/PhonicsLabScreen';
import { SwipeReaderScreen } from '../screens/SwipeReaderScreen';
import { WordBlenderScreen } from '../screens/WordBlenderScreen';
import { VoiceReadAlongScreen } from '../screens/VoiceReadAlongScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ParentDashboardScreen } from '../screens/ParentDashboardScreen';

import { ActivityStackParamList, RootTabParamList } from './types';
import { Colors } from '../styles/colors';

const ActivityStack = createNativeStackNavigator<ActivityStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const ActivityStackNavigator = () => {
  return (
    <ActivityStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <ActivityStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <ActivityStack.Screen
        name="PhonicsLab"
        component={PhonicsLabScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <ActivityStack.Screen
        name="SwipeReader"
        component={SwipeReaderScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <ActivityStack.Screen
        name="WordBlender"
        component={WordBlenderScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <ActivityStack.Screen
        name="VoiceReadAlong"
        component={VoiceReadAlongScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </ActivityStack.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.backgroundAlt,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        lazy: false,
      })}
    >
      <Tab.Screen
        name="Learning"
        component={ActivityStackNavigator}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Parent"
        component={ParentDashboardScreen}
        options={{
          tabBarLabel: 'Parent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
