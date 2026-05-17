import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Share,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootScreenProps } from '../../navigation/types';
import { HudButton, CloudCard, SquishyButton, ProgressBar } from '../../components/wonder';
import { Palette, Fonts } from '../../theme';
import { useProgress } from '../../hooks/useProgress';
import { progressService } from '../../services/progressService';
import {
  generateWeeklyActivityData,
  generateRecommendations,
  getEnhancedParentStats,
  exportProgressReport,
} from '../../utils/parentHelpers';

const PIN = '1234';

const PinGate: React.FC<{ onUnlock: () => void; onBack: () => void }> = ({
  onUnlock,
  onBack,
}) => {
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);

  const press = (digit: string) => {
    if (entry.length >= 4) return;
    const next = entry + digit;
    setEntry(next);
    setError(false);
    if (next.length === 4) {
      if (next === PIN) {
        setTimeout(onUnlock, 150);
      } else {
        setError(true);
        setTimeout(() => setEntry(''), 500);
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <View style={styles.pinRoot}>
      <View style={styles.pinBack}>
        <HudButton size={56} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={30} color={Palette.text} />
        </HudButton>
      </View>
      <CloudCard cloud style={styles.pinCard}>
        <View style={styles.pinIcon}>
          <MaterialCommunityIcons name="lock" size={36} color={Palette.white} />
        </View>
        <Text style={styles.pinTitle}>Parent Zone</Text>
        <Text style={styles.pinSub}>Ask a grown-up to enter the PIN</Text>
        <View style={styles.pinDots}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.pinDot,
                i < entry.length && styles.pinDotFilled,
                error && styles.pinDotError,
              ]}
            />
          ))}
        </View>
        <View style={styles.keypad}>
          {keys.map((k, i) => (
            <Pressable
              key={i}
              disabled={k === ''}
              style={[styles.key, k === '' && styles.keyHidden]}
              onPress={() => {
                if (k === '⌫') setEntry((e) => e.slice(0, -1));
                else if (k) press(k);
              }}
            >
              <Text style={styles.keyText}>{k}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.pinHint}>Demo PIN: 1234</Text>
      </CloudCard>
    </View>
  );
};

