import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, G } from 'react-native-svg';
import { COLORS } from '../utils/theme';

interface RadarChartProps {
  data: number[]; // Values from 0 to 100
  labels: string[];
}

const RadarChart = ({ data, labels }: RadarChartProps) => {
  const size = 260;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const numPoints = data.length;

  // Points for the grid
  const getPoint = (val: number, i: number, maxRadius: number) => {
    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
    const r = (val / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Helper to generate point string for Polygon
  const getPointsString = (values: number[], maxRadius: number) => {
    return values.map((val, i) => {
      const p = getPoint(val, i, maxRadius);
      return `${p.x},${p.y}`;
    }).join(' ');
  };

  const pointsString = getPointsString(data, radius);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Background Grid - concentric pentagons */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((step, i) => (
            <Polygon
              key={i}
              points={getPointsString(new Array(numPoints).fill(100 * step), radius)}
              fill="transparent"
              stroke={COLORS.primary}
              strokeWidth="0.5"
              opacity={0.3}
            />
          ))}

          {/* Axis lines */}
          {labels.map((_, i) => {
            const p = getPoint(100, i, radius);
            return (
              <Line
                key={i}
                x1={center}
                y1={center}
                x2={p.x}
                y2={p.y}
                stroke={COLORS.primary}
                strokeWidth="1"
                opacity={0.3}
              />
            );
          })}

          {/* Data Polygon */}
          <Polygon
            points={pointsString}
            fill={COLORS.primary + '44'}
            stroke={COLORS.primary}
            strokeWidth="2"
          />

          {/* Labels */}
          {labels.map((label, i) => {
            const p = getPoint(100, i, radius + 20);
            return (
              <SvgText
                key={i}
                x={p.x}
                y={p.y}
                fill={COLORS.primary}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {label.toUpperCase()}
              </SvgText>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

export default RadarChart;
