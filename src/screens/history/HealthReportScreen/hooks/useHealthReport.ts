import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { recordsApi, MetricResponse } from '@/api';

// 검진 결과 상세 보고서의 데이터 조회 및 액션(검수/삭제/미션추가)을 담당하는 훅
export const useHealthReport = (recordId: number | undefined, onDeleted: () => void) => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricResponse[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('UNVERIFIED');
  const [addedMissions, setAddedMissions] = useState<string[]>([]);
  const [summaryText, setSummaryText] = useState('');

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

      // Fetch the analysis summary to display under the comprehensive opinion card
      try {
        const analysisRes = await recordsApi.getCheckupAnalysis(recordId!);
        if (analysisRes.success && analysisRes.data) {
          const analysisData = analysisRes.data.analysis || analysisRes.data || {};
          const explSummary = analysisData.explanation?.summary || analysisData.ui?.summary?.overall?.summary || '';
          setSummaryText(explSummary);
        }
      } catch (e) {
        console.warn('검진 결과 분석 로드 실패:', e);
      }
    } catch (e) {
      console.warn('검진 결과 상세 로드 실패:', e);
      Alert.alert('오류', '검진 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!recordId || !recordData) return;
    try {
      const analysisMetrics = recordData.metrics.map(m => ({
        metric_code: m.metric_code,
        metric_name: m.metric_name,
        value: String(m.value || ''),
        unit: m.unit || '',
        raw_text: String(m.value || ''),
      }));
      
      const res = await recordsApi.analyzeCheckup({
        record_id: recordId,
        sex: 'male',
        measured_at: new Date().toISOString().split('T')[0],
        metrics: analysisMetrics,
      });
      
      if (res.success) {
        setVerificationStatus('VERIFIED');
        Alert.alert('저장 완료', '사용자 확인이 완료되어 검진 기록이 저장되었습니다.');
      } else {
        Alert.alert('오류', res.message || '저장에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '검수 처리 중 서버 통신에 실패했습니다.');
    }
  };

  const deleteCheckupRecord = async (): Promise<boolean> => {
    if (!recordId) return false;
    try {
      const res = await recordsApi.deleteCheckup(recordId);
      if (res.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('검진 기록 삭제 중 오류:', error);
      throw error;
    }
  };

  const handleAddMission = (missionName: string) => {
    if (addedMissions.includes(missionName)) return;
    setAddedMissions((prev) => [...prev, missionName]);
    Alert.alert('미션 추가 완료', `"${missionName}"이(가) 오늘의 미션으로 추가되었습니다!`);
  };

  return {
    isLoading,
    metrics,
    dateStr,
    verificationStatus,
    addedMissions,
    summaryText,
    handleVerify,
    deleteCheckupRecord,
    handleAddMission,
  };
};

export default useHealthReport;
