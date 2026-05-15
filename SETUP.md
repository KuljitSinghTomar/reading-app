# Setup Guide - Phonics Reading App

This guide walks through initial project setup. Run these commands in order.

---

## Prerequisites

- **Node.js:** v18+ installed (check: `node --version`)
- **Expo CLI:** Latest version (install: `npm install -g expo-cli`)
- **iPad or iPad Simulator:** For testing
- **Xcode:** For building iOS app (if not on macOS, can skip for now)
- **Text Editor/IDE:** VS Code recommended

---

## Step 1: Initialize React Native + Expo Project

```bash
cd /Users/kuljitsinghtomar/Projects/reading-app

# Initialize Expo project
npx create-expo-app@latest reading-app-ios

# Navigate to project
cd reading-app-ios

# Install additional dependencies
npm install
```

---

## Step 2: Install Core Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Audio & TTS
npm install expo-av expo-speech

# Animations
npm install react-native-reanimated react-native-gesture-handler

# State Management (choose one)
npm install @reduxjs/toolkit react-redux
# OR
# npm install zustand

# Storage
npm install @react-native-async-storage/async-storage

# Utilities
npm install lodash.debounce
```

---

## Step 3: Setup TypeScript

```bash
# Initialize TypeScript
npm install --save-dev typescript
npx tsc --init

# Create tsconfig.json for React Native
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "lib": ["ES2020", "DOM"]
  }
}
EOF
```

---

## Step 4: Create Project Structure

```bash
# Create directory structure
mkdir -p src/{screens,components,characters,data,services,styles,utils,hooks,store}
mkdir -p assets/{characters,sounds,images,animations}
mkdir -p docs tests/__tests__

# Create initial files
touch src/App.tsx
touch src/styles/colors.ts
touch src/styles/typography.ts
touch src/data/phonics.json
```

---

## Step 5: Create Initial App.tsx

```bash
cat > src/App.tsx << 'EOF'
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
EOF
```

---

## Step 6: Create Design System Files

### colors.ts

```bash
cat > src/styles/colors.ts << 'EOF'
export const Colors = {
  // Primary Colors (Letter Blocks)
  red: '#FF6B6B',
  yellow: '#FFD93D',
  blue: '#6BCB77',
  green: '#4D96FF',
  
  // Accent Colors
  orange: '#FF9D5C',
  purple: '#BB86FC',
  pink: '#FF6BB9',
  
  // Background & Text
  background: '#F8F9FA',
  backgroundAlt: '#E8F4F8',
  
  // Text Colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  
  // Semantic Colors
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
};
EOF
```

### typography.ts

```bash
cat > src/styles/typography.ts << 'EOF'
import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  heading1: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    fontFamily: 'System', // Change to 'Montserrat' if custom font loaded
  },
  heading2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  phonicsLetter: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
});
EOF
```

---

## Step 7: Create Phonics Data Structure

```bash
cat > src/data/phonics.json << 'EOF'
{
  "phases": [
    {
      "id": 1,
      "name": "Phase 1: Letter Recognition",
      "weeks": "1-2",
      "letters": [
        {
          "id": "S",
          "name": "S",
          "sound": "sss",
          "color": "#FF6B6B",
          "examples": ["sat", "sun", "sit"],
          "audioUrl": ""
        },
        {
          "id": "A",
          "name": "A",
          "sound": "aaa",
          "color": "#FFD93D",
          "examples": ["ant", "apple", "at"],
          "audioUrl": ""
        },
        {
          "id": "T",
          "name": "T",
          "sound": "tuh",
          "color": "#6BCB77",
          "examples": ["tap", "top", "tip"],
          "audioUrl": ""
        },
        {
          "id": "P",
          "name": "P",
          "sound": "puh",
          "color": "#4D96FF",
          "examples": ["pat", "pig", "pit"],
          "audioUrl": ""
        },
        {
          "id": "M",
          "name": "M",
          "sound": "mmm",
          "color": "#BB86FC",
          "examples": ["mat", "mop", "mum"],
          "audioUrl": ""
        }
      ]
    }
  ],
  "words": [
    {
      "id": "sat",
      "word": "sat",
      "phase": 2,
      "letters": ["s", "a", "t"],
      "type": "cvc"
    }
  ]
}
EOF
```

---

## Step 8: Setup Expo Configuration

```bash
# Check app.json exists
cat > app.json << 'EOF'
{
  "expo": {
    "name": "Phonics Reading App",
    "slug": "phonics-reading-app",
    "version": "1.0.0",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.phonicsreadingapp.ios"
    },
    "plugins": [
      [
        "expo-av",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone to record your reading."
        }
      ]
    ]
  }
}
EOF
```

---

## Step 9: Test Setup

```bash
# Start Expo development server
npx expo start

# Options displayed:
# - Press 's' to switch between iOS/Android simulators
# - Press 'i' to open iOS simulator (requires Xcode)
# - Press 'a' to open Android emulator
# - Press 'j' to open Expo dev tools

# On first run, you may be prompted to install Expo Go on your device
```

---

## Step 10: Set Git Up

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial project setup: React Native + Expo

- Initialize Expo project structure
- Add core dependencies (navigation, audio, animations, state management)
- Setup design system (colors, typography)
- Create phonics data structure
- Configure TypeScript

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Step 11: Verify Installation

Check that the following work:

```bash
# Test TypeScript compilation
npx tsc --noEmit

# Test Expo build
npx expo build:web --dry-run

# Test imports (create test file)
cat > test-imports.js << 'EOF'
const colors = require('./src/styles/colors');
console.log('Colors loaded:', Object.keys(colors.Colors).length);
EOF
node test-imports.js
rm test-imports.js
```

---

## Directory Confirmation

After setup, your structure should look like:

```
reading-app/
├── src/
│   ├── screens/
│   ├── components/
│   ├── characters/
│   ├── data/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── hooks/
│   ├── store/
│   └── App.tsx
├── assets/
│   ├── characters/
│   ├── sounds/
│   ├── images/
│   └── animations/
├── docs/
├── tests/
├── app.json
├── tsconfig.json
├── package.json
├── REQUIREMENTS.md
├── FEATURE_BREAKDOWN.md
├── PROJECT_PLAN.md
├── CLAUDE.md
└── SETUP.md (this file)
```

---

## Next Steps

1. **Confirm setup works:** Run `npx expo start` and see app launch
2. **Review REQUIREMENTS.md:** Understand full feature spec
3. **Review PROJECT_PLAN.md:** Understand week-by-week timeline
4. **Begin Week 1 tasks:** See FEATURE_BREAKDOWN.md Phase A

---

## Troubleshooting

### Issue: `npm install` fails
**Solution:** Clear cache and retry
```bash
npm cache clean --force
rm package-lock.json
npm install
```

### Issue: Expo doesn't start
**Solution:** Update Expo CLI
```bash
npm install -g expo-cli@latest
```

### Issue: iOS simulator doesn't open
**Solution:** Check Xcode installation
```bash
xcode-select --install
# or open Xcode and install command-line tools
```

### Issue: TypeScript errors everywhere
**Solution:** Make sure tsconfig.json is correct (see Step 5)

---

## Optional: Custom Fonts Setup

If you want to use Montserrat or Quicksand:

```bash
# Download fonts to assets
mkdir -p assets/fonts

# Place .ttf files in assets/fonts/

# Update app.json plugins
```

---

## Ready?

Once setup is complete and `npx expo start` works, you're ready to begin Week 1 tasks!

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for what's next.
