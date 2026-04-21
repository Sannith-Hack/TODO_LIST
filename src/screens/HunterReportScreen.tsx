import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { COLORS, getColors, SHADOWS } from '../utils/theme';
import { loadHistory, loadStats } from '../storage/taskStorage';
import { HistoryEntry, UserStats } from '../utils/types';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

interface HunterReportScreenProps {
  onOpenMenu: () => void;
  stats: UserStats | null;
}

const HunterReportScreen = ({ onOpenMenu, stats }: HunterReportScreenProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const theme = stats?.theme || 'dark';
  const colors = getColors(theme);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await loadHistory();
      setHistory(data);
    };
    fetchHistory();
  }, []);

  const getXPData = () => {
    const last30Days = [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });

    const dailyXP = last30Days.map(date => {
      const dayTasks = history.filter(h => new Date(h.completedAt).toISOString().split('T')[0] === date);
      return dayTasks.length * 10; // Assuming 10 XP per task for simplicity in report
    });

    return dailyXP;
  };

  const xpData = getXPData();
  const validXPData = xpData && xpData.length > 0 ? xpData : [0, 0, 0];
  const totalXP30 = xpData.reduce((a, b) => a + b, 0);
  const maxXP = Math.max(...xpData, 50);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { width: 15, backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>HUNTER'S REPORT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textDim }]}>TOTAL XP (LAST 30 DAYS)</Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>{totalXP30} XP</Text>
          <View style={[styles.rankBadge, { borderColor: colors.success }]}>
            <Text style={[styles.rankBadgeText, { color: colors.success }]}>OPERATIONAL STATUS: ACTIVE</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>GROWTH ANALYTICS</Text>
        <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ height: 200, flexDirection: 'row', padding: 10 }}>
                <YAxis
                    data={validXPData}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ fill: colors.textDim, fontSize: 10 }}
                    numberOfTicks={5}
                    formatLabel={(value) => `${value}XP`}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={validXPData}
                        svg={{ stroke: colors.primary, strokeWidth: 2 }}
                        contentInset={{ top: 20, bottom: 20 }}
                        curve={shape.curveMonotoneX}
                    >
                        <Grid svg={{ stroke: colors.border }} />
                    </LineChart>
                </View>
            </View>
            <Text style={[styles.chartLabel, { color: colors.textDim }]}>XP GAIN OVER THE LAST 30 DAYS</Text>
        </View>

        <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statBoxLabel, { color: colors.textDim }]}>PEAK GROWTH</Text>
                <Text style={[styles.statBoxValue, { color: colors.success }]}>{maxXP} XP</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statBoxLabel, { color: colors.textDim }]}>AVG DAILY</Text>
                <Text style={[styles.statBoxValue, { color: colors.primary }]}>{Math.round(totalXP30/30)} XP</Text>
            </View>
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.primary + '11', borderColor: colors.primary }]}>
            <Text style={[styles.infoTitle, { color: colors.primary }]}>SYSTEM EVALUATION</Text>
            <Text style={[styles.infoBody, { color: colors.text }]}>
                Player progression is consistent with System requirements. Continue daily protocols to maintain rank trajectory. 
                Any dip in growth will trigger re-evaluation of current Rank status.
            </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuLine: { height: 2, width: 25, marginBottom: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  scrollContent: { padding: 20 },
  summaryCard: { padding: 25, borderWidth: 1, marginBottom: 25, alignItems: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  summaryValue: { fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  rankBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4 },
  rankBadgeText: { fontSize: 9, fontWeight: 'bold' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, opacity: 0.8 },
  chartContainer: { borderWidth: 1, padding: 10, marginBottom: 20 },
  chartLabel: { fontSize: 9, textAlign: 'center', marginTop: 10, fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { flex: 1, padding: 15, borderWidth: 1, marginHorizontal: 5, alignItems: 'center' },
  statBoxLabel: { fontSize: 8, fontWeight: '900', marginBottom: 5 },
  statBoxValue: { fontSize: 18, fontWeight: 'bold' },
  infoSection: { padding: 20, borderWidth: 1, borderLeftWidth: 4 },
  infoTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  infoBody: { fontSize: 11, lineHeight: 16, opacity: 0.9 }
});

export default HunterReportScreen;
