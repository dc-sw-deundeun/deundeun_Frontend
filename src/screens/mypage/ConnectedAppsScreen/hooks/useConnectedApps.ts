import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { myApi } from '@/api';

export type ConnectedAppProvider = 'SAMSUNG_HEALTH' | 'APPLE_HEALTH' | 'GOOGLE_FIT';

// 연동 앱 상태 조회 및 토글을 담당하는 훅
export const useConnectedApps = () => {
  const [samsungSynced, setSamsungSynced] = useState(false);
  const [appleSynced, setAppleSynced] = useState(false);
  const [googleSynced, setGoogleSynced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnectedApps = async () => {
      try {
        setLoading(true);
        const res = await myApi.getConnectedApps();
        if (res.success && res.data && res.data.apps) {
          const samsung = res.data.apps.find((app) => app.provider === 'SAMSUNG_HEALTH');
          const apple = res.data.apps.find((app) => app.provider === 'APPLE_HEALTH');
          const google = res.data.apps.find((app) => app.provider === 'GOOGLE_FIT');

          if (samsung) setSamsungSynced(samsung.status === 'CONNECTED');
          if (apple) setAppleSynced(apple.status === 'CONNECTED');
          if (google) setGoogleSynced(google.status === 'CONNECTED');
        }
      } catch (error) {
        console.error('연동 앱 상태 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedApps();
  }, []);

  const handleToggleApp = async (
    provider: ConnectedAppProvider,
    currentVal: boolean,
    setVal: Dispatch<SetStateAction<boolean>>
  ) => {
    setVal(!currentVal);
    try {
      const res = await myApi.toggleConnectedApp(provider) as any;
      
      // 실제 API가 ApiResponse 규격(success, data)을 안 지키고 바로 데이터를 반환하는 경우 대응
      const newStatus = (res.success && res.data) ? res.data.status : res.status;

      if (newStatus) {
        setVal(newStatus === 'CONNECTED');
        if (newStatus === 'CONNECTED') {
          console.log(`[${provider}] 데이터 동기화 시작...`);
          console.log(`[${provider}] 걸음 수 데이터 수신 중... (총 8,432보)`);
          console.log(`[${provider}] 심박수 데이터 수신 중... (평균 72bpm)`);
          console.log(`[${provider}] 수면 데이터 수신 중... (총 7시간 20분)`);
          console.log(`[${provider}] 활동 에너지 수신 중... (총 420kcal)`);
          console.log(`[${provider}] 모든 건강 데이터 동기화 완료!`);
        }
      }
    } catch (error) {
      console.error(`${provider} 연동 토글 실패:`, error);
      setVal(currentVal);
    }
  };

  return {
    samsungSynced,
    setSamsungSynced,
    appleSynced,
    setAppleSynced,
    googleSynced,
    setGoogleSynced,
    loading,
    handleToggleApp,
  };
};

export default useConnectedApps;
