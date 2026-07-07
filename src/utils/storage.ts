import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@deundeun_access_token';
const REFRESH_TOKEN_KEY = '@deundeun_refresh_token';
const AUTO_LOGIN_KEY = '@deundeun_auto_login';

export const storage = {
  // 토큰 저장 (자동 로그인 여부 함께)
  saveTokens: async (accessToken: string, refreshToken?: string, isAutoLogin: boolean = true) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      await AsyncStorage.setItem(AUTO_LOGIN_KEY, JSON.stringify(isAutoLogin));
    } catch (e) {
      console.error('토큰 저장 실패:', e);
    }
  },

  // 저장된 액세스 토큰 조회
  getAccessToken: async (): Promise<string | null> => {
    try {
      const isAutoLogin = await AsyncStorage.getItem(AUTO_LOGIN_KEY);
      if (isAutoLogin && JSON.parse(isAutoLogin) === true) {
        return await AsyncStorage.getItem(TOKEN_KEY);
      }
      return null;
    } catch (e) {
      console.error('토큰 조회 실패:', e);
      return null;
    }
  },

  // 저장된 리프레시 토큰 조회
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error('리프레시 토큰 조회 실패:', e);
      return null;
    }
  },

  // 토큰 및 자동 로그인 정보 삭제 (로그아웃 시)
  clearTokens: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(AUTO_LOGIN_KEY);
    } catch (e) {
      console.error('토큰 삭제 실패:', e);
    }
  },
};
