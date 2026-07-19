import { Platform } from 'react-native';

export const API_CONFIG = {
  BASE_URL: (Platform.OS === 'web' && process.env.NODE_ENV === 'production') ? '/api/v1' : (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1'),
  TIMEOUT: 60000,
};

console.log('🔌 [API Client Configured] BASE_URL:', API_CONFIG.BASE_URL);
