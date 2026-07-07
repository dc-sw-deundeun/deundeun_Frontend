import { useState } from 'react';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { RootStackScreenProps } from '@/types/navigation';
import { parseBackendError } from '../utils';

// 로그인 폼(이메일/비밀번호/자동로그인) 상태 및 제출을 담당하는 훅
export const useLoginForm = (navigation: RootStackScreenProps<'Login'>['navigation']) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmailFormat = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePasswordFormat = (text: string) => {
    if (text.length > 0 && text.length < 8) {
      setPasswordError('비밀번호는 8자 이상 입력해 주세요.');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    if (!validateEmailFormat(email)) return;
    if (!validatePasswordFormat(password)) return;

    setPasswordError('');
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setIsLoading(false);

      if (response?.data?.access_token) {
        await storage.saveTokens(response.data.access_token, response.data.refresh_token, autoLogin);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
      });
    } catch (error: any) {
      setIsLoading(false);
      if (!error.response) {
        setPasswordError('인터넷 연결 상태가 불안정하거나 서버 점검 중입니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      const status = error.response.status;
      if (status === 401 || status === 400 || status === 404) {
        setPasswordError('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else if (status === 429 || status === 423) {
        setPasswordError('비밀번호를 연속으로 틀려 계정이 잠겼습니다. 비밀번호 찾기를 이용해 주세요.');
      } else if (status === 403) {
        setPasswordError('이용이 정지되었거나 탈퇴한 계정입니다. 고객센터로 문의해 주세요.');
      } else {
        const errorMsg = parseBackendError(error, '로그인에 실패했습니다. 다시 시도해 주세요.');
        setPasswordError(errorMsg);
      }
    }
  };

  const isFormValid = email.length > 0 && password.length > 0 && !emailError;

  return {
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
    setPasswordError,
    autoLogin,
    setAutoLogin,
    isLoading,
    isFormValid,
    validateEmailFormat,
    validatePasswordFormat,
    handleLogin,
  };
};

export default useLoginForm;
