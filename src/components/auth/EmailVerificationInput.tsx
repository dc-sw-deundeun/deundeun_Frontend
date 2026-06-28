import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { authApi } from '@/api';

interface EmailVerificationInputProps {
  email: string;
  purpose: 'SIGNUP' | 'PASSWORD_RESET';
  onVerified: (verificationToken?: string) => void;
  isVerified: boolean;
  onSendSuccess?: () => void;
}

export default function EmailVerificationInput({
  email,
  purpose,
  onVerified,
  isVerified,
  onSendSuccess,
}: EmailVerificationInputProps) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10분
  const [resendCooldown, setResendCooldown] = useState(0); // 60초
  const [verifyFailCount, setVerifyFailCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 10분 유효시간 카운트다운
  useEffect(() => {
    if (!isCodeSent || isVerified) return;
    if (timeLeft <= 0) {
      setCodeError('인증시간이 만료되었습니다. 재요청 버튼을 눌러주세요.');
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCodeSent, isVerified, timeLeft]);

  // 60초 재요청 쿨다운 카운트다운
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

  const parseBackendError = (error: any, defaultMsg: string) => {
    const responseData = error?.response?.data;
    if (responseData?.detail && Array.isArray(responseData.detail) && responseData.detail.length > 0) {
      return responseData.detail[0]?.msg || defaultMsg;
    }
    if (typeof responseData?.detail === 'string') {
      return responseData.detail;
    }
    return responseData?.message || defaultMsg;
  };

  const handleSendCode = async () => {
    if (!email) return;
    setIsLoading(true);
    setCodeError('');
    try {
      if (purpose === 'PASSWORD_RESET') {
        await authApi.requestPasswordReset({ email });
      } else {
        await authApi.requestEmailVerify({ email, purpose: 'SIGNUP' });
      }
      setIsLoading(false);
      setIsCodeSent(true);
      setTimeLeft(600);
      setResendCooldown(60);
      setVerifyFailCount(0);
      if (onSendSuccess) onSendSuccess();
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = parseBackendError(error, '인증 코드 발송에 실패했습니다.');
      setCodeError(errorMsg);
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
      const response = await authApi.confirmEmailVerify({ email, code, purpose });
      setIsLoading(false);
      const token = response?.data?.verification_token || 'verified';
      onVerified(token);
    } catch (error: any) {
      setIsLoading(false);
      const newFailCount = verifyFailCount + 1;
      setVerifyFailCount(newFailCount);

      if (newFailCount >= 5) {
        setCodeError('인증번호 5회 실패하였습니다. 인증번호 재요청바랍니다.');
      } else {
        const errorMsg = parseBackendError(error, '인증번호가 일치하지 않거나 만료되었습니다.');
        setCodeError(errorMsg);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 이메일 발송/재요청 버튼 가이드 */}
      {!isCodeSent && (
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: email && !isLoading ? COLORS.primary : theme.border }
          ]}
          disabled={!email || isLoading}
          onPress={handleSendCode}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={{ color: email ? '#ffffff' : theme.textMuted, fontWeight: '600' }}>
              인증코드 발송
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* 인증번호 입력 그룹 */}
      {isCodeSent && (
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>인증번호 (6자리)</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, position: 'relative' }}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: isVerified ? COLORS.success : (codeError ? COLORS.error : theme.border),
                    color: theme.text,
                  },
                  isVerified && { opacity: 0.7 }
                ]}
                placeholder="인증번호 6자리 입력"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={(val) => {
                  setCode(val);
                  validateCodeFormat(val);
                }}
                editable={!isVerified && timeLeft > 0 && verifyFailCount < 5}
              />
              {!isVerified && timeLeft > 0 && (
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                { backgroundColor: code.length === 6 && !isVerified && !isLoading && !codeError ? COLORS.primary : theme.border }
              ]}
              disabled={code.length !== 6 || isVerified || isLoading || !!codeError}
              onPress={handleVerifyCode}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={[
                  styles.verifyButtonText,
                  { color: code.length === 6 && !isVerified && !codeError ? '#ffffff' : theme.textMuted }
                ]}>
                  {isVerified ? '완료' : '확인'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {!!codeError && (
            <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
              {codeError}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  sendButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  timerText: {
    position: 'absolute',
    right: 12,
    top: 16,
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  verifyButton: {
    width: 80,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
