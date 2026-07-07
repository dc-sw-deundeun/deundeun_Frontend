import apiClient from './client';
import { ApiResponse } from './types';

// 보유 동물 정보 타입
export interface OwnedAnimal {
  animal_code: string;
  name: string;
  unlocked_level: number;
  unlocked_at: string;
}

// 내 캐릭터 정보 API 응답 타입
export interface CharacterMeResponse {
  user_id: number;
  level: number;
  total_exp: number;
  current_level_exp: number;
  exp_to_next_level: number;
  progress_ratio: number;
  owned_animals: OwnedAnimal[];
  updated_at: string;
}

// 전체 동물 리스트 단일 정보 타입
export interface AnimalCatalogItem {
  animal_code: string;
  name: string;
  unlock_level: number;
  required_total_exp: number;
  is_unlocked: boolean;
  unlocked_at?: string | null;
}

// 전체 동물 리스트 API 응답 타입
export interface AnimalsCatalogResponse {
  animals: AnimalCatalogItem[];
}

export const characterApi = {
  // 내 캐릭터 정보 및 보유 동물 조회
  getMyCharacter: async (): Promise<ApiResponse<CharacterMeResponse>> => {
    const response = await apiClient.get<ApiResponse<CharacterMeResponse>>('/characters/me');
    return response.data;
  },

  // 전체 동물 잠금/해금 상태 조회
  getAnimalsCatalog: async (): Promise<ApiResponse<AnimalsCatalogResponse>> => {
    const response = await apiClient.get<ApiResponse<AnimalsCatalogResponse>>('/characters/animals');
    return response.data;
  },
};
