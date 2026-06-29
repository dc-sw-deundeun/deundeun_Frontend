import apiClient from './client';
import { ApiResponse } from './types';

export interface MultiImageUploadRequest {
  images: string[]; // base64 strings or URLs
}

export interface MetricItem {
  metric_code: string;
  metric_name: string;
  value: number;
  unit: string;
  status: string; // 'NORMAL', 'WARNING', 'DANGER'
}

export interface CommitCheckupRequest {
  ocr_status: string;
  failed_pages?: number[];
  content_hash: string;
  metrics: any[];
}

export const recordsApi = {
  // OCR 프리뷰 업로드
  uploadCheckupForOcr: async (data: MultiImageUploadRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/records/checkups/ocr-preview', data);
    return response.data;
  },

  // 검진 결과 최종 저장 (Commit)
  commitCheckup: async (data: CommitCheckupRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/records/checkups', data);
    return response.data;
  },

  // 검진 결과 최종 검수 (Verify)
  verifyCheckup: async (recordId: number, data: { metrics: any[] }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/records/checkups/${recordId}/verify`, data);
    return response.data;
  },
};
