import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { COLORS, getColors, SHADOWS } from '../utils/theme';
import { loadStats, saveStats, loadTasks, clearAllData } from '../storage/taskStorage';
import { UserStats } from '../utils/types';
import { updateSystemNotifications } from '../utils/notifications';
import { triggerHaptic } from '../utils/feedback';

interface SettingsScreenProps {
  onOpenMenu: () => void;
  stats: UserStats | null;
  refreshStats: () => void;
}

const SettingsScreen = ({ onOpenMenu, stats, refreshStats }: SettingsScreenProps) => {
  const theme = stats?.theme || 'dark';
  const colors = getColors(theme);

  const updateReminders = async (enabled: boolean) => {
    if (!stats) return;
    triggerHaptic('impactMedium');
    const updated = {
      ...stats,
      notificationSettings: { ...stats.notificationSettings, enabled }
    };
    await saveStats(updated);
    refreshStats();

    const tasks = await loadTasks();
    await updateSystemNotifications(tasks, updated);
  };

  const updateInterval = async (interval: 15 | 30 | 60 | 120) => {
    if (!stats) return;
    triggerHaptic('impactLight');
    const updated = {
      ...stats,
      notificationSettings: { ...stats.notificationSettings, interval }
    };
    await saveStats(updated);
    refreshStats();

    if (updated.notificationSettings.enabled) {
      const tasks = await loadTasks();
      await updateSystemNotifications(tasks, updated);
    }
  };

  const toggleTheme = async () => {
    if (!stats) return;
    triggerHaptic('impactHeavy');
    const updated: UserStats = {
      ...stats,
      theme: stats.theme === 'dark' ? 'light' : 'dark'
    };
    await saveStats(updated);
    refreshStats();
  };

  const handleClearData = () => {
    Alert.alert(
      "EXTREME CAUTION",
      "Are you sure you want to clear all System data? This cannot be undone.",
      [
        { text: "CANCEL", style: "cancel" },
        { 
          text: "EXECUTE", 
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            triggerHaptic('notificationError');
            Alert.alert("SYSTEM RESET", "All data has been erased. Restart the application.");
          }
        }
      ]
    );
  };

  if (!stats) return null;

  const currentSettings = stats.notificationSettings || { enabled: false, interval: 60 };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { width: 15, backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>SYSTEM SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SYSTEM VISUALS</Text>
          <View style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>THEME: {stats.theme === 'dark' ? 'SYSTEM DARK' : 'SYSTEM WHITE'}</Text>
              <Text style={[styles.settingDesc, { color: colors.textDim }]}>Adjust the interface for environmental visibility</Text>
            </View>
            <Switch
              value={stats.theme === 'light'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#333', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>PROTOCOL: REMINDERS</Text>
          
          <View style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>QUEST REMINDERS</Text>
              <Text style={[styles.settingDesc, { color: colors.textDim }]}>Notify if daily quests are incomplete</Text>
            </View>
            <Switch
              value={currentSettings.enabled}
              onValueChange={updateReminders}
              trackColor={{ false: '#333', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {currentSettings.enabled && (
            <View style={[styles.intervalContainer, { backgroundColor: colors.surface + '88', borderColor: colors.border }]}>
              <Text style={[styles.subLabel, { color: colors.textDim }]}>HARASSMENT INTERVAL (MINUTES)</Text>
              <View style={styles.intervalRow}>
                {[15, 30, 60, 120].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => updateInterval(val as any)}
                    style={[
                      styles.intervalBtn,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      currentSettings.interval === val && [styles.intervalBtnActive, { borderColor: colors.primary, backgroundColor: colors.primary + '22' }]
                    ]}
                  >
                    <Text style={[
                      styles.intervalText,
                      { color: colors.textDim },
                      currentSettings.interval === val && { color: colors.primary }
                    ]}>
                      {val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>DATA MANAGEMENT</Text>
          <TouchableOpacity 
            style={[styles.dangerBtn, { borderColor: colors.danger }]} 
            onPress={handleClearData}
          >
            <Text style={[styles.dangerBtnText, { color: colors.danger }]}>RESET ALL SYSTEM DATA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>SYSTEM INFO</Text>
          <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.infoText, { color: colors.textDim }]}>VERSION: 1.0.7</Text>
            <Text style={[styles.infoText, { color: colors.textDim }]}>LICENSE: SOLO LEVELING PROTOCOL</Text>
            <Text style={[styles.infoText, { color: colors.textDim }]}>STATUS: OPERATIONAL</Text>
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
  dangerBtn: {
    padding: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SettingsScreen;
