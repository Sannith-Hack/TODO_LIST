import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, getColors, SHADOWS, SKILL_COLORS, getRankTheme } from '../utils/theme';
import { UserStats, SkillType } from '../utils/types';
import { saveStats, getTitleByLevel } from '../storage/taskStorage';
import RadarChart from '../components/RadarChart';
import { triggerHaptic, playSound, FEEDBACK_SOUNDS } from '../utils/feedback';
import { announce, SYSTEM_VOICE } from '../utils/sovereign';

interface SkillTreeScreenProps {
  onOpenMenu: () => void;
  stats: UserStats | null;
  refreshStats: () => void;
}

const SkillTreeScreen = ({ onOpenMenu, stats, refreshStats }: SkillTreeScreenProps) => {
  const theme = stats?.theme || 'dark';
  const colors = getColors(theme);

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
    announce(`Your ${attr} has increased to ${currentAttributes[attr] + 1}.`, stats);
    await saveStats(newStats);
    refreshStats();
  };

  const handleAssignShadow = async (skill: SkillType, shadowName: string) => {
    if (!stats) return;

    const currentAssignments = stats.shadowAssignments || {};
    
    // If this shadow is already assigned elsewhere, remove it from there
    const updatedAssignments: Partial<Record<SkillType, string>> = { ...currentAssignments };
    Object.keys(updatedAssignments).forEach((key) => {
      if (updatedAssignments[key as SkillType] === shadowName) {
        delete updatedAssignments[key as SkillType];
      }
    });

    // Assign to new skill
    updatedAssignments[skill] = shadowName;
    announce(SYSTEM_VOICE.SHADOW_EXTRACTION(shadowName), stats);

    const newStats: UserStats = {
      ...stats,
      shadowAssignments: updatedAssignments
    };

    triggerHaptic('notificationSuccess');
    Alert.alert('SHADOW ASSIGNED', `${shadowName} is now guarding the ${skill} tree (+20% XP)`);
    await saveStats(newStats);
    refreshStats();
  };

  const showShadowPicker = (skill: SkillType) => {
    if (!stats?.shadowSoldiers || stats.shadowSoldiers.length === 0) {
      Alert.alert('No Shadows', 'You must extract shadows before you can assign them.');
      return;
    }

    const unassignedShadows = stats.shadowSoldiers;

    Alert.alert(
      'ASSIGN SHADOW',
      `Choose a shadow soldier to boost ${skill} XP by 20%:`,
      [
        ...unassignedShadows.map(name => ({
          text: name + (stats.shadowAssignments?.[skill] === name ? ' (CURRENT)' : ''),
          onPress: () => handleAssignShadow(skill, name)
        })),
        { text: 'REMOVE SHADOW', onPress: async () => {
          const updatedAssignments = { ...stats.shadowAssignments };
          delete updatedAssignments[skill];
          await saveStats({ ...stats, shadowAssignments: updatedAssignments });
          refreshStats();
        }, style: 'destructive' },
        { text: 'CANCEL', style: 'cancel' }
      ]
    );
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
  
  const userRank = stats.reputationTitle.split('-')[0] || 'E';
  const rankTheme = getRankTheme(userRank);
  const primaryColor = rankTheme.primary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={[styles.menuLine, { backgroundColor: primaryColor }]} />
          <View style={[styles.menuLine, { width: 15, backgroundColor: primaryColor }]} />
          <View style={[styles.menuLine, { backgroundColor: primaryColor }]} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: primaryColor }]}>STATUS WINDOW</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.reputationHeader}>
          <Text style={[styles.reputationTitle, { color: primaryColor }]}>{stats.reputationTitle}</Text>
          <Text style={[styles.playerName, { color: colors.text }]}>{stats.playerName.toUpperCase()}</Text>
          <View style={[styles.divider, { backgroundColor: primaryColor }]} />
        </View>

        <View style={styles.statusRow}>
            <View style={styles.chartSection}>
            <RadarChart data={chartData} labels={attrLabels} theme={theme} />
            </View>
            <View style={styles.overallStats}>
                <View style={[styles.statCircle, { borderColor: primaryColor, backgroundColor: colors.surface }]}>
                    <Text style={[styles.levelLabel, { color: colors.textDim }]}>LEVEL</Text>
                    <Text style={[styles.levelValue, { color: colors.text }]}>{stats.totalLevel}</Text>
                </View>
                <View style={[styles.streakBadge, { borderColor: colors.accent, backgroundColor: colors.accent + '22' }]}>
                    <Text style={[styles.streakText, { color: colors.accent }]}>🔥 {stats.streakCount || 0} DAY STREAK</Text>
                </View>
            </View>
        </View>

        <View style={[styles.statPointsBadge, { borderColor: primaryColor, backgroundColor: primaryColor + '22' }]}>
            <Text style={[styles.statPointsText, { color: primaryColor }]}>AVAILABLE STAT POINTS: {stats.statPoints}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>ATTRIBUTES</Text>
        <View style={[styles.attributesContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {(Object.keys(attributes) as Array<keyof UserStats['attributes']>).map((attr) => (
                <View key={attr} style={styles.attrRow}>
                    <Text style={[styles.attrLabel, { color: colors.textDim }]}>{attr.toUpperCase()}</Text>
                    <View style={styles.attrValueContainer}>
                        <Text style={[styles.attrValue, { color: primaryColor }]}>{attributes[attr]}</Text>
                        {stats.statPoints > 0 && (
                            <TouchableOpacity onPress={() => handleSpendAttribute(attr)} style={[styles.attrPlusBtn, { backgroundColor: primaryColor }]}>
                                <Text style={[styles.attrPlusText, { color: colors.background }]}>+</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))}
        </View>


        {stats.shadowSoldiers && stats.shadowSoldiers.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>SHADOW ARMY</Text>
            <View style={styles.shadowSoldiersContainer}>
                {stats.shadowSoldiers.map(s => (
                    <View key={s} style={[styles.shadowBadge, { borderColor: primaryColor, backgroundColor: colors.surface }]}>
                        <Text style={[styles.shadowText, { color: primaryColor }]}>{s}</Text>
                    </View>
                ))}
            </View>
          </>
        )}

        {stats.achievements && stats.achievements.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>ACHIEVEMENTS</Text>
            <View style={styles.achievementsContainer}>
                {stats.achievements.map(a => (
                    <View key={a} style={[styles.achievementBadge, { borderColor: colors.success, backgroundColor: colors.surface }]}>
                        <Text style={[styles.achievementText, { color: colors.success }]}>🏆 {a.replace('_', ' ')}</Text>
                    </View>
                ))}
            </View>
          </>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>SKILL TREES</Text>

        {skillOrder.map((skillName) => {
          const skill = stats.skills[skillName];
          const progress = (skill.xp / skill.requiredXp) * 100;
          const color = SKILL_COLORS[skillName];
          const assignedShadow = stats.shadowAssignments?.[skillName];

          return (
            <View key={skillName} style={[styles.skillCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.skillHeader}>
                <View>
                  <Text style={[styles.skillName, { color }]}>{skillName.toUpperCase()}</Text>
                  {assignedShadow && (
                    <View style={styles.assignedShadowRow}>
                      <Text style={[styles.assignedShadowText, { color: primaryColor }]}>✦ {assignedShadow}</Text>
                      <Text style={[styles.boostText, { color: colors.success }]}> +20% XP BOOST</Text>
                    </View>
                  )}
                </View>
                <View style={styles.rankRow}>
                  <TouchableOpacity 
                    onPress={() => showShadowPicker(skillName)}
                    style={[styles.shadowAssignBtn, { borderColor: assignedShadow ? primaryColor : colors.border }]}
                  >
                    <Text style={[styles.shadowAssignBtnText, { color: assignedShadow ? primaryColor : colors.textDim }]}>
                      {assignedShadow ? 'CHANGE SHADOW' : 'ASSIGN SHADOW'}
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.rankBadge, { borderColor: color }]}>
                    <Text style={[styles.rankText, { color }]}>{skill.rank}-RANK</Text>
                  </View>
                  {stats.statPoints > 0 && (
                    <TouchableOpacity onPress={() => handleSpendPoint(skillName)} style={[styles.plusBtn, { backgroundColor: color }]}>
                      <Text style={[styles.plusBtnText, { color: colors.background }]}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.skillInfo}>
                <Text style={[styles.skillLevel, { color: colors.text }]}>Lv. {skill.level}</Text>
                <Text style={[styles.skillXp, { color: colors.textDim }]}>{skill.xp} / {skill.requiredXp} XP</Text>
              </View>
              <View style={[styles.progressBarContainer, { backgroundColor: colors.background }]}>
                <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
              </View>
            </View>
          );
        })}
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
  title: { fontSize: 18, fontWeight: 'bold', letterSpacing: 2, textShadowRadius: 10 },
  scrollContent: { padding: 20 },
  reputationHeader: { alignItems: 'center', marginBottom: 20 },
  reputationTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 4, textShadowRadius: 15 },
  playerName: { fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginTop: 4, opacity: 0.8 },
  divider: { height: 1, width: '60%', marginTop: 8, opacity: 0.5 },
  chartSection: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  overallStats: { alignItems: 'center', marginBottom: 30 },
  statCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  levelLabel: { fontSize: 12, fontWeight: 'bold' },
  levelValue: { fontSize: 42, fontWeight: 'bold' },
  statPointsBadge: { paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1 },
  statPointsText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginBottom: 20, opacity: 0.7 },
  skillCard: { padding: 16, marginBottom: 16, borderWidth: 1 },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center' },
  skillName: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  rankBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  rankText: { fontSize: 10, fontWeight: 'bold' },
  plusBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  plusBtnText: { fontSize: 18, fontWeight: '900', marginTop: -2 },
  skillInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  skillLevel: { fontSize: 14, fontWeight: 'bold' },
  skillXp: { fontSize: 12 },
  progressBarContainer: { height: 6, width: '100%', overflow: 'hidden' },
  progressBar: { height: '100%' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  streakBadge: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderRadius: 20 },
  streakText: { fontSize: 10, fontWeight: 'bold' },
  attributesContainer: { padding: 16, marginBottom: 25, borderWidth: 1 },
  attrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  attrLabel: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  attrValueContainer: { flexDirection: 'row', alignItems: 'center' },
  attrValue: { fontSize: 16, fontWeight: 'bold', marginRight: 15 },
  attrPlusBtn: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  attrPlusText: { fontSize: 16, fontWeight: '900' },
  shadowSoldiersContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 25 },
  shadowBadge: { paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, marginRight: 10, marginBottom: 10 },
  shadowText: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  achievementsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 25 },
  achievementBadge: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  achievementText: { fontSize: 10, fontWeight: 'bold' },
  shadowAssignBtn: { paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, marginRight: 10, borderRadius: 4 },
  shadowAssignBtnText: { fontSize: 8, fontWeight: 'bold' },
  assignedShadowRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  assignedShadowText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  boostText: { fontSize: 9, fontWeight: 'bold' },
});

export default SkillTreeScreen;
