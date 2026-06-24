import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Modal, Animated, Pressable, Platform, LayoutAnimation, UIManager } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Calendar } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DailyMission {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  xp: number;
}

interface CalendarDayCellProps {
  day: number;
  completedCount: number;
  isSelected: boolean;
  theme: any;
  onPress: (day: number) => void;
}

// 1. Sub-component for Calendar Day Cells with float and spring animations on hover/select
const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ day, completedCount, isSelected, theme, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Animation values
  const animScale = useRef(new Animated.Value(1)).current;
  const animTranslate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const active = isHovered || isSelected;
    Animated.parallel([
      Animated.spring(animScale, {
        toValue: active ? 1.15 : 1.0,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(animTranslate, {
        toValue: active ? -4 : 0,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isHovered, isSelected]);

  return (
    <Pressable
      onPress={() => onPress(day)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={styles.calendarCellWrapper}
    >
      <Animated.View
        style={{
          transform: [
            { scale: animScale },
            { translateY: animTranslate },
          ],
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {completedCount === 3 ? (
          <View style={[styles.circleRing, { borderColor: '#5B744C' }]}>
            <View style={[styles.circleFilled, { backgroundColor: '#5B744C' }]}>
              <Text style={styles.calendarCellTextWhite}>{day}</Text>
            </View>
          </View>
        ) : completedCount === 2 ? (
          <View style={[styles.circleFilled, { backgroundColor: '#A6C89B' }]}>
            <Text style={[styles.calendarCellTextGreen, { color: '#3F583B' }]}>{day}</Text>
          </View>
        ) : completedCount === 1 ? (
          <View style={[styles.circleFilled, { backgroundColor: '#CDE3C2' }]}>
            <Text style={[styles.calendarCellTextGreen, { color: '#3F583B' }]}>{day}</Text>
          </View>
        ) : (
          <View style={styles.circleEmpty}>
            <Text style={[styles.calendarCellTextDefault, { color: theme.text }]}>{day}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default function PracticeScreen() {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Glassmorphism design styles preserving base colors
  const glassCardStyle = {
    backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.5)' : 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.75)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.12 : 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  };

  const glassBannerStyle = {
    backgroundColor: isDarkMode ? 'rgba(35, 48, 33, 0.65)' : 'rgba(53, 75, 51, 0.5)',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.12 : 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  };

  // ScrollView Ref
  const scrollViewRef = useRef<ScrollView>(null);

  // Selected Month State
  const [selectedMonth, setSelectedMonth] = useState<'2024년 5월' | '2024년 4월'>('2024년 5월');

  // Daily Missions State
  const [missions, setMissions] = useState<DailyMission[]>([
    { id: 1, title: '아침 30분 걷기', category: '유산소로 혈당 낮추기', completed: false, xp: 10 },
    { id: 2, title: '잡곡밥 · 채소 먼저 먹기', category: '식이섬유 챙기기', completed: false, xp: 15 },
  ]);

  const [streakDays] = useState(27);

  // Verification Modal States
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState<number | null>(null);

  // Calendar Day Detail Inline Toggle State
  const [selectedDayDetail, setSelectedDayDetail] = useState<{ day: number; month: string } | null>(null);

  const completedCount = missions.filter((m) => m.completed).length;

  const handleVerifyPress = (id: number) => {
    setActiveMissionId(id);
    setIsVerifyModalVisible(true);
  };

  const handleCompleteVerification = () => {
    if (activeMissionId !== null) {
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === activeMissionId) {
            return { ...m, completed: true };
          }
          return m;
        })
      );
      setIsVerifyModalVisible(false);
      Alert.alert('미션 인증 완료', '미션 인증이 완료되어 XP가 지급되었습니다!');
    }
  };

  const handleCancelVerification = () => {
    setIsVerifyModalVisible(false);
  };

  const handlePrevMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMonth('2024년 4월');
    setSelectedDayDetail(null); // Clear selected day detail on month change
  };

  const handleNextMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMonth('2024년 5월');
    setSelectedDayDetail(null); // Clear selected day detail on month change
  };

  // Get Calendar details based on selected month
  const getMonthData = () => {
    if (selectedMonth === '2024년 5월') {
      return {
        offset: 3, // Wednesday start
        days: 31,
        counts: {
          1: 1, // light green
          2: 2, // medium green
          3: 3, // dark green with outline
          4: 1, // light green
          5: 3, // dark green with outline
        } as Record<number, number>,
      };
    } else {
      return {
        offset: 1, // Monday start
        days: 30,
        counts: {
          8: 1,
          9: 2,
          10: 3,
          11: 2,
          12: 1,
          15: 3,
          16: 2,
          22: 3,
        } as Record<number, number>,
      };
    }
  };

  const monthData = getMonthData();

  const handleDayPress = (day: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (selectedDayDetail && selectedDayDetail.day === day && selectedDayDetail.month === selectedMonth) {
      setSelectedDayDetail(null); // Toggle collapse
    } else {
      setSelectedDayDetail({ day, month: selectedMonth }); // Expand selected day
      
      // Auto-scroll ScrollView to bottom so expanded detail view is visible
      // Increased timeout to 350ms to ensure LayoutAnimation has finished expanding the layout
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 350);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header with Search, Dark Mode, and Bell actions */}
        <ScreenHeader
          title="매일의 실천"
          variant="section"
        />

        <View style={styles.scrollContent}>
          {/* 1. 이번 주 기록 Card */}
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
              {[
                { day: '월', active: true },
                { day: '화', active: true },
                { day: '수', active: true },
                { day: '목', active: true },
                { day: '금', active: false, today: true },
                { day: '토', active: false },
                { day: '일', active: false },
              ].map((item, idx) => (
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

          {/* 2. 오늘의 미션 Section Header & Cards */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitleText, { color: theme.text }]}>오늘의 미션</Text>
            <Text style={[styles.sectionProgressText, { color: '#5B744C' }]}>
              {completedCount} / {missions.length} 완료
            </Text>
          </View>

          <View style={styles.missionList}>
            {missions.map((mission) => {
              const accentColor = mission.id === 1 ? '#5B744C' : '#C9852E';
              const lightAccent = mission.id === 1 ? '#EBF2E8' : '#FCF3E6';

              return (
                <View
                  key={mission.id}
                  style={[styles.missionCard, glassCardStyle]}
                >
                  <View style={styles.glassShine} pointerEvents="none" />
                  {/* Left accent vertical line */}
                  <View style={[styles.cardLeftAccent, { backgroundColor: accentColor }]} />

                  <View style={styles.missionCardContent}>
                    {/* Icon wrapper */}
                    <View style={[styles.missionIconContainer, { backgroundColor: lightAccent }]}>
                      <Text style={{ fontSize: 18 }}>
                        {mission.id === 1 ? '🚶' : '🥗'}
                      </Text>
                    </View>

                    {/* Text descriptions */}
                    <View style={styles.missionTextGroup}>
                      <Text style={[styles.missionCardTitle, { color: theme.text }]}>
                        {mission.title}
                      </Text>
                      <Text style={[styles.missionCardPoints, { color: theme.textMuted }]}>
                        +{mission.xp} XP
                      </Text>
                    </View>

                    {/* Action button */}
                    {mission.completed ? (
                      <View style={[styles.completedBtnBadge, { backgroundColor: '#E4F2E6' }]}>
                        <Check color="#5B744C" size={14} strokeWidth={3} />
                        <Text style={styles.completedBtnText}>완료</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.verifyButton, { backgroundColor: '#354B33' }]}
                        onPress={() => handleVerifyPress(mission.id)}
                      >
                        <Text style={styles.verifyButtonText}>인증하기</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* 3. 주간 미션 달성 현황 Banner */}
          <View style={[styles.achievementCard, glassBannerStyle]}>
            <View style={styles.glassShine} pointerEvents="none" />
            <Text style={styles.achievementTitle}>주간 미션 달성 현황</Text>
            <View style={styles.achievementPill}>
              <Text style={styles.achievementPillText}>★ 상위 5% 달성 중</Text>
            </View>
          </View>

          {/* 4. 월간 활동 현황 Calendar Card (Expands smoothly to show details inline) */}
          <View style={[styles.card, glassCardStyle]}>
            <View style={styles.glassShine} pointerEvents="none" />
            <View style={[styles.cardHeaderRow, { marginBottom: SPACING.md }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Calendar color={theme.text} size={20} />
                <Text style={[styles.cardTitle, { color: theme.text }]}>월간 활동 현황</Text>
              </View>

              {/* Month Switcher Controls */}
              <View style={styles.monthSwitcher}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.monthArrow}>
                  <Text style={[styles.monthArrowText, { color: theme.textMuted }]}>◀</Text>
                </TouchableOpacity>
                <Text style={[styles.calendarMonthText, { color: theme.text }]}>{selectedMonth}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.monthArrow}>
                  <Text style={[styles.monthArrowText, { color: theme.textMuted }]}>▶</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {/* Day Labels */}
              {['일', '월', '화', '수', '목', '금', '토'].map((label, idx) => (
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
                    onPress={handleDayPress}
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
                  <TouchableOpacity onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSelectedDayDetail(null);
                  }}>
                    <Text style={{ color: COLORS.error, fontSize: 13, fontWeight: '800' }}>닫기</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inlineMissionList}>
                  {[
                    { title: '아침 30분 걷기', emoji: '🚶', id: 1 },
                    { title: '잡곡밥 · 채소 먼저 먹기', emoji: '🥗', id: 2 },
                    { title: '물 자주 마시기 (하루 8잔)', emoji: '💧', id: 3 },
                  ].map((m, idx) => {
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
        </View>
      </ScrollView>

      {/* Verification bottom sheet modal */}
      <Modal
        visible={isVerifyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelVerification}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalInnerContainer}>
            {/* Options card */}
            <View style={[styles.modalOptionsCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitleText, { color: '#8F8E84' }]}>무엇을 추가할까요?</Text>

              {/* Option 1: Camera */}
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={handleCompleteVerification}
              >
                <View style={[styles.modalIconWrapper, { backgroundColor: '#EBF2E8' }]}>
                  <Text style={{ fontSize: 20 }}>📸</Text>
                </View>
                <View style={styles.modalTextGroup}>
                  <Text style={[styles.modalOptionTitle, { color: theme.text }]}>검진 결과지 촬영</Text>
                  <Text style={[styles.modalOptionDesc, { color: theme.textMuted }]}>사진을 찍으면 수치를 자동 인식해요</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

              {/* Option 2: Pencil */}
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={handleCompleteVerification}
              >
                <View style={[styles.modalIconWrapper, { backgroundColor: '#FCF3E6' }]}>
                  <Text style={{ fontSize: 20 }}>✍️</Text>
                </View>
                <View style={styles.modalTextGroup}>
                  <Text style={[styles.modalOptionTitle, { color: theme.text }]}>직접 입력하기</Text>
                  <Text style={[styles.modalOptionDesc, { color: theme.textMuted }]}>수치를 손으로 입력할게요</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

              {/* Option 3: Image */}
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={handleCompleteVerification}
              >
                <View style={[styles.modalIconWrapper, { backgroundColor: '#EEF4FA' }]}>
                  <Text style={{ fontSize: 20 }}>📄</Text>
                </View>
                <View style={styles.modalTextGroup}>
                  <Text style={[styles.modalOptionTitle, { color: theme.text }]}>이미지 불러오기</Text>
                  <Text style={[styles.modalOptionDesc, { color: theme.textMuted }]}>저장된 스캔 파일에서 가져와요</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Cancel Card */}
            <TouchableOpacity
              style={[styles.modalCancelCard, { backgroundColor: theme.card }]}
              onPress={handleCancelVerification}
            >
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    borderRadius: 24,
    padding: SPACING.lg,
    overflow: 'hidden',
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
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    color: '#C9852E',
    fontSize: 12,
    fontWeight: '800',
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
  weekDateSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionProgressText: {
    fontSize: 13,
    fontWeight: '800',
  },
  missionList: {
    gap: 12,
  },
  missionCard: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
    height: 80,
  },
  cardLeftAccent: {
    width: 6,
    height: '100%',
  },
  missionCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  missionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionTextGroup: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  missionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  missionCardPoints: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifyButton: {
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  completedBtnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
  },
  completedBtnText: {
    color: '#5B744C',
    fontSize: 13,
    fontWeight: '800',
  },
  achievementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  achievementTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  achievementPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  monthSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthArrow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  monthArrowText: {
    fontSize: 12,
    fontWeight: '800',
  },
  calendarMonthText: {
    fontSize: 14,
    fontWeight: '800',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarDayLabelCell: {
    width: '14.28%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayLabelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  calendarCellEmpty: {
    width: '14.28%',
    height: 44,
  },
  calendarCellWrapper: {
    width: '14.28%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleFilled: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleEmpty: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarCellTextWhite: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  calendarCellTextGreen: {
    fontSize: 12,
    fontWeight: '800',
  },
  calendarCellTextDefault: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerFoxContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foxDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9852E',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalInnerContainer: {
    width: '100%',
    gap: 8,
  },
  modalOptionsCard: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitleText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  modalIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextGroup: {
    marginLeft: 14,
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalOptionDesc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    width: '100%',
  },
  modalCancelCard: {
    height: 54,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modalCancelText: {
    color: '#B3463B',
    fontSize: 16,
    fontWeight: '800',
  },
  inlineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inlineMissionList: {
    width: '100%',
  },
  dayDetailMissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dayDetailMissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayDetailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dayDetailBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  glassShine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '250%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ rotate: '25deg' }, { translateX: 20 }, { translateY: -40 }],
  },
});
