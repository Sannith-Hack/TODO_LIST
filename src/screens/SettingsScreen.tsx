import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import { loadStats, saveStats } from '../storage/taskStorage';
import { UserStats } from '../utils/types';
import { schedulePenaltyNotification } from '../utils/notifications';
import notifee from '@notifee/react-native';

interface SettingsScreenProps {
  onOpenMenu: () => void;
}

const SettingsScreen = ({ onOpenMenu }: SettingsScreenProps) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await loadStats();
      if (!data.notificationSettings) {
        data.notificationSettings = { enabled: false, interval: 60 };
        await saveStats(data);
      }
      setStats(data);
    };
    fetchSettings();
  }, []);

  const updateReminders = async (enabled: boolean) => {
    if (!stats) return;
    const updated = {
      ...stats,
      notificationSettings: { ...stats.notificationSettings, enabled }
    };
    setStats(updated);
    await saveStats(updated);

    if (enabled) {
      await schedulePenaltyNotification(updated.notificationSettings.interval);
    } else {
      await notifee.cancelAllNotifications();
    }
  };

  const updateInterval = async (interval: 15 | 30 | 60 | 120) => {
    if (!stats) return;
    const updated = {
      ...stats,
      notificationSettings: { ...stats.notificationSettings, interval }
    };
    setStats(updated);
    await saveStats(updated);

    if (updated.notificationSettings.enabled) {
      await schedulePenaltyNotification(interval);
    }
  };

  if (!stats) return null;

  const currentSettings = stats.notificationSettings || { enabled: false, interval: 60 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 15 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SYSTEM SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROTOCOL: REMINDERS</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>QUEST REMINDERS</Text>
              <Text style={styles.settingDesc}>Notify if daily quests are incomplete</Text>
            </View>
            <Switch
              value={currentSettings.enabled}
              onValueChange={updateReminders}
              trackColor={{ false: COLORS.secondary, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>

          {currentSettings.enabled && (
            <View style={styles.intervalContainer}>
              <Text style={styles.subLabel}>HARASSMENT INTERVAL (MINUTES)</Text>
              <View style={styles.intervalRow}>
                {[15, 30, 60, 120].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => updateInterval(val as any)}
                    style={[
                      styles.intervalBtn,
                      currentSettings.interval === val && styles.intervalBtnActive
                    ]}
                  >
                    <Text style={[
                      styles.intervalText,
                      currentSettings.interval === val && styles.intervalTextActive
                    ]}>
                      {val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.warningText}>
                * The system will persist until all daily protocols are executed.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM INFO</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>VERSION: 1.0.6</Text>
            <Text style={styles.infoText}>LICENSE: SOLO LEVELING PROTOCOL</Text>
            <Text style={styles.infoText}>STATUS: OPERATIONAL</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  menuLine: {
    height: 2,
    width: 25,
    backgroundColor: COLORS.primary,
    marginBottom: 5,
    ...SHADOWS.glow,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: COLORS.primary,
    textShadowRadius: 10,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
    opacity: 0.7,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  settingDesc: {
    color: COLORS.textDim,
    fontSize: 10,
    marginTop: 4,
  },
  intervalContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: COLORS.surface + '88',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 15,
    letterSpacing: 1,
  },
  intervalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  intervalBtn: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
  },
  intervalBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '22',
    ...SHADOWS.glow,
  },
  intervalText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: 'bold',
  },
  intervalTextActive: {
    color: COLORS.primary,
  },
  warningText: {
    color: COLORS.danger,
    fontSize: 8,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
});

export default SettingsScreen;
