import apiClient, { setAccessToken } from './client';
import { ApiResponse } from './types';

// 1. 이메일 인증 요청/확인
export interface EmailVerifyRequest {
  email: string;
  purpose?: 'SIGNUP' | 'PASSWORD_RESET';
}

export interface EmailVerifyConfirmRequest {
  email: string;
  code: string;
  purpose?: 'SIGNUP' | 'PASSWORD_RESET';
}

export interface EmailVerifyConfirmResponse {
  verification_token: string;
}

// 2. 회원가입
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  sex: 'MALE' | 'FEMALE';
  verification_token: string;
}

// 3. 로그인 / 토큰
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

// 4. 비밀번호 재설정
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  email: string;
  code: string;
  new_password: string;
}

// 5. 약관 동의
export interface ConsentItem {
  consent_type: 'TERMS_OF_SERVICE' | 'PRIVACY' | 'HEALTH_DATA';
  version: string;
  agreed: boolean;
}

export interface PoliciesAgreeRequest {
  consents: ConsentItem[];
}

export const authApi = {
  // 이메일 인증 코드 발송
  requestEmailVerify: async (data: EmailVerifyRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/email/verify/request', data);
    return response.data;
  },

  // 이메일 인증 코드 확인
  confirmEmailVerify: async (data: EmailVerifyConfirmRequest): Promise<ApiResponse<EmailVerifyConfirmResponse>> => {
    const response = await apiClient.post<ApiResponse<EmailVerifyConfirmResponse>>('/auth/email/verify/confirm', data);
    return response.data;
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/signup', data);
    return response.data;
  },

  // 로그인
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    if (response.data?.data?.access_token) {
      setAccessToken(response.data.data.access_token);
    }
    return response.data;
  },

  // 토큰 재발급
  refreshToken: async (data: TokenRefreshRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', data);
    if (response.data?.data?.access_token) {
      setAccessToken(response.data.data.access_token);
    }
    return response.data;
  },

  // 로그아웃
  logout: async (refreshToken: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/logout', { refresh_token: refreshToken });
    setAccessToken(null);
    return response.data;
  },

  // 비밀번호 재설정 코드 발송
  requestPasswordReset: async (data: PasswordResetRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/password/reset/request', data);
    return response.data;
  },

  // 비밀번호 재설정 확인
  confirmPasswordReset: async (data: PasswordResetConfirmRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/password/reset/confirm', data);
    return response.data;
  },

  // 온보딩 약관 동의
  agreePolicies: async (data: PoliciesAgreeRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/policies/agree', data);
    return response.data;
  },

  // 내 프로필 조회
  getMe: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/me');
    return response.data;
  },
};
