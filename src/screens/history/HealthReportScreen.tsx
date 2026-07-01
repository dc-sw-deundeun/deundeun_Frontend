import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, ClipboardList, CheckCircle, Trash2, ChevronRight } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { recordsApi, MetricResponse } from '@/api';

const mapStatusToKorean = (status?: string | null): '정상' | '경계' | '주의' => {
  if (!status) return '정상';
  const s = status.toUpperCase();
  if (s === 'DANGER' || s === 'ERROR' || s === 'RISK' || s === '주의' || s === '위험') return '주의';
  if (s === 'WARNING' || s === 'BORDERLINE' || s === 'CAUTION' || s === '경계') return '경계';
  return '정상';
};

const getStatusColor = (status: '정상' | '경계' | '주의') => {
  if (status === '정상') return COLORS.success;
  if (status === '경계') return COLORS.warning;
  return COLORS.error;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '날짜 없음';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length >= 2) {
    return `${parts[0]}년 ${parseInt(parts[1])}월`;
  }
  return dateStr;
};

export default function HealthReportScreen({ navigation, route }: RootStackScreenProps<'HealthReport'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const recordId = route.params?.recordId;

  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricResponse[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('UNVERIFIED');
  const [addedMissions, setAddedMissions] = useState<string[]>([]);

  useEffect(() => {
    if (recordId) {
      loadRecordDetail();
    } else {
      setIsLoading(false);
    }
  }, [recordId]);

  const loadRecordDetail = async () => {
    setIsLoading(true);
    try {
      const res = await recordsApi.getCheckup(recordId!);
      if (res.success && res.data) {
        setMetrics(res.data.metrics || []);
        setDateStr(res.data.measured_at || res.data.created_at || '');
        setVerificationStatus(res.data.verification_status || 'UNVERIFIED');
      }
    } catch (e) {
      console.warn('검진 결과 상세 로드 실패:', e);
      Alert.alert('오류', '검진 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!recordId) return;
    try {
      const res = await recordsApi.verifyCheckup(recordId);
      if (res.success) {
        setVerificationStatus('VERIFIED');
        Alert.alert('검수 완료', '사용자 확인이 완료되어 검진 기록이 VERIFIED 상태로 전환되었습니다.');
      } else {
        Alert.alert('오류', res.message || '검수 전환에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '검수 처리 중 서버 통신에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    Alert.alert('기록 삭제', '정말 이 검진 기록을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await recordsApi.deleteCheckup(recordId);
            if (res.success) {
              Alert.alert('삭제 완료', '검진 기록이 성공적으로 삭제되었습니다.', [
                {
                  text: '확인',
                  onPress: () => navigation.goBack(),
                },
              ]);
            }
          } catch {
            Alert.alert('오류', '기록 삭제 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  const handleAddMission = (missionName: string) => {
    if (addedMissions.includes(missionName)) return;
    setAddedMissions((prev) => [...prev, missionName]);
    Alert.alert('미션 추가 완료', `"${missionName}"이(가) 오늘의 미션으로 추가되었습니다!`);
  };

  const fbsMetric = metrics.find(m => m.metric_code === 'FastingBloodSugar');

  const cautionCount = metrics.filter(m => {
    const ko = mapStatusToKorean(m.status);
    return ko === '주의' || ko === '경계';
  }).length;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScreenHeader title="검진 결과 상세 보고서" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="검진 결과 상세 보고서"
        onBack={() => navigation.goBack()}
        right={
          recordId ? (
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 color={COLORS.error} size={22} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Comprehensive Health State */}
        <Card style={styles.summaryCard} padding={SPACING.md}>
          <View style={styles.summaryTopRow}>
            <View style={[styles.alertIconCircle, { backgroundColor: (cautionCount > 0 ? COLORS.warning : COLORS.success) + '15' }]}>
              <AlertTriangle color={cautionCount > 0 ? COLORS.warning : COLORS.success} size={26} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryTitle, { color: theme.text }]}>
                {cautionCount > 0 ? '종합 소견: 관리가 필요해요' : '종합 소견: 아주 건강해요!'}
              </Text>
              <Text style={[styles.summarySubtitle, { color: theme.textMuted }]}>
                {formatDate(dateStr)} 검진 결과 기준, 주의/경계 지표는 {cautionCount}개입니다.
              </Text>
            </View>
          </View>
        </Card>

        {/* Featured Fasting Blood Sugar Card if exists */}
        {fbsMetric && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('MetricDetail', {
              recordId: recordId!,
              metricCode: fbsMetric.metric_code,
              metricName: fbsMetric.metric_name,
              value: fbsMetric.value ?? '-',
              unit: fbsMetric.unit,
            })}
          >
            <Card style={styles.detailCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>공복혈당 분석</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(mapStatusToKorean(fbsMetric.status)) + '15' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(mapStatusToKorean(fbsMetric.status)) }]}>
                    {mapStatusToKorean(fbsMetric.status)} ({fbsMetric.value} {fbsMetric.unit})
                  </Text>
                </View>
              </View>

              <Text style={[styles.interpretationText, { color: theme.textMuted }]}>
                공복혈당 수치가 {fbsMetric.value}{fbsMetric.unit}입니다. 지표를 클릭하여 더 자세한 추이 분석 및 건강 가이드를 확인해보세요.
              </Text>
            </Card>
          </TouchableOpacity>
        )}

        {/* Other Indicators list */}
        <View style={styles.otherGroup}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>건강 세부 지표 목록</Text>

          <Card style={styles.cardList} padding={0}>
            {metrics.length === 0 ? (
              <View style={{ padding: SPACING.lg, alignItems: 'center' }}>
                <Text style={{ color: theme.textMuted }}>검진 지표 데이터가 없습니다.</Text>
              </View>
            ) : (
              metrics.map((item, idx) => {
                const statusKorean = mapStatusToKorean(item.status);
                const statusColor = getStatusColor(statusKorean);

                return (
                  <View key={item.metric_id}>
                    {idx > 0 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => navigation.navigate('MetricDetail', {
                        recordId: recordId!,
                        metricCode: item.metric_code,
                        metricName: item.metric_name,
                        value: item.value ?? '-',
                        unit: item.unit,
                      })}
                    >
                      <View>
                        <Text style={[styles.listLabel, { color: theme.text }]}>{item.metric_name}</Text>
                        <Text style={[styles.listVal, { color: theme.textMuted }]}>
                          {item.value ?? '-'} {item.unit ?? ''}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[styles.itemBadge, { backgroundColor: statusColor + '15' }]}>
                          <Text style={[styles.itemBadgeText, { color: statusColor }]}>{statusKorean}</Text>
                        </View>
                        <ChevronRight size={16} color={theme.textMuted} />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </Card>
        </View>

        {/* Verification Action Button */}
        {verificationStatus !== 'VERIFIED' && recordId && (
          <TouchableOpacity
            style={[styles.verifyBtn, { backgroundColor: COLORS.primary }]}
            onPress={handleVerify}
          >
            <CheckCircle color="#ffffff" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.verifyBtnText}>검수 및 사용자 확인 완료</Text>
          </TouchableOpacity>
        )}

        {/* Habit Recommendations */}
        <View style={styles.habitsGroup}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>의사가 추천하는 맞춤 습관</Text>

          {[
            '식후 30분 유산소 걷기',
            '식사할 때 잡곡밥과 채소 먼저 먹기',
            '단 액상과당 음료 끊고 물 마시기',
          ].map((habit, idx) => (
            <Card key={idx} style={styles.habitCard} padding={SPACING.md} radius={20}>
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
            </Card>
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
  summaryCard: {},
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
    padding: SPACING.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
  interpretationText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: SPACING.xs,
  },
  otherGroup: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardList: {},
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
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
  verifyBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  verifyBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  habitsGroup: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
