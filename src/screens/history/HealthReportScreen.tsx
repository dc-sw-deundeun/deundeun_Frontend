import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, TrendingDown, ClipboardList } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';

export default function HealthReportScreen({ navigation, route }: RootStackScreenProps<'HealthReport'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Read nav params or use high fidelity defaults
  const date = route.params?.date || '2023년 10월';
  const bloodSugar = route.params?.bloodSugar || 126;
  const bloodPressure = route.params?.bloodPressure || '138/88';
  const cholesterol = route.params?.cholesterol || 232;
  const bmi = route.params?.bmi || 23.4;

  const [addedMissions, setAddedMissions] = useState<string[]>([]);

  const handleAddMission = (missionName: string) => {
    if (addedMissions.includes(missionName)) return;
    setAddedMissions((prev) => [...prev, missionName]);
    Alert.alert('미션 추가 완료', `"${missionName}"이(가) 오늘의 미션으로 추가되었습니다!`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="검진 결과 상세 보고서" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Comprehensive Health State */}
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.summaryTopRow}>
            <View style={[styles.alertIconCircle, { backgroundColor: COLORS.warning + '15' }]}>
              <AlertTriangle color={COLORS.warning} size={26} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryTitle, { color: theme.text }]}>종합 소견: 관리가 필요해요</Text>
              <Text style={[styles.summarySubtitle, { color: theme.textMuted }]}>
                주의 수치 2개, 정상 수치 2개가 감지되었습니다.
              </Text>
            </View>
          </View>
        </View>

        {/* Blood Sugar Analysis */}
        <View style={[styles.detailCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>공복혈당 분석</Text>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.error + '15' }]}>
              <Text style={[styles.statusText, { color: COLORS.error }]}>주의 ({bloodSugar} mg/dL)</Text>
            </View>
          </View>

          {/* Graph Section */}
          <Text style={[styles.graphLabel, { color: theme.text }]}>최근 추이 공복혈당</Text>
          <View style={[styles.graphContainer, { backgroundColor: theme.background }]}>
            {/* Visual graph path mock */}
            <View style={styles.graphPointsRow}>
              {[
                { date: '첫날', val: 126 },
                { date: '2주 전', val: 120 },
                { date: '1주 전', val: 117 },
                { date: '오늘', val: 114 },
              ].map((pt, idx) => (
                <View key={idx} style={styles.graphPointItem}>
                  <Text style={[styles.graphValText, { color: theme.text }]}>{pt.val}</Text>
                  <View style={[styles.graphNode, { backgroundColor: idx === 3 ? COLORS.primary : COLORS.error }]} />
                  <Text style={[styles.graphDateText, { color: theme.textMuted }]}>{pt.date}</Text>
                </View>
              ))}
            </View>
            {/* Trend down indicator */}
            <View style={styles.trendRow}>
              <TrendingDown color={COLORS.success} size={16} />
              <Text style={styles.trendText}>첫날 대비 12 mg/dL 감소 중!</Text>
            </View>
          </View>

          <Text style={[styles.interpretationText, { color: theme.textMuted }]}>
            {bloodSugar}은 당뇨 전단계 수치입니다. 식후 가벼운 걷기와 잡곡밥/야채 위주의 식이섬유 섭취를 유지하면 4주 내에 안심 범위(100 미만)로 개선할 수 있습니다.
          </Text>
        </View>

        {/* Other Indicators list */}
        <View style={styles.otherGroup}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>기타 혈관 건강 지표</Text>

          <View style={[styles.cardList, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Blood Pressure */}
            <View style={styles.listItem}>
              <View>
                <Text style={[styles.listLabel, { color: theme.text }]}>혈압</Text>
                <Text style={[styles.listVal, { color: theme.textMuted }]}>{bloodPressure} mmHg</Text>
              </View>
              <View style={[styles.itemBadge, { backgroundColor: COLORS.warning + '15' }]}>
                <Text style={[styles.itemBadgeText, { color: COLORS.warning }]}>경계</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Cholesterol */}
            <View style={styles.listItem}>
              <View>
                <Text style={[styles.listLabel, { color: theme.text }]}>총콜레스테롤</Text>
                <Text style={[styles.listVal, { color: theme.textMuted }]}>{cholesterol} mg/dL</Text>
              </View>
              <View style={[styles.itemBadge, { backgroundColor: COLORS.warning + '15' }]}>
                <Text style={[styles.itemBadgeText, { color: COLORS.warning }]}>주의</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* BMI */}
            <View style={styles.listItem}>
              <View>
                <Text style={[styles.listLabel, { color: theme.text }]}>체질량지수 (BMI)</Text>
                <Text style={[styles.listVal, { color: theme.textMuted }]}>{bmi} kg/㎡</Text>
              </View>
              <View style={[styles.itemBadge, { backgroundColor: COLORS.success + '15' }]}>
                <Text style={[styles.itemBadgeText, { color: COLORS.success }]}>정상</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Habit Recommendations */}
        <View style={styles.habitsGroup}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>의사가 추천하는 맞춤 습관</Text>

          {[
            '식후 30분 유산소 걷기',
            '식사할 때 잡곡밥과 채소 먼저 먹기',
            '단 액상과당 음료 끊고 물 마시기',
          ].map((habit, idx) => (
            <View key={idx} style={[styles.habitCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.habitLeft}>
                <ClipboardList color={COLORS.primary} size={20} />
                <Text style={[styles.habitText, { color: theme.text }]}>{habit}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.addHabitBtn,
                  {
                    backgroundColor: addedMissions.includes(habit)
                      ? COLORS.primaryLight
                      : COLORS.primary,
                  },
                ]}
                onPress={() => handleAddMission(habit)}
                disabled={addedMissions.includes(habit)}
              >
                <Text
                  style={[
                    styles.addHabitBtnText,
                    {
                      color: addedMissions.includes(habit)
                        ? COLORS.primaryDark
                        : '#ffffff',
                    },
                  ]}
                >
                  {addedMissions.includes(habit) ? '추가됨' : '미션 받기'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
  summaryCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: SPACING.md,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  alertIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  summarySubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  detailCard: {
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  graphLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  graphContainer: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  graphPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primaryLight,
    paddingBottom: 4,
  },
  graphPointItem: {
    alignItems: 'center',
    gap: 4,
  },
  graphValText: {
    fontSize: 12,
    fontWeight: '800',
  },
  graphNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  graphDateText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: SPACING.md,
  },
  trendText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  interpretationText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  otherGroup: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    paddingLeft: SPACING.xs,
  },
  cardList: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  listLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  listVal: {
    fontSize: 12,
    marginTop: 2,
  },
  itemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  habitsGroup: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  habitText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  addHabitBtn: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addHabitBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
