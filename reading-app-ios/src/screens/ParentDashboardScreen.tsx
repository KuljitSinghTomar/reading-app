import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Switch,
  TextInput,
  Share,
  Alert,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { useProgress } from '../hooks/useProgress';
import { useParentAccess } from '../hooks/useParentAccess';
import { ParentChart } from '../components/ParentChart';
import { ProgressGrid } from '../components/ProgressGrid';
import {
  generateWeeklyActivityData,
  generateRecommendations,
  exportProgressReport,
  getEnhancedParentStats,
} from '../utils/parentHelpers';
import { progressService } from '../services/progressService';
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

interface PinInputState {
  pin1: string;
  pin2: string;
  pin3: string;
  pin4: string;
}

export const ParentDashboardScreen: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [dailyGoal, setDailyGoal] = useState('30');
  const [showPinInput, setShowPinInput] = useState(true);
  const [pinInput, setPinInput] = useState<PinInputState>({
    pin1: '',
    pin2: '',
    pin3: '',
    pin4: '',
  });
  const [fourFingerTapCount, setFourFingerTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  const { progress } = useProgress();
  const { isAuthenticated, checkPin, logout, isLocked, attempts } =
    useParentAccess();
  const fadeAnim = useRef(new Animated.Value(showPinInput ? 0 : 1)).current;

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // Skip PIN for now in demo - set to authenticated
      setShowPinInput(false);
    };
    checkSession();
  }, []);

  // Animate fade in/out for PIN screen
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showPinInput ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showPinInput]);

  const stats = progressService.getStats(progress);
  const enhancedStats = getEnhancedParentStats(progress);
  const weeklyActivity = generateWeeklyActivityData(progress);
  const recommendations = generateRecommendations(progress);

  // Chart data for weekly activity
  const chartData = weeklyActivity.map((day) => ({
    label: day.day,
    value: day.minutes,
  }));

  const handlePinInput = (digit: string, field: keyof PinInputState) => {
    const newPin = { ...pinInput, [field]: digit };
    setPinInput(newPin);

    // Auto-submit when all fields are filled
    if (
      newPin.pin1 &&
      newPin.pin2 &&
      newPin.pin3 &&
      newPin.pin4
    ) {
      const fullPin = newPin.pin1 + newPin.pin2 + newPin.pin3 + newPin.pin4;
      handlePinSubmit(fullPin);
    }
  };

  const handlePinSubmit = async (pin: string) => {
    const isValid = await checkPin(pin);
    if (isValid) {
      setShowPinInput(false);
      setPinInput({ pin1: '', pin2: '', pin3: '', pin4: '' });
    } else {
      Alert.alert('Incorrect PIN', `Attempts remaining: ${5 - attempts}`);
      setPinInput({ pin1: '', pin2: '', pin3: '', pin4: '' });
    }
  };

  const handleFourFingerTap = (event: GestureResponderEvent) => {
    // Detect 4-finger tap for additional security
    if (event.nativeEvent.touches.length === 4) {
      setFourFingerTapCount((prev) => prev + 1);

      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }

      if (fourFingerTapCount + 1 === 3) {
        // 3 four-finger taps to unlock parent settings
        Alert.alert(
          'Parent Access',
          'Three four-finger taps detected!',
          [
            {
              text: 'Dismiss',
              onPress: () => setFourFingerTapCount(0),
            },
          ]
        );
        setFourFingerTapCount(0);
      } else {
        tapTimeoutRef.current = setTimeout(() => {
          setFourFingerTapCount(0);
        }, 2000);
      }
    }
  };

  const handleExportReport = async () => {
    const report = exportProgressReport(progress);
    try {
      await Share.share({
        message: report,
        title: 'Learning Progress Report',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share report');
      console.error('Share error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Return to child mode?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          setShowPinInput(true);
        },
        style: 'destructive',
      },
    ]);
  };

  // PIN Input Screen
  if (showPinInput) {
    return (
      <SafeAreaView style={styles.pinScreenContainer}>
        <View style={styles.pinScreen}>
          <Text style={styles.pinTitle}>Parent Dashboard</Text>
          <Text style={styles.pinSubtitle}>Enter PIN to continue</Text>

          {isLocked && (
            <View style={styles.lockWarning}>
              <Text style={styles.lockWarningText}>
                Too many failed attempts. Please try again later.
              </Text>
            </View>
          )}

          <View style={styles.pinInputContainer}>
            {(['pin1', 'pin2', 'pin3', 'pin4'] as const).map(
              (field, index) => (
                <TextInput
                  key={field}
                  style={styles.pinInput}
                  maxLength={1}
                  value={pinInput[field]}
                  onChangeText={(text) => {
                    if (/^\d?$/.test(text)) {
                      handlePinInput(text, field);
                      if (text && index < 3) {
                        // Auto-focus next input
                      }
                    }
                  }}
                  keyboardType="number-pad"
                  secureTextEntry={true}
                  editable={!isLocked}
                  placeholder="•"
                  placeholderTextColor={Colors.textSecondary}
                />
              )
            )}
          </View>

          {attempts > 0 && (
            <Text style={styles.attemptsText}>
              Failed attempts: {attempts}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.pinButton,
              pressed && styles.pinButtonPressed,
              isLocked && styles.pinButtonDisabled,
            ]}
            onPress={() => {
              const fullPin =
                pinInput.pin1 +
                pinInput.pin2 +
                pinInput.pin3 +
                pinInput.pin4;
              if (fullPin.length === 4 && !isLocked) {
                handlePinSubmit(fullPin);
              }
            }}
            disabled={isLocked || !pinInput.pin1}
          >
            <Text style={styles.pinButtonText}>Unlock</Text>
          </Pressable>

          <Text style={styles.demoPin}>Demo PIN: 1234</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main Dashboard Screen
  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {
          opacity: fadeAnim,
        },
      ]}
      onTouchStart={handleFourFingerTap}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Parent Dashboard</Text>
              <Text style={styles.subtitle}>Learning Progress Overview</Text>
            </View>
            <View style={styles.headerButtons}>
              <Pressable
                onPress={() => setShowSettings(!showSettings)}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
              >
                <Text style={styles.headerButtonIcon}>⚙️</Text>
              </Pressable>
              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
              >
                <Text style={styles.headerButtonIcon}>🚪</Text>
              </Pressable>
            </View>
          </View>

          {/* Child Profile Section */}
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>Child Learning Progress</Text>
            <Text style={styles.profileText}>
              {stats.lettersLearned} of 26 letters learned
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${(stats.lettersLearned / 26) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.profileSubtext}>
              Phase {progress.currentPhase + 1} • {stats.sessionsCompleted} sessions completed
            </Text>
          </View>

          {/* Stats Grid */}
          <ProgressGrid stats={stats} />

          {/* Weekly Activity Chart */}
          <ParentChart
            data={chartData}
            title="📊 Weekly Learning Time (minutes)"
            type="bar"
            height={220}
          />

          {/* Settings Section */}
          {showSettings && (
            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>Settings & Preferences</Text>

              {/* Voice Toggle */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabel}>
                  <Text style={styles.settingLabelText}>🔊 Voice Enabled</Text>
                  <Text style={styles.settingDescription}>
                    Audio feedback during lessons
                  </Text>
                </View>
                <Switch
                  value={voiceEnabled}
                  onValueChange={setVoiceEnabled}
                  trackColor={{ false: Colors.textSecondary, true: Colors.blue }}
                  thumbColor={voiceEnabled ? Colors.green : Colors.backgroundAlt}
                />
              </View>

              {/* Daily Goal */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabel}>
                  <Text style={styles.settingLabelText}>🎯 Daily Goal (minutes)</Text>
                  <Text style={styles.settingDescription}>
                    Target learning time per day
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={dailyGoal}
                  onChangeText={setDailyGoal}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              {/* Phase Info */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabel}>
                  <Text style={styles.settingLabelText}>📚 Current Phase</Text>
                  <Text style={styles.settingDescription}>
                    Difficulty level
                  </Text>
                </View>
                <Text style={styles.phaseText}>Phase {progress.currentPhase + 1}</Text>
              </View>

              {/* Export Report */}
              <Pressable
                onPress={handleExportReport}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>📋 Export Progress Report</Text>
              </Pressable>

              {/* Recommendations Toggle */}
              <Pressable
                onPress={() => {
                  Alert.alert(
                    'Smart Recommendations',
                    recommendations.join('\n\n'),
                    [{ text: 'OK', onPress: () => {} }]
                  );
                }}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>💡 View Recommendations</Text>
              </Pressable>
            </View>
          )}

          {/* Recommendations Section */}
          {recommendations.length > 0 && !showSettings && (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationTitle}>📊 Smart Recommendations</Text>
              {recommendations.slice(0, 3).map((rec, index) => (
                <View key={index} style={styles.recommendation}>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
              {recommendations.length > 3 && (
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      'All Recommendations',
                      recommendations.join('\n\n'),
                      [{ text: 'OK', onPress: () => {} }]
                    );
                  }}
                >
                  <Text style={styles.seeMoreLink}>
                    See {recommendations.length - 3} more recommendations →
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Activity Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📈 Activity Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Avg Session</Text>
                <Text style={styles.summaryValue}>
                  {enhancedStats.avgSessionDuration}m
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>This Week</Text>
                <Text style={styles.summaryValue}>
                  {chartData.reduce((sum, d) => sum + d.value, 0)}m
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Trend</Text>
                <Text style={styles.summaryValue}>
                  {enhancedStats.weeklyTrend === 'up'
                    ? '📈'
                    : enhancedStats.weeklyTrend === 'down'
                      ? '📉'
                      : '➡️'}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer spacing */}
          <View style={styles.footerSpacer} />
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // PIN Screen Styles
  pinScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pinScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  pinTitle: {
    ...Typography.heading1,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  pinSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  lockWarning: {
    backgroundColor: Colors.error,
    padding: Spacing.lg,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  lockWarningText: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
  },
  pinInputContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 12,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  pinButton: {
    backgroundColor: Colors.blue,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
  },
  pinButtonPressed: {
    opacity: 0.8,
  },
  pinButtonDisabled: {
    opacity: 0.5,
  },
  pinButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  demoPin: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
  },
  attemptsText: {
    ...Typography.label,
    color: Colors.error,
    marginBottom: Spacing.lg,
  },

  // Main Dashboard Styles
  mainContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  title: {
    ...Typography.heading1,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonPressed: {
    opacity: 0.8,
  },
  headerButtonIcon: {
    fontSize: 24,
  },
  profileCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
  profileText: {
    ...Typography.body,
    marginBottom: Spacing.md,
    color: Colors.textSecondary,
  },
  profileSubtext: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: Spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 4,
  },

  // Settings Styles
  settingsSection: {
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.lg,
    borderRadius: 12,
    marginVertical: Spacing.lg,
  },
  settingsTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.lg,
    color: Colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
  },
  settingLabel: {
    flex: 1,
  },
  settingLabelText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  settingDescription: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    padding: Spacing.sm,
    borderRadius: 6,
    width: 60,
    ...Typography.body,
    color: Colors.text,
  },
  phaseText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.blue,
  },
  button: {
    backgroundColor: Colors.blue,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },

  // Recommendations Styles
  recommendationSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  recommendationTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  recommendation: {
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue,
  },
  recommendationText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  seeMoreLink: {
    ...Typography.label,
    color: Colors.blue,
    fontWeight: '600',
    marginTop: Spacing.md,
  },

  // Summary Styles
  summarySection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.lg,
    color: Colors.text,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    ...Typography.heading2,
    color: Colors.blue,
    fontSize: 20,
  },

  // Footer
  footerSpacer: {
    height: Spacing.xl,
  },
});
