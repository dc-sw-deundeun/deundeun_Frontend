import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { Calendar } from 'lucide-react-native';
import { styles } from '../PracticeScreen.styles';
import { CALENDAR_DAY_LABELS } from '../constants';
import { CalendarDayCell } from './CalendarDayCell';
import { getMissionIcon } from '@/utils/missionIcon';
import { DailyMission } from '../types';

interface MonthlyCalendarCardProps {
  glassCardStyle: any;
  theme: { text: string; textMuted: string; border: string };
  selectedMonthString: string;
  selectedDayDetail: { day: number; year: number; month: number } | null;
  selectedDayMissions: DailyMission[];
  loadingDayMissions: boolean;
  monthData: { offset: number; days: number; levels: Record<number, number> };
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onDayPress: (day: number) => void;
  onCloseDayDetail: () => void;
}

export const MonthlyCalendarCard: React.FC<MonthlyCalendarCardProps> = ({
  glassCardStyle,
  theme,
  selectedMonthString,
  selectedDayDetail,
  selectedDayMissions,
  loadingDayMissions,
  monthData,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onDayPress,
  onCloseDayDetail,
}) => {
  return (
    <View style={[styles.card, glassCardStyle]}>
      <View style={styles.glassShine} pointerEvents="none" />
      <View style={[styles.cardHeaderRow, { marginBottom: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Calendar color={theme.text} size={20} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>월간 활동 현황</Text>
          <TouchableOpacity onPress={onGoToToday} style={{ marginLeft: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#E4F2E6', borderRadius: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#5B744C' }}>오늘</Text>
          </TouchableOpacity>
        </View>

        {/* Month Switcher Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.monthSwitcher}>
            <TouchableOpacity onPress={onPrevMonth} style={styles.monthArrow}>
              <Text style={[styles.monthArrowText, { color: theme.textMuted }]}>◀</Text>
            </TouchableOpacity>
            <Text style={[styles.calendarMonthText, { color: theme.text }]}>{selectedMonthString}</Text>
            <TouchableOpacity onPress={onNextMonth} style={styles.monthArrow}>
              <Text style={[styles.monthArrowText, { color: theme.textMuted }]}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EAEAEA' }} />
          <Text style={{ fontSize: 11, color: theme.textMuted }}>0개</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#A6C89B' }} />
          <Text style={{ fontSize: 11, color: theme.textMuted }}>1~2개</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#5B744C' }} />
          <Text style={{ fontSize: 11, color: theme.textMuted }}>모두 완료</Text>
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
          const level = monthData.levels[day] || 0;
          const isSelected = selectedDayDetail?.day === day;

          return (
            <CalendarDayCell
              key={`day-${day}`}
              day={day}
              level={level}
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
              {selectedDayDetail.year}년 {selectedDayDetail.month}월 {selectedDayDetail.day}일 실천 기록
            </Text>
            <TouchableOpacity onPress={onCloseDayDetail}>
              <Text style={{ color: COLORS.error, fontSize: 13, fontWeight: '800' }}>닫기</Text>
            </TouchableOpacity>
          </View>

          {loadingDayMissions ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.inlineMissionList}>
              {selectedDayMissions.length === 0 ? (
                <Text style={{ color: theme.textMuted, textAlign: 'center', padding: 20 }}>
                  배정된 미션이 없습니다.
                </Text>
              ) : (
                selectedDayMissions.map((m, idx) => {
                  const isCompleted = m.completed;

                  return (
                    <View key={m.id}>
                      <View style={styles.dayDetailMissionRow}>
                        <View style={styles.dayDetailMissionLeft}>
                          <View style={[styles.modalIconWrapper, { backgroundColor: isCompleted ? '#E4F2E6' : '#EDEBE1' }]}>
                            {getMissionIcon(m.missionType, isCompleted ? '#5B744C' : theme.textMuted, 20)}
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
                      {idx < selectedDayMissions.length - 1 && <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />}
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default MonthlyCalendarCard;
