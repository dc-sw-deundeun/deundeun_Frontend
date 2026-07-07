import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { authApi, setAccessToken } from '@/api';
import { storage } from '@/utils/storage';
import { RootStackScreenProps } from '@/types/navigation';

// 이메일 인증 + 비밀번호 설정으로 이어지는 회원가입 폼 전체 상태 및 제출을 담당하는 훅
export const useRegisterForm = (navigation: RootStackScreenProps<'Register'>['navigation']) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [resendCooldown, setResendCooldown] = useState(0); // 60 seconds resend cooldown
  const [verifyFailCount, setVerifyFailCount] = useState(0); // Track verification failure count
  const [isLoading, setIsLoading] = useState(false);

  // 10-minute code validity countdown timer & expired handling
  useEffect(() => {
    if (!isCodeSent || isCodeVerified) return;
    if (timeLeft <= 0) {
      setCodeError('인증시간이 만료되었습니다. 재요청 버튼을 눌러주세요.');
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCodeSent, isCodeVerified, timeLeft]);

  // 60-second resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

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
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (text.length > 0 && !passwordRegex.test(text)) {
      setPasswordError('비밀번호는 8자 이상 영문, 숫자, 특수문자를 조합해야 합니다.');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleSendCode = async () => {
    if (!email) return;
    if (!validateEmailFormat(email)) return;

    setEmailError('');
    setIsLoading(true);
    try {
      await authApi.requestEmailVerify({ email, purpose: 'SIGNUP' });
      setIsLoading(false);
      setIsCodeSent(true);
      setTimeLeft(600); // Reset to 10 minutes
      setResendCooldown(60); // Start 60-second cooldown
      setVerifyFailCount(0); // Reset fail count on resend
      setCodeError('');
    } catch (error: any) {
      setIsLoading(false);
      const status = error?.response?.status;
      if (status === 409) {
        const msg = error?.response?.data?.message || '이미 사용 중인 이메일입니다.';
        setEmailError(msg);
      } else {
        const errorMsg = error?.response?.data?.message || '인증 코드 발송에 실패했습니다. 이메일을 확인해 주세요.';
        setEmailError(errorMsg);
      }
    }
  };

  const validateCodeFormat = (text: string) => {
    const codeRegex = /^\d{6}$/;
    if (text.length > 0 && !codeRegex.test(text)) {
      setCodeError('인증번호는 숫자 6자리를 입력해 주세요.');
      return false;
    } else {
      setCodeError('');
      return true;
    }
  };

  const handleVerifyCode = async () => {
    if (!validateCodeFormat(code)) return;
    if (verifyFailCount >= 5) {
      setCodeError('인증번호 5회 실패하였습니다. 인증번호 재요청바랍니다.');
      return;
    }
    setCodeError('');
    setIsLoading(true);
    try {
      const response = await authApi.confirmEmailVerify({ email, code, purpose: 'SIGNUP' });
      setIsLoading(false);
      if (response?.data?.verification_token) {
        setVerificationToken(response.data.verification_token);
        setIsCodeVerified(true);
      } else {
        setIsCodeVerified(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      const newFailCount = verifyFailCount + 1;
      setVerifyFailCount(newFailCount);

      if (newFailCount >= 5) {
        setCodeError('인증번호 5회 실패하였습니다. 인증번호 재요청바랍니다.');
      } else {
        const status = error?.response?.status;
        if (status === 400 || status === 422) {
          setCodeError('인증번호가 일치하지 않거나 만료되었습니다.');
        } else {
          const errorMsg = error?.response?.data?.message || '인증 코드 확인 중 오류가 발생했습니다.';
          setCodeError(errorMsg);
        }
      }
    }
  };

  const isFormValid = isCodeVerified && password.length >= 8 && !passwordError && password === confirmPassword;

  const handleSignup = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const nickname = email.split('@')[0] || '사용자';
      await authApi.signup({
        email,
        password,
        nickname,
        verification_token: verificationToken || 'dummy_token',
      });

      // 회원가입 완료 후 곧바로 자동 로그인하여 토큰 저장
      try {
        const loginRes = await authApi.login({ email, password });
        if (loginRes?.data?.access_token) {
          setAccessToken(loginRes.data.access_token);
          await storage.saveTokens(loginRes.data.access_token, loginRes.data.refresh_token, true);
        }
      } catch (e) {
        console.warn('가입 후 자동 로그인 처리 중 오류 발생:', e);
      }

      setIsLoading(false);
      // 블로킹 팝업 없이 즉시 약관 동의(Terms) 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'Terms' }],
      });
    } catch (error: any) {
      setIsLoading(false);
      const status = error?.response?.status;
      if (status === 409) {
        const msg = error?.response?.data?.message || '이미 사용 중인 이메일입니다.';
        setEmailError(msg);
      } else {
        const errorMsg = error?.response?.data?.message || '회원가입 처리에 실패했습니다.';
        Alert.alert('회원가입 실패', errorMsg);
      }
    }
  };

  return {
    email,
    setEmail,
    emailError,
    isCodeSent,
    code,
    setCode,
    codeError,
    isCodeVerified,
    password,
    setPassword,
    passwordError,
    confirmPassword,
    setConfirmPassword,
    timeLeft,
    resendCooldown,
    verifyFailCount,
    isLoading,
    isFormValid,
    validateEmailFormat,
    validatePasswordFormat,
    handleSendCode,
    handleVerifyCode,
    handleSignup,
  };
};

export default useRegisterForm;
