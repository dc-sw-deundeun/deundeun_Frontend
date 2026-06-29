import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Check, CheckCircle2, X } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { authApi, setAccessToken } from '@/api';
import { storage } from '@/utils/storage';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password modal state
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
    if (!forgotModalVisible || forgotStep !== 2 || isForgotCodeVerified) return;
    if (forgotTimeLeft <= 0) {
      setForgotCodeError('인증시간이 만료되었습니다. 재요청 버튼을 눌러주세요.');
      return;
    }
    const interval = setInterval(() => {
      setForgotTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotModalVisible, forgotStep, isForgotCodeVerified, forgotTimeLeft]);

  // Password reset 60-second cooldown timer
  useEffect(() => {
    if (forgotResendCooldown <= 0) return;
    const interval = setInterval(() => {
      setForgotResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotResendCooldown]);

  const formatForgotTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      setEmail(forgotEmail);
      setPassword('');
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
      const parsedMsg = parseBackendError(error, '비밀번호 재설정 처리 중 오류가 발생했습니다.');
      
      if (status === 400 || status === 422) {
        if (parsedMsg.includes('same') || parsedMsg.includes('이전') || parsedMsg.includes('동일')) {
          setNewPasswordError('기존에 사용하던 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.');
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

  const isFormValid = email.length > 0 && password.length > 0 && !emailError;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.titleContainer}>
            <Text style={[styles.logoText, { color: COLORS.primary }]}>든든</Text>
            <Text style={[styles.title, { color: theme.text }]}>다시 만나 반가워요</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: emailError ? COLORS.error : theme.border,
                    color: theme.text
                  }
                ]}
                placeholder="youngsoon@deundeun.kr"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  validateEmailFormat(val);
                  if (passwordError) setPasswordError('');
                }}
              />
              {!!emailError && (
                <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>비밀번호</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: passwordError ? COLORS.error : theme.border,
                    color: theme.text
                  }
                ]}
                placeholder="비밀번호 입력"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  validatePasswordFormat(val);
                }}
              />
              {!!passwordError && (
                <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
                  {passwordError}
                </Text>
              )}
            </View>

            {/* Checkbox and Forgot Password */}
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAutoLogin(!autoLogin)}
              >
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: autoLogin ? COLORS.primary : theme.textMuted },
                    autoLogin && { backgroundColor: COLORS.primary }
                  ]}
                >
                  {autoLogin && <Check color="#ffffff" size={14} strokeWidth={3} />}
                </View>
                <Text style={[styles.checkboxLabel, { color: theme.text }]}>자동 로그인</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
                <Text style={[styles.forgotText, { color: COLORS.primary }]}>
                  비밀번호를 잊으셨나요?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: isFormValid && !isLoading ? COLORS.primary : theme.disabledBg }
              ]}
              disabled={!isFormValid || isLoading}
              onPress={handleLogin}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={[
                  styles.submitButtonText,
                  { color: isFormValid ? '#ffffff' : theme.disabledText }
                ]}>
                  로그인
                </Text>
              )}
            </TouchableOpacity>

            {/* Signup Footer */}
            <View style={styles.signupFooter}>
              <Text style={[styles.signupText, { color: theme.textMuted }]}>아직 회원이 아니신가요?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.signupLink, { color: COLORS.primary }]}> 회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setForgotModalVisible(false);
          setForgotStep(1);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {forgotStep === 1 ? '비밀번호 찾기' : '새 비밀번호 설정'}
              </Text>
              <TouchableOpacity onPress={() => {
                setForgotModalVisible(false);
                setForgotStep(1);
              }}>
                <X color={theme.text} size={24} />
              </TouchableOpacity>
            </View>

            {forgotStep === 1 ? (
              <>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                  가입하신 이메일 주소를 입력하시면{"\n"}비밀번호 재설정 인증코드를 보내드려요.
                </Text>

                <View style={[styles.inputGroup, { marginVertical: SPACING.md }]}>
                  <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.background,
                        borderColor: forgotEmailError ? COLORS.error : theme.border,
                        color: theme.text
                      }
                    ]}
                    placeholder="youngsoon@deundeun.kr"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={forgotEmail}
                    onChangeText={(val) => {
                      setForgotEmail(val);
                      if (forgotEmailError) setForgotEmailError('');
                    }}
                  />
                  {!!forgotEmailError && (
                    <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                      {forgotEmailError}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: forgotEmail && !isForgotLoading ? COLORS.primary : theme.border, height: 50 }
                  ]}
                  disabled={!forgotEmail || isForgotLoading}
                  onPress={handleSendForgotEmail}
                >
                  {isForgotLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={{ color: forgotEmail ? '#ffffff' : theme.textMuted, fontWeight: '600' }}>
                      인증코드 받기
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                  이메일로 전송된 인증코드와{"\n"}새로운 비밀번호를 입력해 주세요.
                </Text>

                <View style={{ gap: SPACING.md, marginVertical: SPACING.md }}>
                  {/* 1. Email Row with Resend Button matching RegisterScreen */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
                    <View style={styles.row}>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            flex: 1,
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text,
                            opacity: 0.7
                          }
                        ]}
                        value={forgotEmail}
                        editable={false}
                      />
                      <TouchableOpacity
                        style={[
                          styles.verifyButton,
                          { backgroundColor: !isForgotLoading && forgotResendCooldown === 0 ? COLORS.primary : theme.border }
                        ]}
                        disabled={isForgotLoading || forgotResendCooldown > 0}
                        onPress={handleSendForgotEmail}
                      >
                        {isForgotLoading ? (
                          <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                          <Text style={[
                            styles.verifyButtonText,
                            { color: forgotResendCooldown === 0 ? '#ffffff' : theme.textMuted }
                          ]}>
                            {forgotResendCooldown > 0 ? `재요청 (${forgotResendCooldown}초)` : '재요청'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 2. Verification Code Row matching RegisterScreen */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>인증번호</Text>
                    <View style={styles.row}>
                      <View style={{ flex: 1, position: 'relative' }}>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.background,
                              borderColor: isForgotCodeVerified ? COLORS.success : (forgotCodeError ? COLORS.error : theme.border),
                              color: theme.text
                            },
                            isForgotCodeVerified && { opacity: 0.7 }
                          ]}
                          placeholder="인증번호 6자리 입력"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="number-pad"
                          maxLength={6}
                          value={forgotCode}
                          onChangeText={(val) => {
                            setForgotCode(val);
                            validateForgotCodeFormat(val);
                          }}
                          editable={!isForgotCodeVerified && forgotTimeLeft > 0 && forgotVerifyFailCount < 5}
                        />
                        {!isForgotCodeVerified && forgotTimeLeft > 0 && (
                          <Text style={styles.timerText}>{formatForgotTime(forgotTimeLeft)}</Text>
                        )}
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.verifyButton,
                          { backgroundColor: forgotCode.length === 6 && !isForgotCodeVerified && !isForgotLoading && !forgotCodeError ? COLORS.primary : theme.border }
                        ]}
                        disabled={forgotCode.length !== 6 || isForgotCodeVerified || isForgotLoading || !!forgotCodeError}
                        onPress={handleConfirmCode}
                      >
                        {isForgotLoading && !isForgotCodeVerified ? (
                          <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                          <Text style={[
                            styles.verifyButtonText,
                            { color: forgotCode.length === 6 && !isForgotCodeVerified && !forgotCodeError ? '#ffffff' : theme.textMuted }
                          ]}>
                            {isForgotCodeVerified ? '완료' : '확인'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    {isForgotCodeVerified ? (
                      <View style={styles.verifiedRow}>
                        <CheckCircle2 color={COLORS.success} size={16} />
                        <Text style={styles.verifiedText}>인증되었습니다.</Text>
                      </View>
                    ) : (forgotTimeLeft <= 0 ? (
                      <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                        인증시간이 만료되었습니다. 재요청 버튼을 눌러주세요.
                      </Text>
                    ) : (!!forgotCodeError && (
                      <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                        {forgotCodeError}
                      </Text>
                    )))}
                  </View>

                  {/* New Password input */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>새 비밀번호</Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: theme.background,
                          borderColor: newPasswordError ? COLORS.error : (newPassword.length >= 8 && !newPasswordError ? COLORS.success : theme.border),
                          color: theme.text
                        }
                      ]}
                      placeholder="8자 이상 영문, 숫자, 특수문자 조합"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry
                      value={newPassword}
                      onChangeText={(val) => {
                        setNewPassword(val);
                        validateNewPasswordFormat(val);
                      }}
                    />
                    {!!newPasswordError ? (
                      <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 2, fontWeight: '600' }}>
                        {newPasswordError}
                      </Text>
                    ) : (newPassword.length >= 8 && !newPasswordError ? (
                      <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 2, fontWeight: '700' }}>
                        ✓ 사용 가능한 안전한 비밀번호입니다.
                      </Text>
                    ) : null)}
                  </View>

                  {/* New Password Confirm input */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>새 비밀번호 재확인</Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: theme.background,
                          borderColor: newPasswordConfirm ? (newPassword === newPasswordConfirm ? COLORS.success : COLORS.error) : theme.border,
                          color: theme.text
                        }
                      ]}
                      placeholder="새 비밀번호 다시 입력"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry
                      value={newPasswordConfirm}
                      onChangeText={setNewPasswordConfirm}
                    />
                    {newPasswordConfirm && newPassword !== newPasswordConfirm ? (
                      <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 2, fontWeight: '600' }}>
                        비밀번호가 일치하지 않습니다.
                      </Text>
                    ) : (newPasswordConfirm && newPassword === newPasswordConfirm ? (
                      <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 2, fontWeight: '700' }}>
                        ✓ 비밀번호가 일치합니다.
                      </Text>
                    ) : null)}
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: forgotCode && newPassword && newPasswordConfirm && !isForgotLoading ? COLORS.primary : theme.border, height: 50 }
                  ]}
                  disabled={!forgotCode || !newPassword || !newPasswordConfirm || isForgotLoading}
                  onPress={handleConfirmPasswordReset}
                >
                  {isForgotLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={{ color: forgotCode && newPassword && newPasswordConfirm ? '#ffffff' : theme.textMuted, fontWeight: '600' }}>
                      비밀번호 재설정 완료
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
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
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  signupFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
