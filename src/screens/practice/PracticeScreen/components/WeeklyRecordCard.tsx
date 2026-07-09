import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { styles } from '../PracticeScreen.styles';
import { WeeklyStatisticsResponse } from '@/api/mission';

interface WeeklyRecordCardProps {
  weeklyStats: WeeklyStatisticsResponse | null;
  summaryStats: any | null; // MissionSummaryResponse
  glassCardStyle: any;
  theme: { text: string; textMuted: string };
}

export const WeeklyRecordCard: React.FC<WeeklyRecordCardProps> = ({ weeklyStats, summaryStats, glassCardStyle, theme }) => {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // map weeklyStats.days to a format suitable for rendering
  const renderDays = weeklyStats?.days?.map((d) => {
    const dateObj = new Date(d.date);
    const dayName = dayNames[dateObj.getDay()];
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = d.date === todayStr;
    const isActive = d.completed > 0 && d.completed === d.total;

    return {
      day: dayName,
      active: isActive,
      today: isToday,
    };
  }) || [];

  return (
    <View style={[styles.card, glassCardStyle]}>
      <View style={styles.glassShine} pointerEvents="none" />
      <View style={styles.cardHeaderRow}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>이번 주 기록</Text>
        <View style={[styles.streakBadge, { backgroundColor: '#FCF3E6' }]}>
          <Text style={styles.streakBadgeText}>🔥 누적 {summaryStats?.total_completed || 0}번 달성</Text>
        </View>
      </View>

      {/* Week Days list */}
      <View style={styles.weekDaysRow}>
        {renderDays.length > 0 ? renderDays.map((item, idx) => (
          <View key={idx} style={styles.weekDayCell}>
            <Text style={[styles.weekDayLabel, { color: theme.textMuted }]}>{item.day}</Text>
            <View
              style={[
                styles.weekDateSquare,
                item.today
                  ? { borderWidth: 2, borderColor: '#5B744C', backgroundColor: 'transparent' }
                  : item.active
                  ? { backgroundColor: '#5B744C' }
                  : { backgroundColor: '#EDEBE1' }
              ]}
            >
              {item.active && !item.today ? (
                <Check color="#ffffff" size={16} strokeWidth={3} />
              ) : item.today ? (
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#5B744C' }}>오늘</Text>
              ) : null}
            </View>
          </View>
        )) : (
          <Text style={{ color: theme.textMuted, paddingVertical: 10 }}>이번 주 기록이 없습니다.</Text>
        )}
      </View>
    </View>
  );
};

export default WeeklyRecordCard;
