import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { COLORS, getColors, SHADOWS } from '../utils/theme';
import { UserStats } from '../utils/types';
import { saveStats } from '../storage/taskStorage';
import { triggerHaptic, playSound, FEEDBACK_SOUNDS } from '../utils/feedback';
import { announce, SYSTEM_VOICE } from '../utils/sovereign';

const { width } = Dimensions.get('window');

interface Dungeon {
  id: string;
  name: string;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  minLevel: number;
  floors: number;
  description: string;
  bossName: string;
}

const DUNGEONS: Dungeon[] = [
  { id: 'd1', name: 'INSTANCED DUNGEON: THE TRIALS', rank: 'E', minLevel: 1, floors: 5, description: 'A basic training ground for new hunters.', bossName: 'Steel-Fanged Lycan' },
  { id: 'd2', name: 'RE-AWAKENING GATE', rank: 'D', minLevel: 10, floors: 10, description: 'Test your resolve against the undead.', bossName: 'Blue Poison Fang Kasaka' },
  { id: 'd3', name: 'SHADOW DUNGEON: RED GATE', rank: 'C', minLevel: 25, floors: 20, description: 'Survive in an environment of eternal ice.', bossName: 'Baruka' },
  { id: 'd4', name: 'S-RANK GATE: JEJU ISLAND', rank: 'S', minLevel: 80, floors: 1, description: 'The ultimate survival test. Kill the Ant King.', bossName: 'Beru' },
];

