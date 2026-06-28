import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/constants/config';

// Axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 메모리 또는 SecureStore / AsyncStorage 등에서 인증 토큰 관리용 변수
let userAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  userAccessToken = token;
};

export const getAccessToken = () => userAccessToken;

// Request Interceptor: 요청 시 토큰 자동 포함
apiClient.interceptors.request.use(
  (config) => {
    if (userAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${userAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 공통 에러 핸들링 (401 토큰 만료 등)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('[API] 인증이 만료되었습니다. 다시 로그인해 주세요.');
        // TODO: 토큰 갱신 또는 로그인 화면 전환 로직 처리
      } else if (status >= 500) {
        console.error('[API] 서버 내부 오류가 발생했습니다.');
      }
    } else if (error.request) {
      console.error('[API] 네트워크 응답이 없습니다. 인터넷 연결을 확인해 주세요.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
