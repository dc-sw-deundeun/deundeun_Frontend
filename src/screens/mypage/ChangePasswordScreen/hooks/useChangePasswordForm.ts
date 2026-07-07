import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { setAccessToken } from '@/api/client';
import { RootStackScreenProps } from '@/types/navigation';

// 이메일 인증 기반 비밀번호 재설정 폼 전체 상태 및 제출을 담당하는 훅
export const useChangePasswordForm = (navigation: RootStackScreenProps<'ChangePassword'>['navigation']) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 상태 변수
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [timer, setTimer] = useState(0); // 초 단위
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 타이머 작동 Effect
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isCodeSent && !isCodeVerified) {
      Alert.alert('인증 시간 초과', '인증 시간이 초과되었습니다. 다시 인증요청을 해주세요.');
      setIsCodeSent(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer, isCodeSent, isCodeVerified]);

  // 접속한 유저의 이메일을 초기 기본값으로 자동 완성
  useEffect(() => {
    const fetchMyEmail = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data && res.data.email) {
          setEmail(res.data.email);
        }
      } catch (e) {
        console.error('로그인한 이메일 조회 실패:', e);
      }
    };
    fetchMyEmail();
  }, []);

  // 1. 인증요청 버튼 클릭 핸들러
  const handleRequestVerify = async () => {
    if (!email) {
      Alert.alert('이메일 입력', '이메일을 먼저 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      await authApi.requestPasswordReset({ email });
      setIsCodeSent(true);
      setIsCodeVerified(false);
      setCode('');
      setTimer(180); // 3분 타이머 시작
      Alert.alert('인증코드 발송', '비밀번호 재설정 인증코드가 발송되었습니다.\n로컬 백엔드 서버 콘솔 창에서 6자리 코드를 확인해 주세요.');
    } catch (error) {
      console.error('인증요청 실패:', error);
      Alert.alert('오류', '인증코드 요청 중 오류가 발생했습니다. 이메일을 다시 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 2. 인증코드 확인 버튼 클릭 핸들러 (로컬 체크 처리)
  // 백엔드 구조상 confirmEmailVerify를 호출해버리면 코드가 소모(verified_at 기록)되어,
  // 이후 confirmPasswordReset 단계에서 같은 코드를 재검증할 때 400 Bad Request가 발생합니다.
  // 따라서 인증번호 자릿수 검증을 로컬에서 우선 성공 처리한 후,
  // 최종 비밀번호 변경 시점에 백엔드에서 원스톱으로 코드를 검증하도록 설계합니다.
  const handleConfirmVerify = () => {
    if (!code || code.length < 6) {
      Alert.alert('인증 실패', '인증번호 6자리를 올바르게 입력해 주세요.');
      return;
    }
    setIsCodeVerified(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // 비밀번호 복잡도 체크
  const isLengthValid = newPassword.length >= 8;
  const isPatternValid =
    /[a-zA-Z]/.test(newPassword) && // 영문 포함
    /[0-9]/.test(newPassword) && // 숫자 포함
    /[^a-zA-Z0-9]/.test(newPassword); // 특수문자 포함

  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;

  // 전체 폼 제출 가능 상태
  const canSubmit = isCodeVerified && isLengthValid && isPatternValid && isMatchValid;

  // 3. 비밀번호 변경 완료 버튼 클릭 핸들러
  const handleCompleteChange = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await authApi.confirmPasswordReset({
        email,
        code,
        new_password: newPassword,
      });
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.error('비밀번호 변경 실패:', error);
      const errorMsg = error?.response?.data?.message || '';
      if (errorMsg.includes('동일한 비밀번호') || String(error).includes('SamePasswordException')) {
        Alert.alert('변경 실패', '기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.');
      } else {
        Alert.alert('인증 실패', '인증번호가 일치하지 않거나 만료되었습니다. 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 성공 모달 닫기 -> 토큰을 완전히 만료/클리어하고 로그인 화면으로 리셋 이동
  const handleModalClose = async () => {
    setSuccessModalVisible(false);
    await storage.clearTokens();
    setAccessToken(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return {
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isCodeSent,
    isCodeVerified,
    timer,
    successModalVisible,
    loading,
    isLengthValid,
    isPatternValid,
    isMatchValid,
    canSubmit,
    handleRequestVerify,
    handleConfirmVerify,
    handleCompleteChange,
    handleModalClose,
  };
};

export default useChangePasswordForm;
