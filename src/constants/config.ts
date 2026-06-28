// API base URL configuration
// 백엔드 스웨거 기준: http://localhost:8000/docs (Prefix: /api/v1)
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
};
