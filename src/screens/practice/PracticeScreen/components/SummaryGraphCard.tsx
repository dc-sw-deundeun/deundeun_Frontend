import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import Text from '@/components/Text';
import { styles } from '../PracticeScreen.styles';
import { WeeklyStatisticsResponse, MissionSummaryResponse } from '@/api/mission';

interface SummaryGraphCardProps {
  weeklyStats: WeeklyStatisticsResponse | null;
  summaryStats: MissionSummaryResponse | null;
  glassCardStyle: any;
  theme: any;
}

export const SummaryGraphCard: React.FC<SummaryGraphCardProps> = ({ summaryStats, glassCardStyle, theme }) => {
  const completionRate = summaryStats?.completion_rate
    ? Math.round(summaryStats.completion_rate * 100)
    : 0;

  return (
    <View style={[styles.card, glassCardStyle, { paddingBottom: 24 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>총 미션 성취율</Text>
        {/* Verification UI for User */}
        {summaryStats && (
          <View style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: 6, borderRadius: 8, marginLeft: 'auto' }}>
            <Text style={{ fontSize: 9, color: theme.textMuted }}>전체미션 : {summaryStats.total_assigned}</Text>
            <Text style={{ fontSize: 9, color: theme.textMuted }}>완료: {summaryStats.total_completed}</Text>
          </View>
        )}
      </View>

      <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: theme.text }}>{completionRate}%</Text>
      </View>

      {/* Progress Bar Graph */}
      <View style={{ marginTop: 24, height: 28, width: '100%' }}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#A6C89B" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#5B744C" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Background Track */}
          <Rect width="100%" height="100%" fill="#EAEAEA" rx="14" ry="14" />
          {/* Progress Fill */}
          <Rect width={`${completionRate}%`} height="100%" fill="url(#progressGrad)" rx="14" ry="14" />
        </Svg>
      </View>

    </View>
  );
};
export default SummaryGraphCard;
