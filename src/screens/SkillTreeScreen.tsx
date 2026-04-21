import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS } from '../utils/theme';
import { UserStats, SkillType } from '../utils/types';
import { saveStats, getTitleByLevel } from '../storage/taskStorage';
import RadarChart from '../components/RadarChart';
import { triggerHaptic, playSound, FEEDBACK_SOUNDS } from '../utils/feedback';

interface SkillTreeScreenProps {
  onOpenMenu: () => void;
  stats: UserStats | null;
  refreshStats: () => void;
}

const SkillTreeScreen = ({ onOpenMenu, stats, refreshStats }: SkillTreeScreenProps) => {

  const handleSpendPoint = async (skillName: SkillType) => {
    if (!stats || stats.statPoints <= 0) {
      Alert.alert('Insufficient Points', 'You have no available Stat Points to distribute.');
      triggerHaptic('notificationError');
      return;
    }
    const skill = stats.skills[skillName];
    const xpGain = 50;
    let newXp = skill.xp + xpGain;
    let newLevel = skill.level;
    let newReqXp = skill.requiredXp;
    let newRank = skill.rank;
    let totalLevelGain = 0;
    while (newXp >= newReqXp) {
      newXp -= newReqXp;
      newLevel++;
      totalLevelGain++;
      newReqXp = Math.floor(newReqXp * 1.5);
      if (newLevel >= 50) newRank = 'S';
      else if (newLevel >= 40) newRank = 'A';
      else if (newLevel >= 30) newRank = 'B';
      else if (newLevel >= 20) newRank = 'C';
      else if (newLevel >= 10) newRank = 'D';
    }
    
    const finalLevel = stats.totalLevel + totalLevelGain;
    const newStats: UserStats = {
      ...stats,
      statPoints: stats.statPoints - 1,
      totalLevel: finalLevel,
      reputationTitle: getTitleByLevel(finalLevel),
      skills: {
        ...stats.skills,
        [skillName]: { ...skill, level: newLevel, xp: newXp, requiredXp: newReqXp, rank: newRank, }
      }
    };

    if (totalLevelGain > 0) {
      triggerHaptic('impactHeavy');
      playSound(FEEDBACK_SOUNDS.LEVEL_UP);
    } else {
      triggerHaptic('impactMedium');
    }

    await saveStats(newStats);
    refreshStats();
  };

  const handleSpendAttribute = async (attr: keyof UserStats['attributes']) => {
    if (!stats || stats.statPoints <= 0) {
      Alert.alert('Insufficient Points', 'You have no available Stat Points.');
      triggerHaptic('notificationError');
      return;
    }

    const currentAttributes = stats.attributes || {
      strength: 10,
      agility: 10,
      intelligence: 10,
      sense: 10,
      vitality: 10,
    };

    const newStats: UserStats = {
      ...stats,
      statPoints: stats.statPoints - 1,
      attributes: {
        ...currentAttributes,
        [attr]: currentAttributes[attr] + 1
      }
    };

    triggerHaptic('impactMedium');
    await saveStats(newStats);
    refreshStats();
  };

  if (!stats) return null;

  const skillOrder: SkillType[] = ['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'];
  
  const attributes = stats.attributes || {
    strength: 10,
    agility: 10,
    intelligence: 10,
    sense: 10,
    vitality: 10,
  };

  const chartData = [
    attributes.strength,
    attributes.agility,
    attributes.intelligence,
    attributes.sense,
    attributes.vitality
  ].map(v => Math.min(v * 2, 100));
  const attrLabels = ['STR', 'AGI', 'INT', 'SEN', 'VIT'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 15 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.title}>STATUS WINDOW</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.reputationHeader}>
          <Text style={styles.reputationTitle}>{stats.reputationTitle}</Text>
          <Text style={styles.playerName}>{stats.playerName.toUpperCase()}</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.statusRow}>
            <View style={styles.chartSection}>
            <RadarChart data={chartData} labels={attrLabels} />
            </View>
            <View style={styles.overallStats}>
                <View style={styles.statCircle}>
                    <Text style={styles.levelLabel}>LEVEL</Text>
                    <Text style={styles.levelValue}>{stats.totalLevel}</Text>
                </View>
                <View style={styles.streakBadge}>
                    <Text style={styles.streakText}>🔥 {stats.streakCount || 0} DAY STREAK</Text>
                </View>
            </View>
        </View>

        <View style={styles.statPointsBadge}>
            <Text style={styles.statPointsText}>AVAILABLE STAT POINTS: {stats.statPoints}</Text>
        </View>

        <Text style={styles.sectionTitle}>ATTRIBUTES</Text>
        <View style={styles.attributesContainer}>
            {(Object.keys(attributes) as Array<keyof UserStats['attributes']>).map((attr) => (
                <View key={attr} style={styles.attrRow}>
                    <Text style={styles.attrLabel}>{attr.toUpperCase()}</Text>
                    <View style={styles.attrValueContainer}>
                        <Text style={styles.attrValue}>{attributes[attr]}</Text>
                        {stats.statPoints > 0 && (
                            <TouchableOpacity onPress={() => handleSpendAttribute(attr)} style={styles.attrPlusBtn}>
                                <Text style={styles.attrPlusText}>+</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))}
        </View>


        {stats.shadowSoldiers && stats.shadowSoldiers.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>SHADOW ARMY</Text>
            <View style={styles.shadowSoldiersContainer}>
                {stats.shadowSoldiers.map(s => (
                    <View key={s} style={styles.shadowBadge}>
                        <Text style={styles.shadowText}>{s}</Text>
                    </View>
                ))}
            </View>
          </>
        )}

        {stats.achievements && stats.achievements.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
            <View style={styles.achievementsContainer}>
                {stats.achievements.map(a => (
                    <View key={a} style={styles.achievementBadge}>
                        <Text style={styles.achievementText}>🏆 {a.replace('_', ' ')}</Text>
                    </View>
                ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>SKILL TREES</Text>

        {skillOrder.map((skillName) => {
          const skill = stats.skills[skillName];
          const progress = (skill.xp / skill.requiredXp) * 100;
          const color = SKILL_COLORS[skillName];

          return (
            <View key={skillName} style={styles.skillCard}>
              <View style={styles.skillHeader}>
                <Text style={[styles.skillName, { color }]}>{skillName.toUpperCase()}</Text>
                <View style={styles.rankRow}>
                  <View style={[styles.rankBadge, { borderColor: color }]}>
                    <Text style={[styles.rankText, { color }]}>{skill.rank}-RANK</Text>
                  </View>
                  {stats.statPoints > 0 && (
                    <TouchableOpacity onPress={() => handleSpendPoint(skillName)} style={[styles.plusBtn, { backgroundColor: color }]}>
                      <Text style={styles.plusBtnText}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.skillInfo}>
                <Text style={styles.skillLevel}>Lv. {skill.level}</Text>
                <Text style={styles.skillXp}>{skill.xp} / {skill.requiredXp} XP</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }, SHADOWS.glowCustom(color)]} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuLine: { height: 2, width: 25, backgroundColor: COLORS.primary, marginBottom: 5, ...SHADOWS.glow },
  headerRightPlaceholder: { width: 40 },
  title: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold', letterSpacing: 2, textShadowColor: COLORS.primary, textShadowRadius: 10 },
  scrollContent: { padding: 20 },
  reputationHeader: { alignItems: 'center', marginBottom: 20 },
  reputationTitle: { color: COLORS.primary, fontSize: 24, fontWeight: '900', letterSpacing: 4, textShadowColor: COLORS.primary, textShadowRadius: 15 },
  playerName: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginTop: 4, opacity: 0.8 },
  divider: { height: 1, backgroundColor: COLORS.primary, width: '60%', marginTop: 8, opacity: 0.5 },
  chartSection: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  overallStats: { alignItems: 'center', marginBottom: 30 },
  statCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, ...SHADOWS.glow, marginBottom: 15 },
  levelLabel: { color: COLORS.textDim, fontSize: 12, fontWeight: 'bold' },
  levelValue: { color: COLORS.text, fontSize: 42, fontWeight: 'bold' },
  statPointsBadge: { backgroundColor: COLORS.primary + '22', paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary, ...SHADOWS.glow },
  statPointsText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  sectionTitle: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginBottom: 20, opacity: 0.7 },
  skillCard: { backgroundColor: COLORS.surface, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center' },
  skillName: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  rankBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  rankText: { fontSize: 10, fontWeight: 'bold' },
  plusBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', ...SHADOWS.glow },
  plusBtnText: { color: COLORS.background, fontSize: 18, fontWeight: '900', marginTop: -2 },
  skillInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  skillLevel: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  skillXp: { color: COLORS.textDim, fontSize: 12 },
  progressBarContainer: { height: 6, backgroundColor: COLORS.background, width: '100%', overflow: 'hidden' },
  progressBar: { height: '100%' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  streakBadge: { backgroundColor: COLORS.accent + '22', paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.accent, borderRadius: 20 },
  streakText: { color: COLORS.accent, fontSize: 10, fontWeight: 'bold' },
  attributesContainer: { backgroundColor: COLORS.surface, padding: 16, marginBottom: 25, borderWidth: 1, borderColor: COLORS.border },
  attrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  attrLabel: { color: COLORS.textDim, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  attrValueContainer: { flexDirection: 'row', alignItems: 'center' },
  attrValue: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', marginRight: 15 },
  attrPlusBtn: { width: 22, height: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  attrPlusText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
  shadowSoldiersContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 25 },
  shadowBadge: { backgroundColor: '#111', paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary, marginRight: 10, marginBottom: 10, ...SHADOWS.glowCustom(COLORS.primary) },
  shadowText: { color: COLORS.primary, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  achievementsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 25 },
  achievementBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.success, marginRight: 8, marginBottom: 8 },
  achievementText: { color: COLORS.success, fontSize: 10, fontWeight: 'bold' },
});

export default SkillTreeScreen;
