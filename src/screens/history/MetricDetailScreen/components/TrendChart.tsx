import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { styles } from '../MetricDetailScreen.styles';

interface TrendChartProps {
  trends: { label: string; val: number }[];
  theme: { text: string; textMuted: string };
}

export const TrendChart: React.FC<TrendChartProps> = ({ trends, theme }) => {
  const renderTrendSvg = () => {
    if (trends.length < 2) return null;

    const width = 280;
    const height = 80;
    const paddingX = 20;
    const paddingY = 15;

    const vals = trends.map(t => t.val);
    const minVal = Math.min(...vals) * 0.95;
    const maxVal = Math.max(...vals) * 1.05;
    const valRange = maxVal - minVal || 1;

    const points = trends.map((t, idx) => {
      const x = paddingX + (idx / (trends.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((t.val - minVal) / valRange) * (height - 2 * paddingY);
      return { x, y };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const areaPathD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
      <View style={styles.chartWrapper}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.0} />
            </LinearGradient>
          </Defs>
          <Path d={areaPathD} fill="url(#chartGrad)" />
          <Path d={pathD} fill="none" stroke={COLORS.primary} strokeWidth={3} />
          {points.map((pt, idx) => (
            <Circle key={idx} cx={pt.x} cy={pt.y} r={4} fill={idx === points.length - 1 ? COLORS.primary : '#ffffff'} stroke={COLORS.primary} strokeWidth={2} />
          ))}
        </Svg>

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
      {renderTrendSvg()}
    </Card>
  );
};

export default TrendChart;