const StatCard: React.FC<{ value: string | number; label: string; color: string }> = ({
  value,
  label,
  color,
}) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const ParentDashboardScreen: React.FC<RootScreenProps<'ParentDashboard'>> = ({
  navigation,
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const { progress } = useProgress();

  const stats = progressService.getStats(progress);
  const enhanced = useMemo(() => getEnhancedParentStats(progress), [progress]);
  const weekly = useMemo(() => generateWeeklyActivityData(progress), [progress]);
  const recommendations = useMemo(() => generateRecommendations(progress), [progress]);
  const maxMinutes = Math.max(10, ...weekly.map((d) => d.minutes));

  if (!unlocked) {
    return (
      <PinGate
        onUnlock={() => setUnlocked(true)}
        onBack={() => navigation.goBack()}
      />
    );
  }

  const handleExport = async () => {
    try {
      await Share.share({
        message: exportProgressReport(progress),
        title: 'Learning Progress Report',
      });
    } catch {
      Alert.alert('Could not share the report.');
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <HudButton size={58} onPress={() => navigation.navigate('MapExplorer')}>
          <MaterialCommunityIcons name="arrow-left" size={32} color={Palette.text} />
        </HudButton>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Parent Dashboard</Text>
          <Text style={styles.subtitle}>Learning progress overview</Text>
        </View>
        <HudButton size={58} variant="muted" onPress={() => setUnlocked(false)}>
          <MaterialCommunityIcons name="lock" size={28} color={Palette.white} />
        </HudButton>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.row}>
          {/* Progress card */}
          <View style={[styles.panel, { flex: 1.4 }]}>
            <Text style={styles.panelTitle}>Child Progress</Text>
            <Text style={styles.progressBig}>
              {stats.lettersLearned}
              <Text style={styles.progressBigMuted}> / 26 letters</Text>
            </Text>
            <ProgressBar
              progress={stats.lettersLearned / 26}
              color={Palette.primary}
              height={16}
            />
            <Text style={styles.panelMeta}>
              Phase {progress.currentPhase + 1} • {stats.sessionsCompleted} sessions •{' '}
              {enhanced.avgSessionDuration}m avg
            </Text>
            <View style={styles.statsRow}>
              <StatCard value={stats.wordsMastered} label="Words" color={Palette.green} />
              <StatCard
                value={progress.streakDays || 0}
                label="Day streak"
                color={Palette.primary}
              />
              <StatCard
                value={stats.totalMinutes}
                label="Minutes"
                color={Palette.blue}
              />
              <StatCard
                value={stats.badges}
                label="Badges"
                color={Palette.yellow}
              />
            </View>
          </View>

          {/* Weekly chart */}
          <View style={[styles.panel, { flex: 1 }]}>
            <Text style={styles.panelTitle}>This Week</Text>
            <View style={styles.chart}>
              {weekly.map((d, i) => (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.chartBarTrack}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${(d.minutes / maxMinutes) * 100}%`,
                          backgroundColor:
                            i === weekly.length - 1 ? Palette.primary : Palette.blue,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{d.day}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.trendText}>
              Trend:{' '}
              {enhanced.weeklyTrend === 'up'
                ? '📈 Improving'
                : enhanced.weeklyTrend === 'down'
                ? '📉 Slowing down'
                : '➡️ Steady'}
            </Text>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Smart Recommendations</Text>
          {recommendations.length === 0 ? (
            <Text style={styles.recEmpty}>
              Keep playing — tips will appear as your child learns.
            </Text>
          ) : (
            recommendations.slice(0, 4).map((rec, i) => (
              <View key={i} style={styles.recRow}>
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={20}
                  color={Palette.yellow}
                />
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))
          )}
        </View>

        {/* Settings */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Voice &amp; sound effects</Text>
              <Text style={styles.settingDesc}>Audio feedback during lessons</Text>
            </View>
            <Switch
              value={voiceOn}
              onValueChange={setVoiceOn}
              trackColor={{ false: '#CBD5E0', true: Palette.green }}
              thumbColor={Palette.white}
            />
          </View>
          <View style={styles.exportWrap}>
            <SquishyButton variant="blue" radius={26} onPress={handleExport}>
              <MaterialCommunityIcons
                name="export-variant"
                size={24}
                color={Palette.white}
              />
              <Text style={styles.exportText}>Export Progress Report</Text>
            </SquishyButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.sky },

  // PIN gate
  pinRoot: {
    flex: 1,
    backgroundColor: Palette.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBack: { position: 'absolute', top: 26, left: 32 },
  pinCard: { alignItems: 'center', padding: 32, width: 420 },
  pinIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinTitle: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Palette.text,
    marginTop: 14,
  },
  pinSub: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Palette.textSoft,
    marginTop: 4,
  },
  pinDots: { flexDirection: 'row', gap: 16, marginVertical: 22 },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Palette.muted,
  },
  pinDotFilled: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  pinDotError: { borderColor: Palette.primary },
  keypad: {
    width: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
  },
  key: {
    width: 78,
    height: 64,
    borderRadius: 18,
    backgroundColor: Palette.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyHidden: { backgroundColor: 'transparent' },
  keyText: { fontFamily: Fonts.display, fontSize: 26, color: Palette.text },
  pinHint: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Palette.muted,
    marginTop: 18,
  },

  // Dashboard
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 18,
  },
  titleWrap: { flex: 1 },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Palette.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Palette.textSoft },
  body: { padding: 28, gap: 18 },
  row: { flexDirection: 'row', gap: 18 },
  panel: {
    backgroundColor: Palette.white,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  panelTitle: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Palette.text,
    marginBottom: 14,
  },
  progressBig: {
    fontFamily: Fonts.display,
    fontSize: 38,
    color: Palette.primary,
    marginBottom: 10,
  },
  progressBigMuted: { fontSize: 20, color: Palette.muted },
  panelMeta: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Palette.textSoft,
    marginTop: 10,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: Palette.sand,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { fontFamily: Fonts.display, fontSize: 26 },
  statLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    color: Palette.muted,
    marginTop: 2,
  },
  chart: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    gap: 8,
  },
  chartCol: { flex: 1, alignItems: 'center', gap: 6 },
  chartBarTrack: {
    width: '70%',
    height: 120,
    backgroundColor: '#EEF1F5',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: { width: '100%', borderRadius: 8, minHeight: 6 },
  chartLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Palette.muted,
  },
  trendText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Palette.textSoft,
    marginTop: 12,
  },
  recEmpty: { fontFamily: Fonts.body, fontSize: 15, color: Palette.textSoft },
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  recText: { flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Palette.text },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingLabel: { fontFamily: Fonts.bodyBold, fontSize: 16, color: Palette.text },
  settingDesc: { fontFamily: Fonts.body, fontSize: 13, color: Palette.textSoft },
  exportWrap: { marginTop: 18, alignItems: 'flex-start' },
  exportText: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Palette.white,
    marginLeft: 10,
  },
});
