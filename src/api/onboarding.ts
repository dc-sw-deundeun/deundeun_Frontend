import apiClient from './client';
import { ApiResponse } from './types';

export type WearableAction = 'CONNECT' | 'SKIP';
export type WearableProvider = 'APPLE_HEALTH' | 'SAMSUNG_HEALTH' | 'GOOGLE_FIT';

export interface WearableConnectRequest {
  action: WearableAction;
  provider?: WearableProvider;
}

export interface OnboardingStatusResponse {
  current_step: 'CONSENT' | 'WEARABLE' | 'CHECKUP_OCR' | 'COMPLETED';
}

export const onboardingApi = {
  getStatus: async (): Promise<ApiResponse<OnboardingStatusResponse>> => {
    const response = await apiClient.get<ApiResponse<OnboardingStatusResponse>>('/onboarding/status');
    return response.data;
  },
  
  connectWearable: async (data: WearableConnectRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/onboarding/wearable', data);
    return response.data;
  },

  completeOnboarding: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/onboarding/complete');
    return response.data;
  },
};
