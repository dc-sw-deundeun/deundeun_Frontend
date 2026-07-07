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
import { useHealthReport } from './hooks/useHealthReport';
import { mapStatusToKorean } from './utils';

export default function HealthReportScreen({ navigation, route }: RootStackScreenProps<'HealthReport'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const recordId = route.params?.recordId;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const {
    isLoading,
    metrics,
    dateStr,
    verificationStatus,
    summaryText,
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

  const cautionCount = metrics.filter(m => {
    const ko = mapStatusToKorean(m.status);
    return ko === '주의' || ko === '경계';
  }).length;

  const normalCount = metrics.filter(m => {
    const ko = mapStatusToKorean(m.status);
    return ko === '정상';
  }).length;

  // Group metrics to combine SystolicBP and DiastolicBP into a virtual 'BloodPressure' metric
  const groupedMetrics = React.useMemo(() => {
    const list: any[] = [];
    const systolic = metrics.find(m => m.metric_code === 'SystolicBP');
    const diastolic = metrics.find(m => m.metric_code === 'DiastolicBP');

    // Process combined Blood Pressure
    if (systolic || diastolic) {
      const bpVal = `${systolic?.value ?? '-'}/${diastolic?.value ?? '-'}`;
      const bpStatus = (systolic?.status === 'DANGER' || diastolic?.status === 'DANGER')
        ? 'DANGER'
        : (systolic?.status === 'WARNING' || diastolic?.status === 'WARNING' || systolic?.status === 'CAUTION' || diastolic?.status === 'CAUTION')
          ? 'WARNING'
          : 'NORMAL';

      list.push({
        metric_code: 'BloodPressure',
        metric_name: '혈압',
        value: bpVal,
        unit: 'mmHg',
        status: bpStatus,
        systolicValue: systolic ? parseFloat(systolic.value || '0') : undefined,
      });
    }

    // Process other metrics (excluding BP sub-metrics)
    metrics.forEach(m => {
      if (m.metric_code === 'SystolicBP' || m.metric_code === 'DiastolicBP') return;
      list.push(m);
    });

    return list;
  }, [metrics]);

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
          cautionCount={cautionCount}
          normalCount={normalCount}
          dateStr={dateStr}
          theme={theme}
          summaryText={summaryText}
        />

        {/* List of Metric Cards */}
        {groupedMetrics.map((item) => {
          const handleSelectMetric = () => {
            if (item.metric_code === 'BloodPressure') {
              const systolic = metrics.find(m => m.metric_code === 'SystolicBP');
              if (systolic) {
                navigation.navigate('MetricDetail', {
                  recordId: recordId!,
                  metricCode: 'SystolicBP',
                  metricName: '혈압',
                  value: systolic.value ?? '-',
                  unit: 'mmHg',
                });
              }
            } else {
              navigation.navigate('MetricDetail', {
                recordId: recordId!,
                metricCode: item.metric_code,
                metricName: item.metric_name,
                value: item.value ?? '-',
                unit: item.unit,
              });
            }
          };

          return (
            <MetricCard
              key={item.metric_code}
              metricName={item.metric_name}
              metricCode={item.metric_code}
              value={item.value ?? '-'}
              unit={item.unit}
              status={item.status}
              onPress={handleSelectMetric}
              theme={theme}
              systolicValue={item.systolicValue}
            />
          );
        })}

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
