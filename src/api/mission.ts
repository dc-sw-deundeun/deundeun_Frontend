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

// GET /missions/today 응답 구조
export interface TodayMissionsResponse {
  date: string;
  total: number;
  completed: number;
  items: MissionItem[];
}

export const missionApi = {
  // 오늘 배정된 미션 목록 조회
  getTodayMissions: async (): Promise<ApiResponse<TodayMissionsResponse>> => {
    const response = await apiClient.get<ApiResponse<TodayMissionsResponse>>('/missions/today');
    return response.data;
  },

  // 미션 완료 (self-report)
  completeMission: async (missionId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/missions/${missionId}/complete`);
    return response.data;
  },
};
