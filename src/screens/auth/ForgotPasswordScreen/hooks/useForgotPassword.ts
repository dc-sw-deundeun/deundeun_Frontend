import { useState, useEffect } from 'react';
import { authApi } from '@/api';
import { parseBackendError } from '../../LoginScreen/utils';
import { useAppStore } from '@/store/useAppStore';

// 비밀번호 찾기 모달(이메일 발송 -> 인증코드 확인 -> 새 비밀번호 설정) 전체 흐름을 담당하는 훅
export const useForgotPassword = (onResetComplete: (email: string) => void) => {
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotCodeError, setForgotCodeError] = useState('');
  const [isForgotCodeVerified, setIsForgotCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotTimeLeft, setForgotTimeLeft] = useState(600); // 10 minutes
  const [forgotResendCooldown, setForgotResendCooldown] = useState(0); // 60s cooldown
  const [forgotVerifyFailCount, setForgotVerifyFailCount] = useState(0);

  // Password reset 10-minute timer & expired handling
  useEffect(() => {
    if (forgotStep !== 2 || isForgotCodeVerified) return;
    if (forgotTimeLeft <= 0) {
      setForgotCodeError('인증시간이 만료되었습니다. 재요청 버튼을 눌러주세요.');
      return;
    }
    const interval = setInterval(() => {
      setForgotTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotStep, isForgotCodeVerified, forgotTimeLeft]);

  // Password reset 60-second cooldown timer
  useEffect(() => {
    if (forgotResendCooldown <= 0) return;
    const interval = setInterval(() => {
      setForgotResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotResendCooldown]);

  const validateForgotCodeFormat = (text: string) => {
    const codeRegex = /^\d{6}$/;
    if (text.length > 0 && !codeRegex.test(text)) {
      setForgotCodeError('인증번호는 숫자 6자리를 입력해 주세요.');
      return false;
    } else {
      setForgotCodeError('');
      return true;
    }
  };

  const validateNewPasswordFormat = (text: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (text.length > 0 && !passwordRegex.test(text)) {
      setNewPasswordError('비밀번호는 8자 이상 영문, 숫자, 특수문자를 조합해야 합니다.');
      return false;
    } else {
      setNewPasswordError('');
      return true;
    }
  };

  const handleSendForgotEmail = async () => {
    if (!forgotEmail) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    setForgotEmailError('');
    setIsForgotLoading(true);
    try {
      await authApi.requestPasswordReset({ email: forgotEmail });
      setIsForgotLoading(false);
      setForgotStep(2);
      setForgotTimeLeft(600); // 10분 리셋
      setForgotResendCooldown(60); // 60초 쿨다운
      setForgotVerifyFailCount(0);
      setIsForgotCodeVerified(false);
      setForgotCode('');
      setForgotCodeError('');
    } catch (error: any) {
      setIsForgotLoading(false);
      const errorMsg = parseBackendError(error, '인증 코드 발송에 실패했습니다. 등록된 이메일인지 확인해 주세요.');
      setForgotEmailError(errorMsg);
    }
  };

  const handleConfirmCode = () => {
    if (!validateForgotCodeFormat(forgotCode)) return;
    if (forgotVerifyFailCount >= 5) {
      setForgotCodeError('인증번호 5회 실패하였습니다. 인증번호 재요청바랍니다');
      return;
    }
    setForgotCodeError('');
    setIsForgotCodeVerified(true);
  };

  const handleConfirmPasswordReset = async () => {
    if (!forgotCode || !newPassword || !newPasswordConfirm) return;
    if (forgotCode.length !== 6) {
      setForgotCodeError('인증번호는 숫자 6자리를 입력해 주세요.');
      return;
    }
    if (forgotVerifyFailCount >= 5) {
      setForgotCodeError('인증번호 5회 실패하였습니다. 인증번호 재요청바랍니다');
      return;
    }
    if (!validateNewPasswordFormat(newPassword)) return;
    if (newPassword !== newPasswordConfirm) {
      setNewPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setForgotCodeError('');
    setNewPasswordError('');
    setIsForgotLoading(true);
    try {
      await authApi.confirmPasswordReset({
        email: forgotEmail,
        code: forgotCode,
        new_password: newPassword,
      });
      setIsForgotLoading(false);

      // 즉시 모달 닫고 로그인 화면으로 연결 (이메일 자동 세팅)
      onResetComplete(forgotEmail);
      setForgotModalVisible(false);
      setForgotStep(1);
      setForgotEmail('');
      setForgotCode('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setIsForgotCodeVerified(false);
    } catch (error: any) {
      setIsForgotLoading(false);
      const status = error?.response?.status;
      const errorCode = error?.response?.data?.error_code;
      const parsedMsg = parseBackendError(error, '비밀번호 재설정 처리 중 오류가 발생했습니다.');

      if (status === 400 || status === 422) {
        if (errorCode === 'SAME_PASSWORD' || parsedMsg.includes('기존') || parsedMsg.includes('동일')) {
          setNewPassword('');
          setNewPasswordConfirm('');
          setNewPasswordError('기존 비밀번호와 동일합니다.');
          useAppStore.getState().showAlert(
            '오류',
            '새 비밀번호는 기존 비밀번호와 달라야 합니다.\n다시 입력해 주세요.'
          );
        } else if (errorCode === 'INVALID_VERIFICATION_CODE') {
          setIsForgotCodeVerified(false);
          setForgotCodeError('인증번호가 일치하지 않거나 만료되었습니다.');
          handleSendForgotEmail(); // automatically resend the email
          useAppStore.getState().showAlert(
            '인증 실패',
            '인증 코드가 올바르지 않거나 만료되었습니다.\n인증번호가 전송되었습니다.'
          );
        } else {
          const newFailCount = forgotVerifyFailCount + 1;
          setForgotVerifyFailCount(newFailCount);
          setIsForgotCodeVerified(false);
          if (newFailCount >= 5) {
            setForgotCodeError('인증번호 5회 실패하였습니다. 인증번호 재요청바랍니다');
          } else {
            setForgotCodeError('인증번호가 일치하지 않거나 만료되었습니다.');
          }
        }
      } else {
        setForgotCodeError(parsedMsg);
      }
    }
  };

  const closeModal = () => {
    setForgotModalVisible(false);
    setForgotStep(1);
  };

  return {
    forgotModalVisible,
    setForgotModalVisible,
    forgotStep,
    forgotEmail,
    setForgotEmail,
    forgotEmailError,
    setForgotEmailError,
    forgotCode,
    setForgotCode,
    forgotCodeError,
    isForgotCodeVerified,
    newPassword,
    setNewPassword,
    newPasswordError,
    newPasswordConfirm,
    setNewPasswordConfirm,
    isForgotLoading,
    forgotTimeLeft,
    forgotResendCooldown,
    forgotVerifyFailCount,
    validateForgotCodeFormat,
    validateNewPasswordFormat,
    handleSendForgotEmail,
    handleConfirmCode,
    handleConfirmPasswordReset,
    closeModal,
  };
};

export default useForgotPassword;
