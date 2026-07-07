import apiClient from './client';
import { ApiResponse } from './types';

// Home User 정보 타입
export interface HomeUser {
  id: number;
  nickname: string;
  onboarding_step: string;
  onboarding_completed: boolean;
}

// 보유 동물 정보 타입
export interface OwnedAnimal {
  animal_code: string;
  name: string;
  unlocked_level: number;
  unlocked_at: string;
}

// Home 캐릭터 정보 타입
export interface HomeCharacter {
  user_id: number;
  level: number;
  total_exp: number;
  current_level_exp: number;
  exp_to_next_level: number;
  progress_ratio: number;
  owned_animals: OwnedAnimal[];
  updated_at: string;
}

// Home 미션 정보 타입
export interface HomeMissionItem {
  mission_id: number;
  template_code: string;
  title: string;
  description: string | null;
  category: string | null;
  verification_mode: string | null;
  xp_reward: number;
  status: 'ASSIGNED' | 'COMPLETED';
  assigned_date: string;
  source_record_id: number | null;
}

export interface HomeMissions {
  date: string;
  total: number;
  completed: number;
  items: HomeMissionItem[];
}

// GET /home 응답 구조
export interface HomeDataResponse {
  user: HomeUser;
  character: HomeCharacter;
  today_missions: HomeMissions;
  unread_notification_count: number;
}

// GET /home/summary 응답 구조
export interface HomeSummaryResponse {
  nickname: string;
  level: number;
  total_exp: number;
  progress_ratio: number;
  owned_animal_count: number;
  today_mission_total: number;
  today_mission_completed: number;
  unread_notification_count: number;
}

export const homeApi = {
  // 홈 화면 데이터 전체 조회
  getHome: async (): Promise<ApiResponse<HomeDataResponse>> => {
    const response = await apiClient.get<ApiResponse<HomeDataResponse>>('/home');
    return response.data;
  },

  // 홈 요약 데이터 조회
  getHomeSummary: async (): Promise<ApiResponse<HomeSummaryResponse>> => {
    const response = await apiClient.get<ApiResponse<HomeSummaryResponse>>('/home/summary');
    return response.data;
  },
};
