import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { recordsApi, MetricResponse } from '@/api';

type EditState = Record<number, string>; // metric_id → edited value

// 검진 지표 조회, 수정 상태 관리, 저장을 담당하는 훅
export const useEditRecord = (recordId: number, onSaved: () => void) => {
  const [metrics, setMetrics] = useState<MetricResponse[]>([]);
  const [editState, setEditState] = useState<EditState>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, [recordId]);

  const loadMetrics = async () => {
    setIsLoadingData(true);
    try {
      const res = await recordsApi.getCheckup(recordId);
      if (res.success && res.data) {
        const items = res.data.metrics as MetricResponse[];
        setMetrics(items);
        const initial: EditState = {};
        items.forEach(m => {
          initial[m.metric_id] = m.value ?? '';
        });
        setEditState(initial);
      }
    } catch {
      Alert.alert('오류', '지표를 불러오지 못했습니다.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async () => {
    const changed = metrics
      .filter(m => {
        const edited = editState[m.metric_id]?.trim();
        return edited !== '' && edited !== (m.value ?? '');
      })
      .map(m => ({
        metric_id: m.metric_id,
        value: editState[m.metric_id].trim(),
        unit: m.unit ?? null,
      }));

    if (changed.length === 0) {
      Alert.alert('변경 없음', '수정된 항목이 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await recordsApi.bulkUpdateMetrics(recordId, changed);
      if (res.success) {
        Alert.alert('수정 완료', `${changed.length}개 지표가 업데이트됐습니다.`, [
          {
            text: '확인',
            onPress: onSaved,
          },
        ]);
      } else {
        Alert.alert('오류', '수정에 실패했습니다.');
      }
    } catch {
      Alert.alert('오류', '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    metrics,
    editState,
    setEditState,
    isLoadingData,
    isSaving,
    handleSave,
  };
};

export default useEditRecord;
