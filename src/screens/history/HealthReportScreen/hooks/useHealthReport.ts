import { useState, useEffect } from 'react';
import { recordsApi, MetricResponse, AnalysisMetricCard } from '@/api';
import { useAppStore } from '@/store/useAppStore';

// 검진 결과 상세 보고서의 데이터 조회 및 액션(검수/삭제/미션추가)을 담당하는 훅
export const useHealthReport = (recordId: number | undefined, onDeleted: () => void) => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricResponse[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('UNVERIFIED');
  const [addedMissions, setAddedMissions] = useState<string[]>([]);
  const [summaryText, setSummaryText] = useState('');
  const [analysisCards, setAnalysisCards] = useState<AnalysisMetricCard[]>([]);
  const [overallTitle, setOverallTitle] = useState('');
  const [overallCounts, setOverallCounts] = useState({ normal: 0, caution: 0, risk: 0, unknown: 0 });
  // 분석 결과(canonical_test_code)로 판정되지 않아 그래프/배지 없이 값만 보여줘야 하는 원본 항목 (예: 신장, 성별)
  const [plainMetrics, setPlainMetrics] = useState<MetricResponse[]>([]);

  useEffect(() => {
    if (recordId) {
      loadRecordDetail();
    } else {
      setIsLoading(false);
    }
  }, [recordId]);

  const loadRecordDetail = async () => {
    setIsLoading(true);
    let rawMetrics: MetricResponse[] = [];
    try {
      const res = await recordsApi.getCheckup(recordId!);
      if (res.success && res.data) {
        rawMetrics = res.data.metrics || [];
        setMetrics(rawMetrics);
        setDateStr(res.data.measured_at || res.data.created_at || '');
        setVerificationStatus(res.data.verification_status || 'UNVERIFIED');
      }

      // 응답값(ui.summary) 기반으로 카드 목록/종합 소견을 구성
      try {
        const analysisRes = await recordsApi.getCheckupAnalysis(recordId!);
        if (analysisRes.success && analysisRes.data) {
          const analysisData = analysisRes.data;
          const summary = analysisData.ui?.summary;
          setSummaryText(analysisData.explanation?.summary || summary?.overall?.summary || '');
          setAnalysisCards(summary?.cards || []);
          setOverallTitle(summary?.overall?.title || '');
          setOverallCounts(summary?.overall?.counts || { normal: 0, caution: 0, risk: 0, unknown: 0 });

          // 분석 결과에 포함되지 않은 원본 항목(신장/성별 등)만 그래프 없는 일반 값으로 남김
          const classifiedInputLabels = new Set((analysisData.results || []).map((r: any) => r.input_label));
          setPlainMetrics(rawMetrics.filter(m => !classifiedInputLabels.has(m.metric_name)));
        } else {
          setPlainMetrics(rawMetrics);
        }
      } catch (e) {
        console.warn('검진 결과 분석 로드 실패:', e);
        setPlainMetrics(rawMetrics);
      }
    } catch (e) {
      console.warn('검진 결과 상세 로드 실패:', e);
      useAppStore.getState().showAlert('오류', '검진 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!recordId) return;
    try {
      const analysisMetrics = metrics.map(m => ({
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
        useAppStore.getState().showAlert('저장 완료', '사용자 확인이 완료되어 검진 기록이 저장되었습니다.');
      } else {
        useAppStore.getState().showAlert('오류', res.message || '저장에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      useAppStore.getState().showAlert('오류', '검수 처리 중 서버 통신에 실패했습니다.');
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
    useAppStore.getState().showAlert('미션 추가 완료', `"${missionName}"이(가) 오늘의 미션으로 추가되었습니다!`);
  };

  return {
    isLoading,
    metrics,
    dateStr,
    verificationStatus,
    addedMissions,
    summaryText,
    analysisCards,
    overallTitle,
    overallCounts,
    plainMetrics,
    handleVerify,
    deleteCheckupRecord,
    handleAddMission,
  };
};

export default useHealthReport;
