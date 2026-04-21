import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { getColors } from '../utils/theme';
import { loadHistory } from '../storage/taskStorage';
import { HistoryEntry, UserStats } from '../utils/types';
import { Svg, Path } from 'react-native-svg';

interface HunterReportScreenProps {
  onOpenMenu: () => void;
  stats: UserStats | null;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_HEIGHT = 200;
const CHART_PADDING = 20;

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

    return last30Days.map(date => {
      const dayTasks = history.filter(h => {
        try {
            const hDate = new Date(h.completedAt).toISOString().split('T')[0];
            return hDate === date;
        } catch (e) {
            return false;
        }
      });
      return dayTasks.length * 10; 
    });
  };

  const xpData = getXPData();
  const totalXP30 = xpData.reduce((a, b) => a + b, 0);
  const maxXP = Math.max(...xpData, 50);

  const chartWidth = SCREEN_WIDTH - 60;
  const points = xpData.map((val, i) => {
    const x = (i / (xpData.length - 1)) * (chartWidth - CHART_PADDING * 2) + CHART_PADDING;
    const y = CHART_HEIGHT - ((val / maxXP) * (CHART_HEIGHT - CHART_PADDING * 2) + CHART_PADDING);
    return { x, y };
  });

  const d = points.reduce((path, point, i) => {
    return i === 0 ? `M ${point.x},${point.y}` : `${path} L ${point.x},${point.y}`;
  }, '');

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
            <View style={{ height: CHART_HEIGHT, width: chartWidth }}>
                <Svg height={CHART_HEIGHT} width={chartWidth}>
                    <Path
                        d={d}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
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
  chartContainer: { borderWidth: 1, padding: 10, marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
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
