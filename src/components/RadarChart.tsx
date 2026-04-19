import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

interface RadarChartProps {
  data: number[];
  labels: string[];
}

const RadarChart = ({ data, labels }: RadarChartProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.text}>SYSTEM CHART ACTIVE</Text>
        <Text style={styles.subtext}>STABILITY MODE</Text>
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
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  text: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtext: {
    color: COLORS.textDim,
    fontSize: 8,
    marginTop: 4,
  }
});

export default RadarChart;
