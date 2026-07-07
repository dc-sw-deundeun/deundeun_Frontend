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
      const res = await myApi.toggleConnectedApp(provider);
      if (res.success && res.data) {
        setVal(res.data.status === 'CONNECTED');
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
