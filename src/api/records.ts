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

export interface AnalyzeCheckupRequest {
  record_id?: number;
  sex: string;
  measured_at: string;
  metrics: {
    metric_code: string;
    metric_name: string;
    value: string;
    unit: string;
    raw_text: string;
  }[];
}

export interface MetricResponse {
  metric_id: number;
  metric_code: string;
  metric_name: string;
  value: string | null;
  unit: string | null;
  status?: string | null;
  confidence?: number | null;
  raw_text?: string | null;
  page_index?: number | null;
  is_edited?: boolean;
  reference_min?: string | number | null;
  reference_max?: string | number | null;
}

// 검진 결과 상세 그래프(막대) 구간 정보
export interface RangeBarSegment {
  label: string;
  from_value: number;
  to_value: number;
  color: string; // 'green' | 'yellow' | 'red'
}

export interface RangeBarActiveSegment extends RangeBarSegment {
  marker_percent: number;
}

export interface RangeBar {
  min: number;
  max: number;
  marker: number;
  marker_percent: number; // 전체 막대 기준 백분위 위치
  segments: RangeBarSegment[];
  active_segment: RangeBarActiveSegment | null;
}

// /records/checkups/{id}/analysis 응답의 ui.summary.cards, ui.details[].metric 항목
export interface AnalysisMetricCard {
  code: string;
  label: string;
  value: number | string | null;
  unit: string | null;
  status: string;
  status_label: string;
  value_text: string;
  badge_text: string;
  range_bar: RangeBar | null;
}

export interface AnalysisDetail {
  analysis_id: number;
  metric: AnalysisMetricCard;
  range_bar: RangeBar | null;
  trend: { title: string; points: { label: string; value: number }[] };
  meaning: { title: string; body: string };
  recommendations: { title: string; items: string[] };
}

export interface AnalysisUiSummary {
  analysis_id: number;
  overall: {
    title: string;
    summary: string;
    counts: { normal: number; caution: number; risk: number; unknown: number };
  };
  cards: AnalysisMetricCard[];
}

export interface AnalysisData {
  analysis_id: number;
  record_id: number;
  results: any[];
  explanation: any;
  ui: {
    summary: AnalysisUiSummary;
    details: AnalysisDetail[];
  };
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

  // 검진 결과 분석 및 기록 최종 저장 (Analyses)
  analyzeCheckup: async (data: AnalyzeCheckupRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/health-metrics/analyses`, data);
    return response.data;
  },

  // 검진 기록 목록 조회
  listCheckups: async (page = 1, size = 20): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>('/records/checkups', {
      params: { page, size }
    });
    return response.data;
  },

  // 검진 기록 상세 조회
  getCheckup: async (recordId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>(`/records/checkups/${recordId}`);
    return response.data;
  },

  deleteCheckup: async (recordId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/records/checkups/${recordId}`);
    return response.data;
  },

  // 검진 지표 일괄 수정
  bulkUpdateMetrics: async (recordId: number, metrics: any[]): Promise<ApiResponse<any>> => {
    const response = await apiClient.put<ApiResponse<any>>(`/records/checkups/${recordId}/metrics`, { metrics });
    return response.data;
  },

  // 수동 검진 기록 생성
  createManualCheckup: async (data: { measured_at?: string | null; metrics: any[] }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/records/checkups/manual', data);
    return response.data;
  },

  // 검진 지표 추세 조회
  getCheckupTrends: async (recordId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>(`/records/checkups/${recordId}/trends`);
    return response.data;
  },

  // 검진 기록 최신 HealthMetric 분석 조회
  getCheckupAnalysis: async (recordId: number): Promise<ApiResponse<AnalysisData>> => {
    const response = await apiClient.get<ApiResponse<AnalysisData>>(`/records/checkups/${recordId}/analysis`);
    return response.data;
  },
};
