import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import { saveStats, loadStats, clearAllData, saveTasks, loadTasks } from '../storage/taskStorage';
import { UserStats, Task } from '../utils/types';

interface TestingScreenProps {
  onOpenMenu: () => void;
}

const TestingScreen = ({ onOpenMenu }: TestingScreenProps) => {
  const handleTimeTravel = async () => {
    const stats = await loadStats();
    const newStats: UserStats = {
      ...stats,
      lastResetDate: Date.now() - 25 * 60 * 60 * 1000,
    };
    await saveStats(newStats);
    Alert.alert('SYSTEM SYNC', 'Time synchronized 25 hours into the past. Restart the app to trigger day reset logic.');
  };

  const handleFormatSystem = async () => {
    Alert.alert(
      'FORMAT SYSTEM?',
      'This will delete all progress and quests. This action cannot be undone.',
      [
        { text: 'CANCEL', style: 'cancel' },
        { 
          text: 'FORMAT', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('SYSTEM RESET', 'The system has been formatted. Please restart the app.');
          }
        }
      ]
    );
  };

  const handleAddXp = async () => {
    const stats = await loadStats();
    const newStats: UserStats = {
      ...stats,
      totalXp: stats.totalXp + 500,
      skills: {
        ...stats.skills,
        Coding: { ...stats.skills.Coding, xp: stats.skills.Coding.xp + 500 }
      }
    };
    await saveStats(newStats);
    Alert.alert('XP INJECTED', '+500 XP added to Coding Skill. Restart app to see changes.');
  };

  const handleAddPoints = async () => {
    const stats = await loadStats();
    const newStats: UserStats = {
      ...stats,
      statPoints: stats.statPoints + 10,
    };
    await saveStats(newStats);
    Alert.alert('POINTS GRANTED', '+10 Stat Points added. Restart app to see changes.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 15 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.title}>SYSTEM CONSOLE</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>DEBUG TOOLS</Text>

        <TouchableOpacity style={styles.btn} onPress={handleTimeTravel}>
          <Text style={styles.btnText}>TIME TRAVEL (NEXT DAY)</Text>
          <Text style={styles.btnDesc}>Sets last reset date to yesterday to trigger penalties.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleAddXp}>
          <Text style={styles.btnText}>XP INJECTION (+500 CODING)</Text>
          <Text style={styles.btnDesc}>Instantly gain XP to test level up progression.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleAddPoints}>
          <Text style={styles.btnText}>GRANT STAT POINTS (+10)</Text>
          <Text style={styles.btnDesc}>Adds points for manual skill distribution.</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: COLORS.danger }]}>DANGER ZONE</Text>

        <TouchableOpacity style={[styles.btn, { borderColor: COLORS.danger }]} onPress={handleFormatSystem}>
          <Text style={[styles.btnText, { color: COLORS.danger }]}>FORMAT SYSTEM (WIPE DATA)</Text>
          <Text style={styles.btnDesc}>Deletes all AsyncStorage data and resets system.</Text>
        </TouchableOpacity>

        <Text style={styles.note}>NOTE: Most changes require an app restart or screen navigation to refresh state.</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerRightPlaceholder: {
    width: 40,
  },
  title: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    ...SHADOWS.glow,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 10,
  },
  btn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 15,
  },
  btnText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  btnDesc: {
    color: COLORS.textDim,
    fontSize: 10,
  },
  note: {
    color: COLORS.textDim,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default TestingScreen;
