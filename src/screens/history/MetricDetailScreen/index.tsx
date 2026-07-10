import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './MetricDetailScreen.styles';
import { useMetricDetail } from './hooks/useMetricDetail';
import { ValueCard } from './components/ValueCard';
import { TrendChart } from './components/TrendChart';
import { AnalysisCard } from './components/AnalysisCard';
import { HabitsCard } from './components/HabitsCard';
import { mapStatusToKorean, getStatusColor } from '@/screens/history/HealthReportScreen/utils';
import { getFallbackRangeBar } from '@/screens/history/HealthReportScreen/fallbackRanges';

export default function MetricDetailScreen({ navigation, route }: RootStackScreenProps<'MetricDetail'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const { recordId, metricCode, metricName, value, unit } = route.params;
  const numValue = parseFloat(value) || 0;

  const { isLoading, trends, explanation, habits, completedHabits, toggleHabit, metricCard } =
    useMetricDetail(recordId, metricCode, numValue);

  // 검진 결과 상세 그래프/상태는 서버 응답(metricCard)을 그대로 사용
  const displayValue = metricCard?.value != null ? String(metricCard.value) : value;
  const displayUnit = metricCard?.unit ?? unit;
  const statusText = metricCard?.status_label ?? '정상';
  const badgeColor = getStatusColor(mapStatusToKorean(metricCard?.status));
  const rangeBar = metricCard?.range_bar ?? getFallbackRangeBar(metricCode, numValue);
  const noteText = metricCard && metricCard.badge_text !== metricCard.status_label ? metricCard.badge_text : undefined;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F6F4ED' }]}>
        <ScreenHeader title={`종합 ${metricName} 분석`} onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F6F4ED' }]}>
      <ScreenHeader title={`종합 ${metricName} 분석`} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card 1: Value Detail */}
        <ValueCard
          metricName={metricName}
          value={displayValue}
          unit={displayUnit}
          statusText={statusText}
          badgeColor={badgeColor}
          rangeBar={rangeBar}
          noteText={noteText}
          theme={theme}
        />

        {/* Card 2: Recent Trends */}
        <TrendChart trends={trends} theme={theme} />

        {/* Card 3: Analysis interpretation */}
        <AnalysisCard explanation={explanation} theme={theme} />

        {/* Card 4: Recommended habits checklist */}
        <HabitsCard
          habits={habits}
          completedHabits={completedHabits}
          onToggleHabit={toggleHabit}
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
