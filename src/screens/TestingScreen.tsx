import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { COLORS, getColors, SHADOWS } from '../utils/theme';
import { saveStats, loadStats, clearAllData } from '../storage/taskStorage';
import { UserStats } from '../utils/types';

interface TestingScreenProps {
  onOpenMenu: () => void;
  stats: UserStats | null;
}

const TestingScreen = ({ onOpenMenu, stats }: TestingScreenProps) => {
  const theme = stats?.theme || 'dark';
  const colors = getColors(theme);

  const handleTimeTravel = async () => {
    if (!stats) return;
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
    if (!stats) return;
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
    if (!stats) return;
    const newStats: UserStats = {
      ...stats,
      statPoints: stats.statPoints + 10,
    };
    await saveStats(newStats);
    Alert.alert('POINTS GRANTED', '+10 Stat Points added. Restart app to see changes.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { width: 15, backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary }]}>SYSTEM CONSOLE</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>DEBUG TOOLS</Text>

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleTimeTravel}>
          <Text style={[styles.btnText, { color: colors.text }]}>TIME TRAVEL (NEXT DAY)</Text>
          <Text style={[styles.btnDesc, { color: colors.textDim }]}>Sets last reset date to yesterday to trigger penalties.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleAddXp}>
          <Text style={[styles.btnText, { color: colors.text }]}>XP INJECTION (+500 CODING)</Text>
          <Text style={[styles.btnDesc, { color: colors.textDim }]}>Instantly gain XP to test level up progression.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleAddPoints}>
          <Text style={[styles.btnText, { color: colors.text }]}>GRANT STAT POINTS (+10)</Text>
          <Text style={[styles.btnDesc, { color: colors.textDim }]}>Adds points for manual skill distribution.</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.danger }]}>DANGER ZONE</Text>

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.danger }]} onPress={handleFormatSystem}>
          <Text style={[styles.btnText, { color: colors.danger }]}>FORMAT SYSTEM (WIPE DATA)</Text>
          <Text style={[styles.btnDesc, { color: colors.textDim }]}>Deletes all AsyncStorage data and resets system.</Text>
        </TouchableOpacity>

        <Text style={[styles.note, { color: colors.textDim }]}>NOTE: Most changes require an app restart or screen navigation to refresh state.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuLine: { height: 2, width: 25, marginBottom: 5 },
  headerRightPlaceholder: { width: 40 },
  title: { fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, marginTop: 10 },
  btn: { borderWidth: 1, padding: 15, marginBottom: 15 },
  btnText: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  btnDesc: { fontSize: 10 },
  note: { fontSize: 10, textAlign: 'center', marginTop: 20, fontStyle: 'italic' },
});

export default TestingScreen;
