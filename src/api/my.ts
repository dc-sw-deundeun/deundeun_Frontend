import apiClient from './client';
import { ApiResponse } from './types';

// 1. 연동 앱 관련 타입
export interface ConnectedAppStatus {
  provider: string; // 'APPLE_HEALTH' | 'SAMSUNG_HEALTH' | 'GOOGLE_FIT'
  status: string;   // 'CONNECTED' | 'DISCONNECTED'
}

export interface ConnectedAppsResponse {
  apps: ConnectedAppStatus[];
}

// 2. 알림 설정 관련 타입
export interface NotificationSettingsResponse {
  mission_alarm_enabled: boolean;
  record_alarm_enabled: boolean;
  email_alarm_enabled: boolean;
  push_alarm_enabled: boolean;
}

export interface NotificationSettingsUpdateRequest {
  mission_alarm_enabled?: boolean | null;
  record_alarm_enabled?: boolean | null;
  email_alarm_enabled?: boolean | null;
  push_alarm_enabled?: boolean | null;
}

export const myApi = {
  // 연동 앱 목록 조회
  getConnectedApps: async (): Promise<ApiResponse<ConnectedAppsResponse>> => {
    const response = await apiClient.get<ApiResponse<ConnectedAppsResponse>>('/my/connected-apps');
    return response.data;
  },

  // 연동 앱 상태 토글 (CONNECTED <-> DISCONNECTED)
  toggleConnectedApp: async (provider: string): Promise<ApiResponse<ConnectedAppStatus>> => {
    const response = await apiClient.patch<ApiResponse<ConnectedAppStatus>>(`/my/connected-apps/${provider}`);
    return response.data;
  },

  // 알림 설정 조회
  getNotificationSettings: async (): Promise<ApiResponse<NotificationSettingsResponse>> => {
    const response = await apiClient.get<ApiResponse<NotificationSettingsResponse>>('/my/notification-settings');
    return response.data;
  },

  // 알림 설정 업데이트
  updateNotificationSettings: async (
    settings: NotificationSettingsUpdateRequest
  ): Promise<ApiResponse<NotificationSettingsResponse>> => {
    const response = await apiClient.patch<ApiResponse<NotificationSettingsResponse>>(
      '/my/notification-settings',
      settings
    );
    return response.data;
  },

  // 회원 탈퇴
  deleteAccount: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>('/my/account');
    return response.data;
  },
};
