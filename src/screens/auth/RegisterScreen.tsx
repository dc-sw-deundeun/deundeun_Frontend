import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2 } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { authApi, setAccessToken } from '@/api';
import { storage } from '@/utils/storage';

export default function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
      // 블로킹 팝업 없이 즉시 메인 홈페이지(MainTabs)로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
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

  const isFormValid = isCodeVerified && password.length >= 8 && !passwordError && password === confirmPassword;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader title="회원가입" onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>계정을 만들어요</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              이메일로 인증번호를 보내드려요.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      backgroundColor: theme.card,
                      borderColor: emailError ? COLORS.error : theme.border,
                      color: theme.text,
                    },
                    isCodeSent && { opacity: 0.7 }
                  ]}
                  placeholder="youngsoon@deundeun.kr"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    validateEmailFormat(val);
                  }}
                  editable={!isCodeSent}
                />
                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    { backgroundColor: email && !isLoading && !emailError && !isCodeVerified && resendCooldown === 0 ? COLORS.primary : theme.border }
                  ]}
                  disabled={!email || isLoading || !!emailError || isCodeVerified || resendCooldown > 0}
                  onPress={handleSendCode}
                >
                  {isLoading && !isCodeVerified ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={[
                      styles.verifyButtonText,
                      { color: email && !emailError && !isCodeVerified && resendCooldown === 0 ? '#ffffff' : theme.textMuted }
                    ]}>
                      {isCodeSent ? (resendCooldown > 0 ? `재요청 (${resendCooldown}초)` : '재요청') : '인증요청'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              {/* 인라인 에러 메시지 렌더링 */}
              {!!emailError && (
                <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* Verification Code Input */}
            {isCodeSent && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>인증번호</Text>
                <View style={styles.row}>
                  <View style={{ flex: 1, position: 'relative' }}>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: theme.card,
                          borderColor: isCodeVerified ? COLORS.success : (codeError ? COLORS.error : theme.border),
                          color: theme.text,
                        },
                        isCodeVerified && { opacity: 0.7 }
                      ]}
                      placeholder="인증번호 6자리 입력"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="number-pad"
                      value={code}
                      onChangeText={(val) => {
                        setCode(val);
                        validateCodeFormat(val);
                      }}
                      editable={!isCodeVerified && timeLeft > 0 && verifyFailCount < 5}
                      maxLength={6}
                    />
                    {!isCodeVerified && timeLeft > 0 && (
                      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.verifyButton,
                      { backgroundColor: code.length === 6 && !isCodeVerified && !isLoading && !codeError ? COLORS.primary : theme.border }
                    ]}
                    disabled={code.length !== 6 || isCodeVerified || isLoading || !!codeError}
                    onPress={handleVerifyCode}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={[
                        styles.verifyButtonText,
                        { color: code.length === 6 && !isCodeVerified && !codeError ? '#ffffff' : theme.textMuted }
                      ]}>
                        확인
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                {!!codeError && (
                  <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
                    {codeError}
                  </Text>
                )}
                {isCodeVerified && (
                  <View style={styles.verifiedRow}>
                    <CheckCircle2 color={COLORS.success} size={16} />
                    <Text style={styles.verifiedText}>인증되었어요</Text>
                  </View>
                )}
              </View>
            )}

            {/* Passwords - Show only after email is verified for progressive UI */}
            {isCodeVerified && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>비밀번호</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: passwordError ? COLORS.error : (password.length >= 8 && !passwordError ? COLORS.success : theme.border),
                        color: theme.text
                      }
                    ]}
                    placeholder="비밀번호 입력 (8자 이상 영문, 숫자, 특수문자)"
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      validatePasswordFormat(val);
                    }}
                  />
                  {!!passwordError ? (
                    <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                      {passwordError}
                    </Text>
                  ) : (password.length >= 8 && !passwordError ? (
                    <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 4, fontWeight: '700' }}>
                      ✓ 사용 가능한 안전한 비밀번호입니다.
                    </Text>
                  ) : (
                    <Text style={[styles.helpText, { color: theme.textMuted }]}>
                      8자 이상 영문, 숫자, 특수문자 조합
                    </Text>
                  ))}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>비밀번호 재확인</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: confirmPassword ? (password === confirmPassword ? COLORS.success : COLORS.error) : theme.border,
                        color: theme.text
                      }
                    ]}
                    placeholder="비밀번호 다시 입력"
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  {confirmPassword && password !== confirmPassword ? (
                    <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                      비밀번호가 일치하지 않습니다.
                    </Text>
                  ) : (confirmPassword && password === confirmPassword ? (
                    <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 4, fontWeight: '700' }}>
                      ✓ 비밀번호가 일치합니다.
                    </Text>
                  ) : null)}
                </View>
              </>
            )}
          </View>

          {/* Bottom Action Button: If email already exists, show Splash navigation button */}
          {!!emailError && (emailError.includes('이미') || emailError.includes('사용') || emailError.includes('존재')) ? (
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: COLORS.primary }
              ]}
              onPress={() => navigation.navigate('Splash')}
            >
              <Text style={[styles.submitButtonText, { color: '#ffffff' }]}>
                시작 페이지로 돌아가기
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: isFormValid && !isLoading ? COLORS.primary : theme.disabledBg }
              ]}
              disabled={!isFormValid || isLoading}
              onPress={handleSignup}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={[
                  styles.submitButtonText,
                  { color: isFormValid ? '#ffffff' : theme.disabledText }
                ]}>
                  회원가입 완료
                </Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
    minHeight: '85%',
  },
  titleContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  form: {
    flex: 1,
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
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
    gap: SPACING.sm,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  verifyButton: {
    width: 100,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    position: 'absolute',
    right: SPACING.md,
    top: 16,
    color: '#E53935',
    fontWeight: '600',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
