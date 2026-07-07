import apiClient from './client';
import { ApiResponse } from './types';

// 알림 정보 타입 정의
export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  deep_link: string | null;
  created_at: string;
  is_read?: boolean; // 백엔드 기본 데이터셋에 따라 프론트에서 관리할 수도 있음
}

export interface NotificationListResponse {
  items: NotificationItem[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
}

export interface GetNotificationsParams {
  limit?: number;
  offset?: number;
  unread_only?: boolean;
}

export const notificationApi = {
  // 알림 목록 조회
  getNotifications: async (params?: GetNotificationsParams): Promise<ApiResponse<NotificationListResponse>> => {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>('/notifications', {
      params,
    });
    return response.data;
  },

  // 알림 읽음 처리
  markNotificationRead: async (notificationId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch<ApiResponse<void>>(`/notifications/${notificationId}/read`);
    return response.data;
  },
};
