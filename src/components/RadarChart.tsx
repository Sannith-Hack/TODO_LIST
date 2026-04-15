import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

interface RadarChartProps {
  data: number[];
  labels: string[];
}

const RadarChart = ({ data, labels }: RadarChartProps) => {
  const size = 200;
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 
        Instead of SVG, we use a simple visual representation 
        or a placeholder, as the native library was causing fatal crashes.
        This provides the UI feel without the build risk.
      */}
      <View style={styles.chartPlaceholder}>
          {data.map((val, i) => (
              <View key={i} style={[styles.bar, { height: `${val}%`, transform: [{ rotate: `${i * (360/data.length)}deg` }] }]} />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  chartPlaceholder: { width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  bar: { width: 4, backgroundColor: COLORS.primary, position: 'absolute', bottom: '50%', transformOrigin: 'bottom' }
});

export default RadarChart;
