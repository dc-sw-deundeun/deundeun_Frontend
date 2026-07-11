import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import ScreenHeader from '@/components/ScreenHeader';
import { recordsApi, MetricItem, onboardingApi } from '@/api';
import { styles } from './CheckupResultScreen.styles';
import { TriangleAlert } from 'lucide-react-native';

export default function CheckupResultScreen({ route, navigation }: RootStackScreenProps<'CheckupResult'>) {
  const { isDarkMode, showConfirm, showAlert } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (route.params?.data?.metrics) {
      setMetrics(route.params.data.metrics);
    }
  }, [route.params]);

  const updateMetric = (index: number, val: string) => {
    const newMetrics = [...metrics];
    newMetrics[index].value = Number(val);
    setMetrics(newMetrics);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { ocr_status = 'COMPLETED', content_hash = 'dummy_hash', failed_pages = [] } = route.params?.data || {};

      // Map local MetricItem to API CommitMetricRequest
      const apiMetrics = metrics.map((m, idx) => ({
        metric_code: m.metric_code,
        metric_name: m.metric_name,
        value: String(m.value),
        unit: m.unit || null,
        is_edited: true, // Mark as edited if we want to be safe, or just true since user confirmed
        page_index: 0,
      }));

      // 2단계: 결과 저장 및 레코드 생성 (Commit)
      const commitRes = await recordsApi.commitCheckup({
        ocr_status,
        failed_pages,
        content_hash,
        metrics: apiMetrics,
      });

      const recordId = commitRes?.data?.record_id || (commitRes as any)?.record_id;

      if (recordId) {
        // 3단계: 검진 결과 분석 및 기록 최종 저장 (Analyses)
        const analysisMetrics = metrics.map(m => ({
          metric_code: m.metric_code,
          metric_name: m.metric_name,
          value: String(m.value),
          unit: m.unit || '',
          raw_text: String(m.value), // OCR raw_text fallback
        }));

        await recordsApi.analyzeCheckup({
          record_id: recordId,
          sex: 'male', // 기본값 (추후 연동 필요)
          measured_at: new Date().toISOString().split('T')[0], // 오늘 날짜 기본값
          metrics: analysisMetrics,
        });
      } else {
        console.warn('record_id가 없습니다. 분석 단계를 건너뜁니다.');
      }

      // (제거됨: onboardingApi.completeOnboarding() - 온보딩은 별도 처리)

      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: { screen: 'History' },
          },
        ],
      });
    } catch (error: any) {
      setIsLoading(false);
      showAlert(
        '분석 실패 안내',
        '일시적인 오류로 인해 분석에 실패하였습니다.\n잠시 후 다시 시도해 주세요.\n\n(홈 화면의 [기록] 탭에서 나중에\n다시 시도하실 수 있습니다.)',
        () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
          });
        }
      );
      console.error('Commit Checkup Error:', error);
      if (error.response?.data) {
        console.error('👉 서버 응답 전체 상세(Error Details):', JSON.stringify(error.response.data, null, 2));
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader title="STEP 02. 검진 결과 확인" onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>결과가 맞는지 확인해 주세요</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              잘못 입력된 정보가 있다면 터치해서 수정할 수 있어요.
            </Text>
          </View>

          <View style={styles.metricsContainer}>
            {metrics.map((item, index) => (
              <View key={index} style={[styles.metricRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.metricName, { color: theme.text }]}>{item.metric_name}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
                    keyboardType="numeric"
                    value={item.value.toString()}
                    onChangeText={(val) => updateMetric(index, val)}
                  />
                  <Text style={[styles.metricUnit, { color: theme.textMuted }]}>{item.unit}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: !isLoading ? COLORS.primary : theme.disabledBg }
            ]}
            disabled={isLoading || metrics.length === 0}
            onPress={handleSave}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={[
                styles.submitButtonText,
                { color: !isLoading ? '#ffffff' : theme.disabledText }
              ]}>
                결과 저장 완료
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>


    </SafeAreaView>
  );
}
