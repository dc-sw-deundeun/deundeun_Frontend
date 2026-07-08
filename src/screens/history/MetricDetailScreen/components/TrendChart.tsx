import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { styles } from '../MetricDetailScreen.styles';

interface TrendChartProps {
  trends: { label: string; val: number }[];
  theme: { text: string; textMuted: string };
}

export const TrendChart: React.FC<TrendChartProps> = ({ trends, theme }) => {
  const [svgWidth, setSvgWidth] = React.useState(0);

  const renderTrendChart = () => {
    if (trends.length < 2) return null;

    const maxVal = Math.max(...trends.map((t) => t.val));
    const minVal = Math.min(...trends.map((t) => t.val));
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const paddingTop = 15;
    const paddingBottom = 15;
    const paddingLeft = 35;
    const paddingRight = 35;
    const height = 110;

    const points = trends.map((t, idx) => {
      const x = paddingLeft + (idx / (trends.length - 1)) * (svgWidth - paddingLeft - paddingRight);
      // Invert Y axis: higher value = lower Y coordinate
      const y = paddingTop + ((maxVal - t.val) / range) * (height - paddingTop - paddingBottom);
      return { x, y };
    });

    // Generate smooth curve path
    const getSmoothPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return '';
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const curr = pts[i];
        const next = pts[i + 1];
        const cpX = (curr.x + next.x) / 2;
        d += ` C ${cpX},${curr.y} ${cpX},${next.y} ${next.x},${next.y}`;
      }
      return d;
    };

    const linePath = getSmoothPath(points);
    // Area path: start from bottom-left, draw line, go to bottom-right, close
    const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

    return (
      <View 
        style={styles.chartWrapper} 
        onLayout={(e) => setSvgWidth(e.nativeEvent.layout.width)}
      >
        {svgWidth > 0 && (
          <Svg height={height} width="100%">
            <Defs>
              <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} />
                <Stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.0} />
              </LinearGradient>
            </Defs>

            {/* Area Fill */}
            <Path d={areaPath} fill="url(#chartGrad)" />

            {/* Smooth Line */}
            <Path d={linePath} fill="none" stroke={COLORS.primary} strokeWidth={3} />

            {/* Points */}
            {points.map((pt, idx) => (
              <Circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={5}
                fill={idx === points.length - 1 ? COLORS.primary : '#ffffff'}
                stroke={COLORS.primary}
                strokeWidth={2.5}
              />
            ))}
          </Svg>
        )}

        <View style={styles.chartLabels}>
          {trends.map((t, idx) => (
            <View key={idx} style={styles.labelCol}>
              <Text style={[styles.chartValText, { color: theme.text }]}>{t.val}</Text>
              <Text style={[styles.chartDateText, { color: theme.textMuted }]}>{t.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.glassCard}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>최근 추이</Text>
      {renderTrendChart()}
    </Card>
  );
};

export default TrendChart;
