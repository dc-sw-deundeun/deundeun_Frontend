import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { authApi, myApi } from '@/api';

// 프로필 정보 및 알림 설정 조회/토글을 담당하는 훅
export const useMyPageSettings = () => {
  const [nickname, setNickname] = useState('사용자');
  const [email, setEmail] = useState('');
  const [dietAlert, setDietAlert] = useState(true);
  const [missionAlert, setMissionAlert] = useState(true);
  const [recordAlert, setRecordAlert] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUserDataAndSettings = async () => {
        try {
          setLoading(true);
          // 사용자 정보 조회
          const userRes = await authApi.getMe();
          if (userRes.success && userRes.data) {
            setNickname(userRes.data.nickname || '사용자');
            setEmail(userRes.data.email || '');
          }

          // 알림 설정 조회
          const settingsRes = await myApi.getNotificationSettings();
          if (settingsRes.success && settingsRes.data) {
            setDietAlert(settingsRes.data.email_alarm_enabled);
            setMissionAlert(settingsRes.data.mission_alarm_enabled);
            setRecordAlert(settingsRes.data.record_alarm_enabled);
            setWeeklyReport(settingsRes.data.push_alarm_enabled);
          }
        } catch (error) {
          console.error('[MyPageScreen] 데이터 로드 실패:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDataAndSettings();
    }, [])
  );

  const handleToggleDietAlert = async (value: boolean) => {
    setDietAlert(value);
    try {
      await myApi.updateNotificationSettings({ email_alarm_enabled: value });
    } catch (error) {
      console.error('식단 알림 설정 변경 실패:', error);
      setDietAlert(!value);
    }
  };

  const handleToggleMissionAlert = async (value: boolean) => {
    setMissionAlert(value);
    try {
      await myApi.updateNotificationSettings({ mission_alarm_enabled: value });
    } catch (error) {
      console.error('미션 알림 설정 변경 실패:', error);
      setMissionAlert(!value);
    }
  };

  const handleToggleRecordAlert = async (value: boolean) => {
    setRecordAlert(value);
    try {
      await myApi.updateNotificationSettings({ record_alarm_enabled: value });
    } catch (error) {
      console.error('기록 알림 설정 변경 실패:', error);
      setRecordAlert(!value);
    }
  };

  const handleToggleWeeklyReport = async (value: boolean) => {
    setWeeklyReport(value);
    try {
      await myApi.updateNotificationSettings({ push_alarm_enabled: value });
    } catch (error) {
      console.error('주간 리포트 알림 설정 변경 실패:', error);
      setWeeklyReport(!value);
    }
  };

  return {
    nickname,
    email,
    dietAlert,
    missionAlert,
    recordAlert,
    weeklyReport,
    handleToggleDietAlert,
    handleToggleMissionAlert,
    handleToggleRecordAlert,
    handleToggleWeeklyReport,
  };
};

export default useMyPageSettings;
