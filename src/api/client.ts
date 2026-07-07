import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/constants/config';

console.log('[API Client] Initialized with baseURL:', API_CONFIG.BASE_URL);

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

// Request Interceptor: 요청 시 토큰 자동 포함 및 디버그 로그 출력
apiClient.interceptors.request.use(
  (config) => {
    if (userAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${userAccessToken}`;
    }
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: 공통 에러 핸들링 및 디버그 로그 출력
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`, response.data || '');
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      console.log(`❌ [API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} [${status}]`, error.response.data || '');
      if (status === 401) {
        console.warn('[API] 인증이 만료되었습니다. 다시 로그인해 주세요.');
        // TODO: 토큰 갱신 또는 로그인 화면 전환 로직 처리
      } else if (status >= 500) {
        console.error('[API] 서버 내부 오류가 발생했습니다.');
      }
    } else if (error.request) {
      console.error('[API] 네트워크 응답이 없습니다. 인터넷 연결을 확인해 주세요.', error.request);
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
