// 백엔드 공통 응답 규격 정의
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errorCode?: string;
}
