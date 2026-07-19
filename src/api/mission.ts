import apiClient from './client';
import { ApiResponse } from './types';

// 미션 실행 정보
export interface MissionExecution {
  when: string;
  duration_min: number;
}

// 미션 상세 구조 타입
export interface MissionItem {
  mission_id: number;
  template_code: string;
  title: string;
  status: 'ASSIGNED' | 'COMPLETED';
  assigned_date: string;
  xp_reward: number;
  completed_at: string | null;
  source_record_id: number | null;
  rationale: string;
  mission_type: string;
  difficulty: number;
  execution: MissionExecution;
  grounded_on: string[];
  source: string;
  description: string | null;
  category: string | null;
  verification_mode: string | null;
}

// GET /missions/today 응답 구조 (날짜별 조회에도 재사용)
export interface TodayMissionsResponse {
  date: string;
  total: number;
  completed: number;
  items: MissionItem[];
}

// GET /missions/calendar 응답 구조
export interface CalendarDay {
  date: string;
  total: number;
  completed: number;
}

export interface MissionCalendarResponse {
  year: number;
  month: number;
  days: CalendarDay[];
}

// GET /missions/statistics/weekly 응답 구조
export interface WeeklyStatisticsResponse {
  week_start: string;
  week_end: string;
  total: number;
  completed: number;
  days: CalendarDay[];
}

// GET /missions/statistics/summary 응답 구조
export interface MissionSummaryResponse {
  total_assigned: number;
  total_completed: number;
  completion_rate: number;
}

export const missionApi = {
  // 오늘 배정된 미션 목록 조회
  getTodayMissions: async (): Promise<ApiResponse<TodayMissionsResponse>> => {
    const response = await apiClient.get<ApiResponse<TodayMissionsResponse>>('/missions/today');
    return response.data;
  },

  // 날짜별 미션 조회
  getMissionsByDate: async (targetDate: string): Promise<ApiResponse<TodayMissionsResponse>> => {
    const response = await apiClient.get<ApiResponse<TodayMissionsResponse>>(`/missions/date/${targetDate}`);
    return response.data;
  },

  // 월간 미션 캘린더
  getMissionCalendar: async (year: number, month: number): Promise<ApiResponse<MissionCalendarResponse>> => {
    const response = await apiClient.get<ApiResponse<MissionCalendarResponse>>('/missions/calendar', { params: { year, month } });
    return response.data;
  },

  // 주간 미션 통계
  getWeeklyStatistics: async (date?: string): Promise<ApiResponse<WeeklyStatisticsResponse>> => {
    const response = await apiClient.get<ApiResponse<WeeklyStatisticsResponse>>('/missions/statistics/weekly', { params: { date } });
    return response.data;
  },

  // 미션 총 완료 통계
  getMissionSummary: async (): Promise<ApiResponse<MissionSummaryResponse>> => {
    const response = await apiClient.get<ApiResponse<MissionSummaryResponse>>('/missions/statistics/summary');
    return response.data;
  },

  // 미션 완료 (self-report)
  completeMission: async (missionId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/missions/${missionId}/complete`);
    return response.data;
  },

  // 미션 완료 취소
  cancelMissionComplete: async (missionId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/missions/${missionId}/complete`);
    return response.data;
  },

  // 미션 알림 발송 (테스트용)
  sendMissionNotification: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/missions/notifications/send');
    return response.data;
  },
};
