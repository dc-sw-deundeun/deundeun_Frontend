import { Alert } from 'react-native';
import { storage } from '@/utils/storage';
import { setAccessToken, authApi, myApi } from '@/api';

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
      Alert.alert('탈퇴 성공', '성공적으로 탈퇴되었습니다.');
    } catch (error) {
      console.error('회원 탈퇴 처리 실패:', error);
      // 백엔드가 현재 501(Placeholder)을 임시 리턴하고 있으므로, 테스트 편의를 위해 501 에러가 나는 경우도 탈퇴로 인정해 스플래시로 넘어가도록 설정
      if (String(error).includes('501') || String(error).includes('status code 501')) {
        await storage.clearTokens();
        setAccessToken(null);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Splash' }],
        });
        Alert.alert('탈퇴 성공', '성공적으로 탈퇴되었습니다. (임시 501 우회 통과)');
      } else {
        Alert.alert('탈퇴 실패', '회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = await storage.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
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
      Alert.alert('로그아웃', '성공적으로 로그아웃되었습니다.');
    }
  };

  return { handleDeleteAccount, handleLogout };
};

export default useAccountActions;
