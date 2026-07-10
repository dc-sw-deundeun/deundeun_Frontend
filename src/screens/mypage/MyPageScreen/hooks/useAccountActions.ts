import { Alert } from 'react-native';
import { storage } from '@/utils/storage';
import { setAccessToken, authApi, myApi } from '@/api';
import { useAppStore } from '@/store/useAppStore';

// 회원 탈퇴 및 로그아웃 액션을 담당하는 훅
export const useAccountActions = (navigation: any) => {
  const handleDeleteAccount = async () => {
    try {
      await myApi.deleteAccount();
      // 성공 시 토큰 클리어 및 Splash 화면으로 강제 리셋 이동
      await storage.clearTokens();
      setAccessToken(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      });
      useAppStore.getState().showAlert('탈퇴 성공', '성공적으로 탈퇴되었습니다.');
    } catch (error) {
      console.error('회원 탈퇴 처리 실패:', error);
      useAppStore.getState().showAlert('탈퇴 실패', '회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = await storage.getRefreshToken();
      await authApi.logout(refreshToken || '');
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 클라이언트 단의 토큰 초기화 및 스플래시 화면 리다이렉트
      await storage.clearTokens();
      setAccessToken(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      });
      useAppStore.getState().showAlert('로그아웃', '성공적으로 로그아웃되었습니다.');
    }
  };

  return { handleDeleteAccount, handleLogout };
};

export default useAccountActions;
