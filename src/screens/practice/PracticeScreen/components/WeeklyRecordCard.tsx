import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { styles } from '../PracticeScreen.styles';
import { WEEK_DAYS_MOCK } from '../constants';

interface WeeklyRecordCardProps {
  streakDays: number;
  glassCardStyle: any;
  theme: { text: string; textMuted: string };
}

export const WeeklyRecordCard: React.FC<WeeklyRecordCardProps> = ({ streakDays, glassCardStyle, theme }) => {
  return (
    <View style={[styles.card, glassCardStyle]}>
      <View style={styles.glassShine} pointerEvents="none" />
      <View style={styles.cardHeaderRow}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>이번 주 기록</Text>
        <View style={[styles.streakBadge, { backgroundColor: '#FCF3E6' }]}>
          <Text style={styles.streakBadgeText}>🔥 {streakDays}일 연속</Text>
        </View>
      </View>

      {/* Week Days list */}
      <View style={styles.weekDaysRow}>
        {WEEK_DAYS_MOCK.map((item, idx) => (
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
        ))}
      </View>
    </View>
  );
};

export default WeeklyRecordCard;
