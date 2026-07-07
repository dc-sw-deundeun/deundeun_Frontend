import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Trash2 } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './HealthReportScreen.styles';
import { SummaryCard } from './components/SummaryCard';
import { FbsMetricCard } from './components/FbsMetricCard';
import { MetricListCard } from './components/MetricListCard';
import { HabitRecommendations } from './components/HabitRecommendations';
import { useHealthReport } from './hooks/useHealthReport';
import { mapStatusToKorean } from './utils';

export default function HealthReportScreen({ navigation, route }: RootStackScreenProps<'HealthReport'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const recordId = route.params?.recordId;

  const {
    isLoading,
    metrics,
    dateStr,
    verificationStatus,
    addedMissions,
    handleVerify,
    handleDelete,
    handleAddMission,
  } = useHealthReport(recordId, () => navigation.goBack());

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
        <SummaryCard cautionCount={cautionCount} dateStr={dateStr} theme={theme} />

        {/* Featured Fasting Blood Sugar Card if exists */}
        {fbsMetric && (
          <FbsMetricCard
            metric={fbsMetric}
            onPress={() => navigation.navigate('MetricDetail', {
              recordId: recordId!,
              metricCode: fbsMetric.metric_code,
              metricName: fbsMetric.metric_name,
              value: fbsMetric.value ?? '-',
              unit: fbsMetric.unit,
            })}
            theme={theme}
          />
        )}

        {/* Other Indicators list */}
        <MetricListCard
          metrics={metrics}
          onSelectMetric={(item) => navigation.navigate('MetricDetail', {
            recordId: recordId!,
            metricCode: item.metric_code,
            metricName: item.metric_name,
            value: item.value ?? '-',
            unit: item.unit,
          })}
          theme={theme}
        />

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
        <HabitRecommendations
          addedMissions={addedMissions}
          onAddMission={handleAddMission}
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
