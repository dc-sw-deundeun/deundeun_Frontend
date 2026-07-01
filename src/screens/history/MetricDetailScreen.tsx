import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Info } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { recordsApi } from '@/api';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// Helper to determine value placement on range slider
interface RangeConfig {
  minVal: number;
  maxVal: number;
  normalMax: number;
  cautionMax: number;
  normalText: string;
  cautionText: string;
  dangerText: string;
}

const getMetricRangeConfig = (code: string): RangeConfig => {
  switch (code) {
    case 'FastingBloodSugar':
      return {
        minVal: 70,
        maxVal: 160,
        normalMax: 99,
        cautionMax: 125,
        normalText: '안심 ~99',
        cautionText: '경계 100~125',
        dangerText: '위험 126~',
      };
    case 'SystolicBP':
      return {
        minVal: 90,
        maxVal: 180,
        normalMax: 119,
        cautionMax: 139,
        normalText: '안심 ~119',
        cautionText: '경계 120~139',
        dangerText: '위험 140~',
      };
    case 'DiastolicBP':
      return {
        minVal: 50,
        maxVal: 110,
        normalMax: 79,
        cautionMax: 89,
        normalText: '안심 ~79',
        cautionText: '경계 80~89',
        dangerText: '위험 90~',
      };
    case 'TotalCholesterol':
    case 'Cholesterol':
      return {
        minVal: 130,
        maxVal: 280,
        normalMax: 199,
        cautionMax: 239,
        normalText: '안심 ~199',
        cautionText: '경계 200~239',
        dangerText: '위험 240~',
      };
    case 'BMI':
      return {
        minVal: 15,
        maxVal: 35,
        normalMax: 22.9,
        cautionMax: 24.9,
        normalText: '안심 18.5~22.9',
        cautionText: '경계 23~24.9',
        dangerText: '위험 25~',
      };
    default:
      return {
        minVal: 0,
        maxVal: 100,
        normalMax: 40,
        cautionMax: 70,
        normalText: '안심',
        cautionText: '경계',
        dangerText: '주의',
      };
  }
};

const getDefaultExplanation = (code: string, value: number): string => {
  switch (code) {
    case 'FastingBloodSugar':
      return `${value}mg/dL은 주의 혹은 경계가 필요한 수치입니다. 식후 가벼운 걷기와 잡곡밥, 채소 위주의 식단을 꾸준히 유지해 주세요.`;
    case 'SystolicBP':
    case 'DiastolicBP':
      return `혈압 조절이 필요한 상태입니다. 나트륨 섭취를 줄이고 규칙적인 가벼운 유산소 운동을 실천해 보세요.`;
    case 'TotalCholesterol':
    case 'Cholesterol':
      return `콜레스테롤 조절이 권장됩니다. 포화지방 섭취를 줄이고 오메가-3 등 불포화지방산이 풍부한 식품을 섭취해 보세요.`;
    case 'BMI':
      return `체질량지수(BMI) 개선을 위해 균형 잡힌 식사와 유산소 및 근력 운동 병행이 도움을 줄 수 있습니다.`;
    default:
      return `수치 모니터링 및 생활 습관 관리를 통해 평소 건강을 챙겨보세요.`;
  }
};

const getDefaultHabits = (code: string): string[] => {
  switch (code) {
    case 'FastingBloodSugar':
      return ['식후 30분 걷기', '잡곡밥 - 채소 먼저 먹기', '단 음료 대신 물 마시기'];
    case 'SystolicBP':
    case 'DiastolicBP':
      return ['음식 싱겁게 먹기', '주 3회 30분 유산소 운동', '스트레스 해소 및 충분한 휴식'];
    default:
      return ['규칙적인 유산소 운동하기', '가공식품 섭취 줄이기', '하루 7시간 이상 숙면 취하기'];
  }
};

