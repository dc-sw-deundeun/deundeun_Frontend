import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
import { VictoryChart, VictoryLine, VictoryArea, VictoryScatter, VictoryAxis } from 'victory-native';
import { styles } from '../MetricDetailScreen.styles';

interface TrendChartProps {
  trends: { label: string; val: number }[];
  theme: { text: string; textMuted: string };
}

export const TrendChart: React.FC<TrendChartProps> = ({ trends, theme }) => {
  const renderTrendChart = () => {
    if (trends.length < 2) return null;

    const chartData = trends.map((t, idx) => ({
      x: idx,
      y: t.val,
    }));

    return (
      <View style={styles.chartWrapper}>
        {/* Defs definition for Area chart gradient */}
        <Svg height={0} width={0} style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.0} />
            </LinearGradient>
          </Defs>
        </Svg>

        <VictoryChart
          height={110}
          padding={{ top: 15, bottom: 10, left: 35, right: 35 }}
          domainPadding={{ x: 25, y: 15 }}
        >
          {/* Hide Axes */}
          <VictoryAxis style={{ axis: { stroke: 'none' }, ticks: { stroke: 'none' }, tickLabels: { fill: 'none' } }} />
          <VictoryAxis dependentAxis style={{ axis: { stroke: 'none' }, ticks: { stroke: 'none' }, tickLabels: { fill: 'none' } }} />

          {/* Area Fill */}
          <VictoryArea
            data={chartData}
            interpolation="natural"
            style={{
              data: {
                fill: 'url(#chartGrad)',
              },
            }}
          />

          {/* Smooth Line */}
          <VictoryLine
            data={chartData}
            interpolation="natural"
            style={{
              data: {
                stroke: COLORS.primary,
                strokeWidth: 3,
              },
            }}
          />

          {/* Points */}
          <VictoryScatter
            data={chartData}
            size={5}
            style={{
              data: {
                fill: ({ index }: any) => (index === chartData.length - 1 ? COLORS.primary : '#ffffff'),
                stroke: COLORS.primary,
                strokeWidth: 2.5,
              },
            }}
          />
        </VictoryChart>

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
