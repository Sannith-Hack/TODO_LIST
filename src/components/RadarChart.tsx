import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getColors, SHADOWS } from '../utils/theme';

interface RadarChartProps {
  data: number[]; // Array of 5 values (0-100)
  labels: string[]; // Array of 5 labels
  theme?: 'dark' | 'light';
}

const { width } = Dimensions.get('window');
const CHART_SIZE = 180;
const CENTER = CHART_SIZE / 2;
const RADIUS = CHART_SIZE * 0.4;

const RadarChart = ({ data, labels, theme = 'dark' }: RadarChartProps) => {
  const colors = getColors(theme);
  const primaryColor = colors.primary;

  // Calculate coordinates for 5 points of a pentagon
  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const r = (value / 100) * RADIUS;
    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    };
  };

  const axes = labels.map((label, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = CENTER + RADIUS * Math.cos(angle);
    const y = CENTER + RADIUS * Math.sin(angle);
    const labelX = CENTER + (RADIUS + 20) * Math.cos(angle);
    const labelY = CENTER + (RADIUS + 20) * Math.sin(angle);
    
    return { x, y, labelX, labelY, label };
  });

  const dataPoints = data.map((val, i) => getPoint(i, val));

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { borderColor: colors.border }]}>
        {/* Axis Lines */}
        {axes.map((axis, i) => (
          <View key={`axis-${i}`} style={[styles.axis, { 
            width: RADIUS,
            left: CENTER,
            top: CENTER,
            backgroundColor: colors.border,
            transform: [
              { rotate: `${(i * 72) - 90}deg` },
              { translateX: RADIUS / 2 }
            ]
          }]} />
        ))}

        {/* Outer Reference Pentagon (Simulated with lines if possible, or just circles) */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
          <View key={`grid-${scale}`} style={[styles.gridCircle, { 
            width: RADIUS * 2 * scale,
            height: RADIUS * 2 * scale,
            borderRadius: RADIUS * scale,
            borderColor: colors.border,
            opacity: 0.2,
            left: CENTER - RADIUS * scale,
            top: CENTER - RADIUS * scale,
          }]} />
        ))}

        {/* Data Points (Glows) */}
        {dataPoints.map((point, i) => (
          <View key={`point-${i}`} style={[
            styles.point, 
            { 
              left: point.x - 4, 
              top: point.y - 4, 
              backgroundColor: primaryColor,
              ...SHADOWS.glowCustom(primaryColor)
            }
          ]} />
        ))}

        {/* Labels */}
        {axes.map((axis, i) => (
          <Text key={`label-${i}`} style={[
            styles.label, 
            { 
              left: axis.labelX - 15, 
              top: axis.labelY - 8,
              color: colors.textDim
            }
          ]}>
            {axis.label}
          </Text>
        ))}
        
        <View style={styles.centerOverlay}>
           <Text style={[styles.centerText, { color: primaryColor }]}>SYSTEM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  chartWrapper: {
    width: CHART_SIZE + 60,
    height: CHART_SIZE + 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  axis: {
    position: 'absolute',
    height: 1,
    opacity: 0.5,
  },
  gridCircle: {
    position: 'absolute',
    borderWidth: 1,
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  label: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '900',
    width: 30,
    textAlign: 'center',
  },
  centerOverlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  centerText: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.5,
  }
});

export default RadarChart;