const DungeonScreen = ({ onOpenMenu, stats, refreshStats }: { onOpenMenu: () => void, stats: UserStats | null, refreshStats: () => void }) => {
  const theme = stats?.theme || 'dark';
  const colors = getColors(theme);
  const primaryColor = COLORS.primary;

  const currentProgress = stats?.dungeonProgress || {
    currentFloor: 1,
    maxFloor: 1,
    clearedDungeons: [],
    floorCompletionCount: 0
  };

  const activeDungeon = DUNGEONS.find(d => d.id === currentProgress.activeDungeonId) || null;

  const handleEnterDungeon = async (dungeon: Dungeon) => {
    if (!stats) return;
    if (stats.totalLevel < dungeon.minLevel) {
      Alert.alert('ACCESS DENIED', `Minimum Level ${dungeon.minLevel} required to enter this Gate.`);
      triggerHaptic('notificationError');
      return;
    }

    const newStats: UserStats = {
      ...stats,
      dungeonProgress: {
        ...currentProgress,
        activeDungeonId: dungeon.id,
        currentFloor: 1,
        floorCompletionCount: 0
      }
    };

    triggerHaptic('impactHeavy');
    playSound(FEEDBACK_SOUNDS.QUEST_COMPLETE);
    announce(`Entering dungeon. ${dungeon.name}. Current Floor: 1.`, stats);
    await saveStats(newStats);
    refreshStats();
  };

  const renderDungeonCard = (dungeon: Dungeon) => {
    const isCleared = currentProgress.clearedDungeons.includes(dungeon.id);
    const isActive = currentProgress.activeDungeonId === dungeon.id;
    const isLocked = stats ? stats.totalLevel < dungeon.minLevel : true;

    return (
      <View key={dungeon.id} style={[styles.dungeonCard, { backgroundColor: colors.surface, borderColor: isActive ? COLORS.accent : colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.rankBadge, { borderColor: isLocked ? colors.textDim : COLORS[dungeon.rank as keyof typeof COLORS] || COLORS.primary }]}>
            <Text style={[styles.rankText, { color: isLocked ? colors.textDim : COLORS[dungeon.rank as keyof typeof COLORS] || COLORS.primary }]}>{dungeon.rank}</Text>
          </View>
          <Text style={[styles.dungeonName, { color: colors.text }]}>{dungeon.name}</Text>
        </View>
        
        <Text style={[styles.dungeonDesc, { color: colors.textDim }]}>{dungeon.description}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={[styles.footerInfo, { color: colors.textDim }]}>FLOORS: {dungeon.floors} | MIN LVL: {dungeon.minLevel}</Text>
          {isActive ? (
             <View style={[styles.activeIndicator, { backgroundColor: COLORS.accent + '33', borderColor: COLORS.accent }]}>
                <Text style={[styles.activeText, { color: COLORS.accent }]}>ACTIVE</Text>
             </View>
          ) : isCleared ? (
             <View style={[styles.clearedIndicator, { backgroundColor: colors.success + '33', borderColor: colors.success }]}>
                <Text style={[styles.clearedText, { color: colors.success }]}>CLEARED</Text>
             </View>
          ) : (
            <TouchableOpacity 
              style={[styles.enterBtn, { borderColor: isLocked ? colors.border : COLORS.primary }]} 
              onPress={() => handleEnterDungeon(dungeon)}
            >
              <Text style={[styles.enterBtnText, { color: isLocked ? colors.textDim : COLORS.primary }]}>
                {isLocked ? 'LOCKED' : 'ENTER GATE'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={[styles.menuLine, { backgroundColor: primaryColor }]} />
          <View style={[styles.menuLine, { width: 15, backgroundColor: primaryColor }]} />
          <View style={[styles.menuLine, { backgroundColor: primaryColor }]} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: primaryColor }]}>DUNGEON MAP</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeDungeon ? (
          <View style={[styles.activeDungeonSection, { backgroundColor: colors.surface, borderColor: COLORS.accent }]}>
            <Text style={[styles.sectionSubtitle, { color: COLORS.accent }]}>CURRENT EXPLORATION</Text>
            <Text style={[styles.activeDungeonName, { color: colors.text }]}>{activeDungeon.name}</Text>
            
            <View style={styles.floorStatus}>
              <View style={styles.floorCircle}>
                 <Text style={[styles.floorLabel, { color: colors.textDim }]}>FLOOR</Text>
                 <Text style={[styles.floorValue, { color: COLORS.accent }]}>{currentProgress.currentFloor}</Text>
              </View>
              <View style={styles.floorProgressInfo}>
                 <Text style={[styles.progressTitle, { color: colors.text }]}>CLEARANCE PROTOCOL</Text>
                 <Text style={[styles.progressDesc, { color: colors.textDim }]}>Complete quests to descend further.</Text>
                 <View style={[styles.progressContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.progressBar, { width: `${(currentProgress.floorCompletionCount / 3) * 100}%`, backgroundColor: COLORS.accent }]} />
                 </View>
                 <Text style={[styles.progressText, { color: colors.textDim }]}>
                    {currentProgress.floorCompletionCount} / 3 Quests to Floor {currentProgress.currentFloor + 1}
                 </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.exitBtn, { borderColor: colors.danger }]} 
              onPress={() => {
                Alert.alert('EXIT GATE?', 'Progress on the current floor will be lost.', [
                  { text: 'CANCEL', style: 'cancel' },
                  { text: 'EXIT', style: 'destructive', onPress: async () => {
                    if (!stats) return;
                    await saveStats({ ...stats, dungeonProgress: { ...currentProgress, activeDungeonId: undefined } });
                    refreshStats();
                    triggerHaptic('impactMedium');
                  }}
                ]);
              }}
            >
              <Text style={[styles.exitBtnText, { color: colors.danger }]}>ABANDON EXPLORATION</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.introSection}>
             <Text style={[styles.introTitle, { color: colors.text }]}>NO ACTIVE GATE DETECTED</Text>
             <Text style={[styles.introDesc, { color: colors.textDim }]}>Select a Gate below to begin your descent into the system's memory.</Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>AVAILABLE GATES</Text>
        {DUNGEONS.map(renderDungeonCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuLine: { height: 2, width: 25, marginBottom: 5, ...SHADOWS.glow },
  title: { fontSize: 18, fontWeight: 'bold', letterSpacing: 2, textShadowRadius: 10 },
  scrollContent: { padding: 20 },
  introSection: { marginBottom: 30, alignItems: 'center', padding: 20 },
  introTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  introDesc: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  activeDungeonSection: { padding: 20, borderWidth: 1, marginBottom: 40, ...SHADOWS.glowCustom(COLORS.accent) },
  sectionSubtitle: { fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  activeDungeonName: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  floorStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  floorCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  floorLabel: { fontSize: 8, fontWeight: 'bold' },
  floorValue: { fontSize: 32, fontWeight: '900' },
  floorProgressInfo: { flex: 1, marginLeft: 20 },
  progressTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  progressDesc: { fontSize: 9, marginBottom: 12 },
  progressContainer: { height: 6, width: '100%', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%' },
  progressText: { fontSize: 9, marginTop: 8, fontWeight: 'bold' },
  exitBtn: { padding: 12, borderWidth: 1, alignItems: 'center' },
  exitBtnText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  sectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 20, opacity: 0.7 },
  dungeonCard: { padding: 20, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rankBadge: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  rankText: { fontSize: 14, fontWeight: '900' },
  dungeonName: { fontSize: 14, fontWeight: 'bold', flex: 1 },
  dungeonDesc: { fontSize: 11, lineHeight: 18, marginBottom: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  footerInfo: { fontSize: 9, fontWeight: 'bold' },
  enterBtn: { paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1 },
  enterBtnText: { fontSize: 10, fontWeight: '900' },
  activeIndicator: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  activeText: { fontSize: 9, fontWeight: '900' },
  clearedIndicator: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  clearedText: { fontSize: 9, fontWeight: '900' },
});

export default DungeonScreen;
