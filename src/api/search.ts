import apiClient from './client';
import { ApiResponse } from './types';

// 질환 검색 결과 타입 정의
export interface DiseaseResult {
  name: string;
  description: string;
  symptoms: string[];
}

export interface DiseaseSearchResponse {
  results: DiseaseResult[];
}

export const searchApi = {
  // 질환 검색 (의학 지식 그래프 + AI)
  searchDiseases: async (query: string): Promise<ApiResponse<DiseaseSearchResponse>> => {
    const response = await apiClient.get<DiseaseSearchResponse>('/search/diseases', {
      params: { q: query },
    });
    return {
      success: true,
      data: response.data,
    };
  },
};
