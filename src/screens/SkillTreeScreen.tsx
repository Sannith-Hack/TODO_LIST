import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS } from '../utils/theme';
import { UserStats, SkillType } from '../utils/types';
import { loadStats } from '../storage/taskStorage';

const SkillTreeScreen = ({ onBack }: { onBack: () => void }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await loadStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{'< QUEST LOG'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>STATUS WINDOW</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.overallStats}>
          <View style={styles.statCircle}>
            <Text style={styles.levelLabel}>LEVEL</Text>
            <Text style={styles.levelValue}>{stats.totalLevel}</Text>
          </View>
          <View style={styles.totalXpBar}>
            <Text style={styles.xpText}>TOTAL XP: {stats.totalXp}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>SKILL TREES</Text>

        {(Object.keys(stats.skills) as SkillType[]).map((skillName) => {
          const skill = stats.skills[skillName];
          const progress = (skill.xp / skill.requiredXp) * 100;
          const color = SKILL_COLORS[skillName];

          return (
            <View key={skillName} style={styles.skillCard}>
              <View style={styles.skillHeader}>
                <Text style={[styles.skillName, { color }]}>{skillName.toUpperCase()}</Text>
                <View style={[styles.rankBadge, { borderColor: color }]}>
                  <Text style={[styles.rankText, { color }]}>{skill.rank}-RANK</Text>
                </View>
              </View>

              <View style={styles.skillInfo}>
                <Text style={styles.skillLevel}>Lv. {skill.level}</Text>
                <Text style={styles.skillXp}>{skill.xp} / {skill.requiredXp} XP</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${progress}%`, backgroundColor: color },
                    SHADOWS.glowCustom(color)
                  ]} 
                />
              </View>
            </View>
          );
        })}
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
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
  },
  backBtnText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
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
  overallStats: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.glow,
    marginBottom: 15,
  },
  levelLabel: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: 'bold',
  },
  levelValue: {
    color: COLORS.text,
    fontSize: 42,
    fontWeight: 'bold',
  },
  totalXpBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  xpText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 20,
    opacity: 0.7,
  },
  skillCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  rankBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rankText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  skillInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  skillLevel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  skillXp: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.background,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

export default SkillTreeScreen;
