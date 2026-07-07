import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { Calendar } from 'lucide-react-native';
import { styles } from '../PracticeScreen.styles';
import { CALENDAR_DAY_LABELS, DAY_DETAIL_MISSIONS_MOCK } from '../constants';
import { CalendarDayCell } from './CalendarDayCell';

interface MonthlyCalendarCardProps {
  glassCardStyle: any;
  theme: { text: string; textMuted: string; border: string };
  selectedMonth: '2024년 5월' | '2024년 4월';
  selectedDayDetail: { day: number; month: string } | null;
  monthData: { offset: number; days: number; counts: Record<number, number> };
  getMonthData: () => { offset: number; days: number; counts: Record<number, number> };
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayPress: (day: number) => void;
  onCloseDayDetail: () => void;
}

export const MonthlyCalendarCard: React.FC<MonthlyCalendarCardProps> = ({
  glassCardStyle,
  theme,
  selectedMonth,
  selectedDayDetail,
  monthData,
  getMonthData,
  onPrevMonth,
  onNextMonth,
  onDayPress,
  onCloseDayDetail,
}) => {
  return (
    <View style={[styles.card, glassCardStyle]}>
      <View style={styles.glassShine} pointerEvents="none" />
      <View style={[styles.cardHeaderRow, { marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Calendar color={theme.text} size={20} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>월간 활동 현황</Text>
        </View>

        {/* Month Switcher Controls */}
        <View style={styles.monthSwitcher}>
          <TouchableOpacity onPress={onPrevMonth} style={styles.monthArrow}>
            <Text style={[styles.monthArrowText, { color: theme.textMuted }]}>◀</Text>
          </TouchableOpacity>
          <Text style={[styles.calendarMonthText, { color: theme.text }]}>{selectedMonth}</Text>
          <TouchableOpacity onPress={onNextMonth} style={styles.monthArrow}>
            <Text style={[styles.monthArrowText, { color: theme.textMuted }]}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {/* Day Labels */}
        {CALENDAR_DAY_LABELS.map((label, idx) => (
          <View key={`label-${idx}`} style={styles.calendarDayLabelCell}>
            <Text style={[styles.calendarDayLabelText, { color: theme.textMuted }]}>{label}</Text>
          </View>
        ))}

        {/* Offset Days */}
        {Array.from({ length: monthData.offset }).map((_, idx) => (
          <View key={`empty-${idx}`} style={styles.calendarCellEmpty} />
        ))}

        {/* Month Days with Hover & Floating animation */}
        {Array.from({ length: monthData.days }, (_, i) => i + 1).map((day) => {
          const completedCount = monthData.counts[day] || 0;
          const isSelected = selectedDayDetail?.day === day && selectedDayDetail?.month === selectedMonth;

          return (
            <CalendarDayCell
              key={`day-${day}`}
              day={day}
              completedCount={completedCount}
              isSelected={isSelected}
              theme={theme}
              onPress={onDayPress}
            />
          );
        })}
      </View>

      {/* Inline Practice Record Section inside the same Card */}
      {selectedDayDetail && (
        <View style={{ marginTop: 20 }}>
          {/* Subtle top border divider */}
          <View style={[styles.modalDivider, { backgroundColor: theme.border, marginBottom: 12, marginTop: 8 }]} />

          <View style={styles.inlineHeaderRow}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {selectedDayDetail.month} {selectedDayDetail.day}일 실천 기록
            </Text>
            <TouchableOpacity onPress={onCloseDayDetail}>
              <Text style={{ color: COLORS.error, fontSize: 13, fontWeight: '800' }}>닫기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inlineMissionList}>
            {DAY_DETAIL_MISSIONS_MOCK.map((m, idx) => {
              const dayCompletedCount = selectedMonth === '2024년 5월' ? (getMonthData().counts[selectedDayDetail.day] || 0) : (getMonthData().counts[selectedDayDetail.day] || 0);
              const isCompleted = idx < dayCompletedCount;

              return (
                <View key={m.id}>
                  <View style={styles.dayDetailMissionRow}>
                    <View style={styles.dayDetailMissionLeft}>
                      <View style={[styles.modalIconWrapper, { backgroundColor: isCompleted ? '#E4F2E6' : '#EDEBE1' }]}>
                        <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                      </View>
                      <View style={styles.modalTextGroup}>
                        <Text style={[styles.modalOptionTitle, { color: theme.text }, !isCompleted && { opacity: 0.7 }]}>
                          {m.title}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.dayDetailBadge, isCompleted ? { backgroundColor: '#E4F2E6' } : { backgroundColor: '#FBEBEA' }]}>
                      <Text style={[styles.dayDetailBadgeText, { color: isCompleted ? '#5B744C' : '#B3463B' }]}>
                        {isCompleted ? '완료' : '미완료'}
                      </Text>
                    </View>
                  </View>
                  {idx < 2 && <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />}
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default MonthlyCalendarCard;
