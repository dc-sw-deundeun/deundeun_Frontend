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
    } catch (e) {
      console.warn('검진 결과 상세 로드 실패:', e);
      Alert.alert('오류', '검진 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!recordId) return;
    try {
      const res = await recordsApi.verifyCheckup(recordId);
      if (res.success) {
        setVerificationStatus('VERIFIED');
        Alert.alert('검수 완료', '사용자 확인이 완료되어 검진 기록이 VERIFIED 상태로 전환되었습니다.');
      } else {
        Alert.alert('오류', res.message || '검수 전환에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '검수 처리 중 서버 통신에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    Alert.alert('기록 삭제', '정말 이 검진 기록을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await recordsApi.deleteCheckup(recordId);
            if (res.success) {
              Alert.alert('삭제 완료', '검진 기록이 성공적으로 삭제되었습니다.', [
                {
                  text: '확인',
                  onPress: onDeleted,
                },
              ]);
            }
          } catch {
            Alert.alert('오류', '기록 삭제 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
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
    handleVerify,
    handleDelete,
    handleAddMission,
  };
};

export default useHealthReport;
