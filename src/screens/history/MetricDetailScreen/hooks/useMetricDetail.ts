import { useState, useEffect } from 'react';
import { recordsApi } from '@/api';
import { getDefaultExplanation, getDefaultHabits } from '../constants';

// 지표 상세(추이/해석/추천습관) 데이터 조회를 담당하는 훅
export const useMetricDetail = (recordId: number, metricCode: string, numValue: number) => {
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

  return { isLoading, trends, explanation, habits, completedHabits, toggleHabit };
};

export default useMetricDetail;
