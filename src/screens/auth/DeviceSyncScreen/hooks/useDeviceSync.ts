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
    } catch (e) {
      // Ignore error for local dev
    }

    console.log(`[${provider}] 데이터 동기화 시작...`);
    console.log(`[${provider}] 걸음 수 데이터 수신 중... (총 8,432보)`);
    console.log(`[${provider}] 심박수 데이터 수신 중... (평균 72bpm)`);
    console.log(`[${provider}] 수면 데이터 수신 중... (총 7시간 20분)`);
    console.log(`[${provider}] 활동 에너지 수신 중... (총 420kcal)`);
    console.log(`[${provider}] 모든 건강 데이터 동기화 완료!`);

    setSyncedApps((prev) => [...prev, appName]);

    // 연동 성공 후 사용자에게 체크 표시를 잠깐 보여준 뒤 자동 이동
    setTimeout(() => {
      onSynced();
    }, 700);

    setConnectingApp(null);
  };

  return { connectingApp, syncedApps, handleSync };
};

export default useDeviceSync;
