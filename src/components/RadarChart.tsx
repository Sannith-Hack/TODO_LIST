import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getColors, SHADOWS } from '../utils/theme';

interface RadarChartProps {
  data: number[]; // Array of 5 values (0-100)
  labels: string[]; // Array of 5 labels
  theme?: 'dark' | 'light';
}

const CONTAINER_SIZE = 220;
const CENTER = CONTAINER_SIZE / 2;
const RADIUS = 70; // Fixed radius for the outer ring

const RadarChart = ({ data, labels, theme = 'dark' }: RadarChartProps) => {
  const colors = getColors(theme);
  const primaryColor = colors.primary;

  // Calculate coordinates for 5 points of a pentagon
  const getPoint = (index: number, value: number, radius: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const r = (Math.max(5, value) / 100) * radius;
    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    };
  };

  const dataPoints = data.map((val, i) => getPoint(i, val, RADIUS));

  // Helper to draw lines between points
  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < dataPoints.length; i++) {
      const p1 = dataPoints[i];
      const p2 = dataPoints[(i + 1) % dataPoints.length];
      
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      lines.push(
        <View 
          key={`line-${i}`} 
          style={[
            styles.connectingLine, 
            { 
              width: length, 
              left: p1.x, 
              top: p1.y, 
              backgroundColor: primaryColor,
              transform: [
                { rotate: `${angle}rad` },
                { translateX: length / 2 }
              ],
              ...SHADOWS.glowCustom(primaryColor)
            }
          ]} 
        />
      );
    }
    return lines;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { backgroundColor: colors.surface + '22' }]}>
        {/* Outer Reference Rings */}
        {[0.25, 0.5, 0.75, 1.0].map((scale) => (
          <View key={`grid-${scale}`} style={[styles.gridCircle, { 
            width: RADIUS * 2 * scale,
            height: RADIUS * 2 * scale,
            borderRadius: RADIUS * scale,
            borderColor: colors.border,
            left: CENTER - RADIUS * scale,
            top: CENTER - RADIUS * scale,
          }]} />
        ))}

        {/* Axis Lines - Spoking from center */}
        {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 72) - 90;
            return (
                <View key={`axis-${i}`} style={[styles.axis, { 
                    width: RADIUS,
                    left: CENTER,
                    top: CENTER,
                    backgroundColor: colors.border,
                    transform: [
                        { rotate: `${angle}deg` },
                        { translateX: RADIUS / 2 }
                    ]
                }]} />
            );
        })}

        {/* The Actual Stats Polygon */}
        {renderLines()}

        {/* Data Points (Vertices) */}
        {dataPoints.map((point, i) => (
          <View key={`point-${i}`} style={[
            styles.point, 
            { 
              left: point.x - 3, 
              top: point.y - 3, 
              backgroundColor: primaryColor,
              ...SHADOWS.glowCustom(primaryColor)
            }
          ]} />
        ))}

        {/* Labels - Positioned mathematically outside the radius */}
        {labels.map((label, i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const lx = CENTER + (RADIUS + 25) * Math.cos(angle);
            const ly = CENTER + (RADIUS + 15) * Math.sin(angle);
            return (
                <Text key={`label-${i}`} style={[
                    styles.label, 
                    { 
                        left: lx - 20, 
                        top: ly - 8,
                        color: colors.textDim
                    }
                ]}>
                    {label}
                </Text>
            );
        })}
        
        <View style={styles.centerOverlay}>
           <Text style={[styles.centerText, { color: primaryColor }]}>SYSTEM</Text>
           <Text style={[styles.centerVal, { color: colors.text }]}>{Math.max(...data)}%</Text>
        </View>
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
  chartWrapper: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: CONTAINER_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  axis: {
    position: 'absolute',
    height: 1,
    opacity: 0.2,
  },
  gridCircle: {
    position: 'absolute',
    borderWidth: 1,
    opacity: 0.1,
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    zIndex: 5,
  },
  point: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 10,
  },
  label: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '900',
    width: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.5,
  },
  centerVal: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  }
});

export default RadarChart;
