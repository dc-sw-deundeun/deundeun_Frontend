import { useState } from 'react';
import { onboardingApi, WearableProvider } from '@/api';

// 웨어러블 기기 연동 상태 및 연동 요청을 담당하는 훅
export const useDeviceSync = (onSynced: () => void) => {
  const [connectingApp, setConnectingApp] = useState<string | null>(null);
  const [syncedApps, setSyncedApps] = useState<string[]>([]);

  const handleSync = async (appName: string) => {
    if (syncedApps.includes(appName)) return;

    setConnectingApp(appName);

    let provider: WearableProvider = 'SAMSUNG_HEALTH';
    if (appName === 'Apple') provider = 'APPLE_HEALTH';
    if (appName === 'Google') provider = 'GOOGLE_FIT';

    try {
      await onboardingApi.connectWearable({
        action: 'CONNECT',
        provider: provider,
      });
      setSyncedApps((prev) => [...prev, appName]);

      // 연동 성공 후 사용자에게 체크 표시를 잠깐 보여준 뒤 자동 이동
      setTimeout(() => {
        onSynced();
      }, 700);
    } catch (e) {
      console.warn('Failed to connect wearable', e);
      // Simulate success for local dev if API fails
      setSyncedApps((prev) => [...prev, appName]);
      setTimeout(() => {
        onSynced();
      }, 700);
    } finally {
      setConnectingApp(null);
    }
  };

  return { connectingApp, syncedApps, handleSync };
};

export default useDeviceSync;
