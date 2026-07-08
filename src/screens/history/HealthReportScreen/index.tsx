import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Trash2, X } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './HealthReportScreen.styles';
import { SummaryCard } from './components/SummaryCard';
import { MetricCard } from './components/MetricCard';
import { PlainMetricRow } from './components/PlainMetricRow';
import { useHealthReport } from './hooks/useHealthReport';
import { AnalysisMetricCard } from '@/api';

export default function HealthReportScreen({ navigation, route }: RootStackScreenProps<'HealthReport'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const recordId = route.params?.recordId;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const {
    isLoading,
    dateStr,
    verificationStatus,
    summaryText,
    analysisCards,
    overallTitle,
    overallCounts,
    plainMetrics,
    handleVerify,
    deleteCheckupRecord,
  } = useHealthReport(recordId, () => navigation.goBack());

  const handleDeleteConfirm = async () => {
    setIsDeleteModalVisible(false);
    try {
      const success = await deleteCheckupRecord();
      if (success) {
        navigation.navigate('MainTabs', { screen: 'History' });
      } else {
        setIsErrorModalVisible(true);
      }
    } catch (e) {
      console.error('검진 기록 삭제 에러:', e);
      setIsErrorModalVisible(true);
    }
  };

  // Group analysis cards to combine BP_SYS and BP_DIA into a virtual 'BloodPressure' card
  const groupedCards = React.useMemo(() => {
    const list: AnalysisMetricCard[] = [];
    const systolic = analysisCards.find(c => c.code === 'BP_SYS');
    const diastolic = analysisCards.find(c => c.code === 'BP_DIA');

    if (systolic || diastolic) {
      const worst = [systolic, diastolic].reduce((acc, c) => {
        if (!c) return acc;
        const rank = (s?: string) => (s === 'risk' ? 2 : s === 'caution' ? 1 : 0);
        return !acc || rank(c.status) > rank(acc.status) ? c : acc;
      }, undefined as AnalysisMetricCard | undefined)!;

      list.push({
        code: 'BloodPressure',
        label: '혈압',
        value: systolic?.value ?? diastolic?.value ?? null,
        unit: 'mmHg',
        status: worst.status,
        status_label: worst.status_label,
        value_text: `${systolic?.value ?? '-'}/${diastolic?.value ?? '-'} mmHg`,
        badge_text: worst.badge_text,
        range_bar: systolic?.range_bar ?? diastolic?.range_bar ?? null,
      });
    }

    analysisCards.forEach(c => {
      if (c.code === 'BP_SYS' || c.code === 'BP_DIA') return;
      list.push(c);
    });

    return list;
  }, [analysisCards]);

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
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)}>
              <Trash2 color={COLORS.error} size={22} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Comprehensive Health State */}
        <SummaryCard
          overallTitle={overallTitle}
          normalCount={overallCounts.normal}
          cautionCount={overallCounts.caution}
          riskCount={overallCounts.risk}
          dateStr={dateStr}
          theme={theme}
          summaryText={summaryText}
        />

        {/* List of Metric Cards (검진 결과 상세 - 백분위 그래프 / 정상·비정상 전용 UI) */}
        {groupedCards.map((card) => {
          const handleSelectMetric = () => {
            if (card.code === 'BloodPressure') {
              const systolic = analysisCards.find(c => c.code === 'BP_SYS');
              if (systolic) {
                navigation.navigate('MetricDetail', {
                  recordId: recordId!,
                  metricCode: 'BP_SYS',
                  metricName: '혈압',
                  value: String(systolic.value ?? '-'),
                  unit: 'mmHg',
                });
              }
            } else {
              navigation.navigate('MetricDetail', {
                recordId: recordId!,
                metricCode: card.code,
                metricName: card.label,
                value: String(card.value ?? '-'),
                unit: card.unit,
              });
            }
          };

          return (
            <MetricCard
              key={card.code}
              card={card}
              onPress={handleSelectMetric}
              theme={theme}
            />
          );
        })}

        {/* 신장/성별 등 정상·비정상 판정이 없는 기본 정보 - 그래프 없이 값만 표시 */}
        {plainMetrics.length > 0 && (
          <View style={{ backgroundColor: theme.card, borderRadius: 20, overflow: 'hidden' }}>
            {plainMetrics.map((m, idx) => (
              <PlainMetricRow
                key={m.metric_code}
                label={m.metric_name}
                value={m.value ?? '-'}
                unit={m.unit}
                theme={theme}
                isLast={idx === plainMetrics.length - 1}
              />
            ))}
          </View>
        )}

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
      </ScrollView>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 320, backgroundColor: theme.card || '#ffffff', borderRadius: 24, padding: 24, gap: 16 }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.error + '15', justifyContent: 'center', alignItems: 'center' }}>
                <Trash2 color={COLORS.error} size={28} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginTop: 8 }}>기록 삭제</Text>
              <Text style={{ fontSize: 13, lineHeight: 18, color: theme.textMuted, textAlign: 'center', marginTop: 4 }}>
                정말 이 검진 기록을 삭제하시겠습니까?{'\n'}삭제된 기록은 다시 복구할 수 없습니다.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                style={{ flex: 1, height: 48, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, height: 48, borderRadius: 14, backgroundColor: COLORS.error, justifyContent: 'center', alignItems: 'center' }}
                onPress={handleDeleteConfirm}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>삭제하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deletion Error/Retry Modal */}
      <Modal
        visible={isErrorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsErrorModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 320, backgroundColor: theme.card || '#ffffff', borderRadius: 24, padding: 24, gap: 16, position: 'relative' }}>
            {/* Close Button X */}
            <TouchableOpacity
              style={{ position: 'absolute', right: 16, top: 16, zIndex: 10, padding: 4 }}
              onPress={() => setIsErrorModalVisible(false)}
            >
              <X color={theme.text} size={20} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center', gap: 8, marginTop: 12 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.error + '15', justifyContent: 'center', alignItems: 'center' }}>
                <X color={COLORS.error} size={28} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginTop: 8 }}>삭제 실패</Text>
              <Text style={{ fontSize: 13, lineHeight: 18, color: theme.textMuted, textAlign: 'center', marginTop: 4 }}>
                검진 기록을 삭제하지 못했습니다.{"\n"}다시 시도해 주세요.
              </Text>
            </View>

            <View style={{ gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                style={{ height: 48, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}
                onPress={async () => {
                  setIsErrorModalVisible(false);
                  await handleDeleteConfirm();
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>재시도</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
