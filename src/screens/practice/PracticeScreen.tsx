import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Calendar, ChevronRight, Award, Flame } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';

interface DailyMission {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  xp: number;
}

export default function PracticeScreen() {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [missions, setMissions] = useState<DailyMission[]>([
    { id: 1, title: '아침 30분 걷기', category: '유산소로 혈당 낮추기', completed: false, xp: 10 },
    { id: 2, title: '잡곡밥 · 채소 먼저 먹기', category: '식이섬유 챙기기', completed: true, xp: 15 },
    { id: 3, title: '물 자주 마시기 (하루 8잔)', category: '충분한 수분 섭취', completed: false, xp: 5 },
  ]);

  const [streakDays, setStreakDays] = useState(27);

  // Calendar dates for May 2024 mock grid
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const completedDays = [2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27]; // mock completed dates

  const handleVerify = (id: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          Alert.alert('미션 완료', `"${m.title}" 미션을 완료하여 ${m.xp} XP를 획득했습니다!`);
          return { ...m, completed: true };
        }
        return m;
      })
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScreenHeader title="매일의 실천" variant="section" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Weekly Streak Bar */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Flame color={COLORS.warning} size={20} fill={COLORS.warning} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>이번 주 기록</Text>
            </View>
            <Text style={[styles.streakCountText, { color: COLORS.primary }]}>{streakDays}일 연속 실천 중</Text>
          </View>

          {/* Week Days */}
          <View style={styles.weekDaysRow}>
            {[
              { day: '월', date: '22', active: true },
              { day: '화', date: '23', active: true },
              { day: '수', date: '24', active: true },
              { day: '목', date: '25', active: true },
              { day: '금', date: '26', active: true },
              { day: '토', date: '27', active: true, today: true },
              { day: '일', date: '28', active: false },
            ].map((item, idx) => (
              <View key={idx} style={styles.weekDayCell}>
                <Text style={[styles.weekDayLabel, { color: theme.textMuted }]}>{item.day}</Text>
                <View
                  style={[
                    styles.weekDateBadge,
                    {
                      backgroundColor: item.today
                        ? COLORS.primary
                        : item.active
                        ? COLORS.primaryLight
                        : theme.disabledBg,
                    },
                  ]}
                >
                  {item.active && !item.today ? (
                    <Check color={COLORS.primaryDark} size={14} strokeWidth={3} />
                  ) : (
                    <Text
                      style={[
                        styles.weekDateText,
                        {
                          color: item.today
                            ? '#ffffff'
                            : item.active
                            ? COLORS.primaryDark
                            : theme.textMuted,
                        },
                      ]}
                    >
                      {item.date}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Mission Verification */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text, marginBottom: SPACING.md }]}>오늘의 미션 실천</Text>

          <View style={styles.missionList}>
            {missions.map((mission) => (
              <View
                key={mission.id}
                style={[
                  styles.missionItem,
                  { borderColor: theme.border, backgroundColor: theme.background },
                  mission.completed && { opacity: 0.7 }
                ]}
              >
                <View style={styles.missionInfo}>
                  <Text style={[styles.missionTitle, { color: theme.text }, mission.completed && styles.lineThrough]}>
                    {mission.title}
                  </Text>
                  <Text style={[styles.missionCategory, { color: theme.textMuted }]}>
                    {mission.category}
                  </Text>
                </View>

                {mission.completed ? (
                  <View style={[styles.completedBadge, { backgroundColor: COLORS.primaryLight }]}>
                    <Check color={COLORS.primaryDark} size={16} strokeWidth={3} />
                    <Text style={[styles.completedText, { color: COLORS.primaryDark }]}>완료</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.verifyBtn, { backgroundColor: COLORS.primary }]}
                    onPress={() => handleVerify(mission.id)}
                  >
                    <Text style={styles.verifyBtnText}>인증하기</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Achievement Banner */}
        <View style={[styles.achievementCard, { backgroundColor: COLORS.primaryDark }]}>
          <View style={styles.achievementLeft}>
            <Award color={COLORS.accent} size={28} />
            <View>
              <Text style={styles.achievementTitle}>주간 미션 달성 현황</Text>
              <Text style={styles.achievementDesc}>영순님은 현재 상위 5% 달성 중입니다!</Text>
            </View>
          </View>
          <ChevronRight color="#ffffff" size={20} />
        </View>

        {/* Monthly Activity Calendar Grid */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.cardHeaderRow, { marginBottom: SPACING.md }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Calendar color={theme.text} size={20} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>월간 활동 현황</Text>
            </View>
            <Text style={[styles.calendarMonthText, { color: theme.textMuted }]}>2024년 5월</Text>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {daysInMonth.map((day) => {
              const isCompleted = completedDays.includes(day);
              return (
                <View
                  key={day}
                  style={[
                    styles.calendarCell,
                    {
                      backgroundColor: isCompleted
                        ? COLORS.primaryLight
                        : (isDarkMode ? '#1B2E21' : '#F1F5F2'),
                      borderColor: isCompleted ? COLORS.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarCellText,
                      {
                        color: isCompleted
                          ? COLORS.primaryDark
                          : theme.textMuted,
                        fontWeight: isCompleted ? '700' : '400',
                      },
                    ]}
                  >
                    {day}
                  </Text>
                  {isCompleted && (
                    <View style={styles.completedDot} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: SPACING.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  streakCountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayCell: {
    alignItems: 'center',
    gap: 6,
  },
  weekDayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekDateBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  missionList: {
    gap: SPACING.sm,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  missionInfo: {
    flex: 1,
    gap: 2,
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  missionCategory: {
    fontSize: 12,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  verifyBtn: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  achievementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  achievementTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  achievementDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  calendarMonthText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  calendarCell: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  calendarCellText: {
    fontSize: 11,
  },
  completedDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primaryDark,
  },
});
