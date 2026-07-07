import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './MetricDetailScreen.styles';
import { getMetricRangeConfig } from './constants';
import { useMetricDetail } from './hooks/useMetricDetail';
import { ValueCard } from './components/ValueCard';
import { TrendChart } from './components/TrendChart';
import { AnalysisCard } from './components/AnalysisCard';
import { HabitsCard } from './components/HabitsCard';

export default function MetricDetailScreen({ navigation, route }: RootStackScreenProps<'MetricDetail'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const { recordId, metricCode, metricName, value, unit } = route.params;
  const numValue = parseFloat(value) || 0;

  const { isLoading, trends, explanation, habits, completedHabits, toggleHabit } =
    useMetricDetail(recordId, metricCode, numValue);

  const config = getMetricRangeConfig(metricCode);
  const positionPercentage = Math.min(
    Math.max(((numValue - config.minVal) / (config.maxVal - config.minVal)) * 100, 2),
    98
  );

  let statusText = '정상 구간';
  let badgeColor = COLORS.success;
  if (numValue > config.cautionMax) {
    statusText = '위험 · 관리 필요';
    badgeColor = COLORS.error;
  } else if (numValue > config.normalMax) {
    statusText = '주의 · 경계 구간';
    badgeColor = COLORS.warning;
  }

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
          value={value}
          unit={unit}
          statusText={statusText}
          badgeColor={badgeColor}
          positionPercentage={positionPercentage}
          config={config}
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
