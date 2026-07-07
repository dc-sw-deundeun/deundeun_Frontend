// 백엔드 공통 응답 규격 정의 (FastAPI deundeun API)
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error_code?: string;
}

export interface ApiError {
  message: string;
  status_code?: number;
  error_code?: string;
}
