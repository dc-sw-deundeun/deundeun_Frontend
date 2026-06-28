// API base URL configuration
// 환경(개발/운영)에 맞춰 BASE_URL을 변경해 사용합니다.
// 로컬 테스트 시 Android 에뮬레이터는 10.0.2.2, iOS 시뮬레이터는 localhost / 127.0.0.1, 실기기는 PC의 IP 주소를 사용합니다.
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
};