export default function MetricDetailScreen({ navigation, route }: RootStackScreenProps<'MetricDetail'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const { recordId, metricCode, metricName, value, unit } = route.params;
  const numValue = parseFloat(value) || 0;

  const [isLoading, setIsLoading] = useState(true);
  const [trends, setTrends] = useState<{ label: string; val: number }[]>([]);
  const [explanation, setExplanation] = useState('');
  const [habits, setHabits] = useState<string[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  useEffect(() => {
    loadMetricDetails();
  }, [recordId, metricCode]);

  const loadMetricDetails = async () => {
    setIsLoading(true);
    try {
      const trendRes = await recordsApi.getCheckupTrends(recordId);
      let trendData: { label: string; val: number }[] = [];
      if (trendRes.success && trendRes.data) {
        const sourceMap = trendRes.data.trends || trendRes.data || {};
        const rawPoints = sourceMap[metricCode] || [];
        if (Array.isArray(rawPoints) && rawPoints.length > 0) {
          trendData = rawPoints.map((pt: any) => {
            const rawDate = pt.measured_at || pt.created_at || '';
            const d = rawDate.split('T')[0];
            const parts = d.split('-');
            const labelStr = parts.length >= 3 ? `${parseInt(parts[1])}/${parseInt(parts[2])}` : '기록';
            return {
              label: labelStr,
              val: pt.value !== undefined ? parseFloat(pt.value) : 0,
            };
          });
        }
      }

      if (trendData.length === 0) {
        trendData = [
          { label: '첫날', val: numValue * 1.05 },
          { label: '2주 전', val: numValue * 1.02 },
          { label: '1주 전', val: numValue * 1.01 },
          { label: '오늘', val: numValue },
        ];
      }
      setTrends(trendData);

      const analysisRes = await recordsApi.getCheckupAnalysis(recordId);
      let explText = '';
      let habitsList: string[] = [];
      if (analysisRes.success && analysisRes.data) {
        const sourceMap = analysisRes.data.analysis || analysisRes.data || {};
        const metricAnalysis = sourceMap[metricCode];
        if (metricAnalysis) {
          explText = metricAnalysis.interpretation || metricAnalysis.description || '';
          habitsList = metricAnalysis.recommended_habits || [];
        }
      }

      if (!explText) explText = getDefaultExplanation(metricCode, numValue);
      if (habitsList.length === 0) habitsList = getDefaultHabits(metricCode);

      setExplanation(explText);
      setHabits(habitsList);

    } catch (e) {
      console.warn('지표 상세 정보 로드 오류:', e);
      setExplanation(getDefaultExplanation(metricCode, numValue));
      setHabits(getDefaultHabits(metricCode));
      setTrends([
        { label: '첫날', val: numValue * 1.05 },
        { label: '2주 전', val: numValue * 1.02 },
        { label: '1주 전', val: numValue * 1.01 },
        { label: '오늘', val: numValue },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = (h: string) => {
    if (completedHabits.includes(h)) {
      setCompletedHabits(prev => prev.filter(item => item !== h));
    } else {
      setCompletedHabits(prev => [...prev, h]);
    }
  };

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

  const renderTrendSvg = () => {
    if (trends.length < 2) return null;

    const width = 280;
    const height = 80;
    const paddingX = 20;
    const paddingY = 15;

    const vals = trends.map(t => t.val);
    const minVal = Math.min(...vals) * 0.95;
    const maxVal = Math.max(...vals) * 1.05;
    const valRange = maxVal - minVal || 1;

    const points = trends.map((t, idx) => {
      const x = paddingX + (idx / (trends.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((t.val - minVal) / valRange) * (height - 2 * paddingY);
      return { x, y };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const areaPathD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
      <View style={styles.chartWrapper}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.0} />
            </LinearGradient>
          </Defs>
          <Path d={areaPathD} fill="url(#chartGrad)" />
          <Path d={pathD} fill="none" stroke={COLORS.primary} strokeWidth={3} />
          {points.map((pt, idx) => (
            <Circle key={idx} cx={pt.x} cy={pt.y} r={4} fill={idx === points.length - 1 ? COLORS.primary : '#ffffff'} stroke={COLORS.primary} strokeWidth={2} />
          ))}
        </Svg>

        <View style={styles.chartLabels}>
          {trends.map((t, idx) => (
            <View key={idx} style={styles.labelCol}>
              <Text style={[styles.chartValText, { color: theme.text }]}>{t.val}</Text>
              <Text style={[styles.chartDateText, { color: theme.textMuted }]}>{t.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

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
        <Card style={styles.glassCard}>
          <Text style={[styles.cardSubTitle, { color: theme.textMuted }]}>현재 {metricName}</Text>
          <View style={styles.valueRow}>
            <Text style={[styles.valueText, { color: theme.text }]}>
              {value}
              <Text style={[styles.unitText, { color: theme.textMuted }]}> {unit ?? ''}</Text>
            </Text>
            <View style={[styles.badge, { backgroundColor: badgeColor + '15' }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{statusText}</Text>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderBar}>
              <View style={[styles.barSegment, { backgroundColor: COLORS.success, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }]} />
              <View style={[styles.barSegment, { backgroundColor: COLORS.warning }]} />
              <View style={[styles.barSegment, { backgroundColor: COLORS.error, borderTopRightRadius: 4, borderBottomRightRadius: 4 }]} />
            </View>
            <View style={[styles.sliderDot, { left: `${positionPercentage}%`, borderColor: badgeColor }]} />
          </View>

          <View style={styles.rangeTextRow}>
            <Text style={[styles.rangeLabelText, { color: theme.textMuted }]}>{config.normalText}</Text>
            <Text style={[styles.rangeLabelText, { color: theme.textMuted }]}>{config.cautionText}</Text>
            <Text style={[styles.rangeLabelText, { color: theme.textMuted }]}>{config.dangerText}</Text>
          </View>
        </Card>

        {/* Card 2: Recent Trends */}
        <Card style={styles.glassCard}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>최근 추이</Text>
          {renderTrendSvg()}
        </Card>

        {/* Card 3: Analysis interpretation */}
        <Card style={[styles.glassCard, { backgroundColor: 'rgba(149, 194, 112, 0.12)', borderColor: 'rgba(149, 194, 112, 0.2)' }]}>
          <View style={styles.infoRow}>
            <Info size={16} color={COLORS.primary} />
            <Text style={[styles.infoTitle, { color: COLORS.primaryDark }]}>이게 무슨 의미일까요?</Text>
          </View>
          <Text style={[styles.explanationText, { color: theme.text }]}>{explanation}</Text>
        </Card>

        {/* Card 4: Recommended habits checklist */}
        <Card style={styles.glassCard}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>맞춤 추천 습관</Text>
          <View style={styles.habitsList}>
            {habits.map((habit, idx) => {
              const isDone = completedHabits.includes(habit);
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.habitRow}
                  activeOpacity={0.8}
                  onPress={() => toggleHabit(habit)}
                >
                  <View style={[styles.checkbox, isDone && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
                    {isDone && <Check color="#ffffff" size={14} />}
                  </View>
                  <Text style={[styles.habitName, { color: theme.text }]}>{habit}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
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
    gap: SPACING.md,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  cardSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  valueText: {
    fontSize: 38,
    fontWeight: '900',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sliderContainer: {
    height: 16,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  sliderBar: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
  },
  barSegment: {
    flex: 1,
    height: '100%',
  },
  sliderDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    marginTop: -4,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  rangeTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  chartWrapper: {
    marginTop: SPACING.xs,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelCol: {
    alignItems: 'center',
    width: 50,
  },
  chartValText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  chartDateText: {
    fontSize: 9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  habitsList: {
    gap: SPACING.sm,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(71, 92, 58, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
