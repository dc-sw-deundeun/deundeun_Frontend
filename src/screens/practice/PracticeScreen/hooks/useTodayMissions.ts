import { useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { missionApi } from '@/api';
import { DailyMission } from '../types';

// 오늘의 미션 목록 조회 및 인증 처리를 담당하는 훅
export const useTodayMissions = () => {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [streakDays] = useState(27);
  const [loading, setLoading] = useState(true);

  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState<number | null>(null);

  const loadTodayMissions = async () => {
    try {
      setLoading(true);
      const res = await missionApi.getTodayMissions();
      if (res.success && res.data) {
        const mapped = res.data.items.map((item) => ({
          id: item.mission_id,
          title: item.title,
          category: item.rationale || item.category || '오늘의 건강 실천',
          completed: item.status === 'COMPLETED',
          xp: item.xp_reward,
        }));
        setMissions(mapped);
      }
    } catch (error) {
      console.error('오늘의 미션 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 포커스 시 실시간 미션 리스트 조회
  useFocusEffect(
    React.useCallback(() => {
      loadTodayMissions();
    }, [])
  );

  const completedCount = missions.filter((m) => m.completed).length;

  const handleVerifyPress = (id: number) => {
    setActiveMissionId(id);
    setIsVerifyModalVisible(true);
  };

  const handleCompleteVerification = async () => {
    if (activeMissionId !== null) {
      try {
        setLoading(true);
        await missionApi.completeMission(activeMissionId);
        setIsVerifyModalVisible(false);
        Alert.alert('미션 인증 완료', '미션 인증이 완료되어 XP가 지급되었습니다!');

        // 목록 다시 로드하여 완료 상태 업데이트
        await loadTodayMissions();
      } catch (error) {
        console.error('미션 인증 실패:', error);
        Alert.alert('오류', '미션 인증 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelVerification = () => {
    setIsVerifyModalVisible(false);
  };

  return {
    missions,
    streakDays,
    completedCount,
    isVerifyModalVisible,
    handleVerifyPress,
    handleCompleteVerification,
    handleCancelVerification,
  };
};

export default useTodayMissions;
