import { useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { missionApi } from '@/api';
import { DailyMission } from '../types';
import { useAppStore } from '@/store/useAppStore';
import { WeeklyStatisticsResponse, MissionSummaryResponse } from '@/api/mission';

// 오늘의 미션 목록 조회 및 인증 처리를 담당하는 훅
export const useTodayMissions = () => {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatisticsResponse | null>(null);
  const [summaryStats, setSummaryStats] = useState<MissionSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeMissionId, setActiveMissionId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [todayRes, weeklyRes, summaryRes] = await Promise.all([
        missionApi.getTodayMissions(),
        missionApi.getWeeklyStatistics(),
        missionApi.getMissionSummary(),
      ]);

      if (todayRes.success && todayRes.data) {
        const mapped = todayRes.data.items.map((item) => ({
          id: item.mission_id,
          title: item.title,
          category: item.rationale || item.category || '오늘의 건강 실천',
          completed: item.status === 'COMPLETED',
          xp: item.xp_reward,
          missionType: item.category || item.mission_type || 'activity',
        }));
        setMissions(mapped);
      }

      if (weeklyRes.success && weeklyRes.data) {
        setWeeklyStats(weeklyRes.data);
      }

      if (summaryRes.success && summaryRes.data) {
        setSummaryStats(summaryRes.data);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 포커스 시 실시간 데이터 조회
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const completedCount = missions.filter((m) => m.completed).length;

  const handleVerifyPress = async (id: number) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;
    
    if (mission.completed) {
      useAppStore.getState().showConfirm(
        '인증 취소',
        '미션 인증을 취소하시겠습니까?',
        async () => {
          try {
            setLoading(true);
            await missionApi.cancelMissionComplete(id);
            await loadData();
          } catch (error) {
            console.error('미션 인증 취소 실패:', error);
            useAppStore.getState().showAlert('오류', '미션 인증 취소 처리 중 오류가 발생했습니다.');
          } finally {
            setLoading(false);
          }
        }
      );
      return;
    }

    try {
      setLoading(true);
      await missionApi.completeMission(id);
      useAppStore.getState().showAlert('미션 인증 완료', '미션 인증이 완료되어 XP가 지급되었습니다!');

      // 데이터 다시 로드
      await loadData();
    } catch (error) {
      console.error('미션 인증 실패:', error);
      useAppStore.getState().showAlert('오류', '미션 인증 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    missions,
    weeklyStats,
    summaryStats,
    completedCount,
    handleVerifyPress,
  };
};

export default useTodayMissions;
