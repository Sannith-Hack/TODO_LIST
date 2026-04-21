import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColors } from '../utils/theme';

interface RadarChartProps {
  data: number[];
  labels: string[];
  theme?: 'dark' | 'light';
}

const RadarChart = ({ data, labels, theme = 'dark' }: RadarChartProps) => {
  const colors = getColors(theme);

  return (
    <View style={styles.container}>
      <View style={[styles.placeholder, { borderColor: colors.primary, backgroundColor: colors.surface }]}>
        <Text style={[styles.text, { color: colors.primary }]}>SYSTEM CHART ACTIVE</Text>
        <Text style={[styles.subtext, { color: colors.textDim }]}>STABILITY MODE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 8,
    marginTop: 4,
  }
});

export default RadarChart;
