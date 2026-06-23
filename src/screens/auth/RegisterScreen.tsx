import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2 } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';

export default function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [email, setEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  // Mock code countdown timer
  useEffect(() => {
    if (!isCodeSent || isCodeVerified || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCodeSent, isCodeVerified, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendCode = () => {
    if (!email) return;
    setIsCodeSent(true);
    setTimeLeft(180);
  };

  const handleVerifyCode = () => {
    if (code.length >= 4) {
      setIsCodeVerified(true);
    }
  };

  const isFormValid = isCodeVerified && password.length >= 8 && password === confirmPassword;

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
                      borderColor: theme.border,
                      color: theme.text,
                    },
                    isCodeSent && { opacity: 0.7 }
                  ]}
                  placeholder="youngsoon@deundeun.kr"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isCodeSent}
                />
                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    { backgroundColor: email && !isCodeSent ? COLORS.primary : theme.border }
                  ]}
                  disabled={!email || isCodeSent}
                  onPress={handleSendCode}
                >
                  <Text style={[
                    styles.verifyButtonText,
                    { color: email && !isCodeSent ? '#ffffff' : theme.textMuted }
                  ]}>
                    {isCodeSent ? '전송됨' : '인증요청'}
                  </Text>
                </TouchableOpacity>
              </View>
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
                          borderColor: isCodeVerified ? COLORS.success : theme.border,
                          color: theme.text,
                        },
                        isCodeVerified && { opacity: 0.7 }
                      ]}
                      placeholder="인증번호 6자리 입력"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="number-pad"
                      value={code}
                      onChangeText={setCode}
                      editable={!isCodeVerified}
                    />
                    {!isCodeVerified && timeLeft > 0 && (
                      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.verifyButton,
                      { backgroundColor: code && !isCodeVerified ? COLORS.primary : theme.border }
                    ]}
                    disabled={!code || isCodeVerified}
                    onPress={handleVerifyCode}
                  >
                    <Text style={[
                      styles.verifyButtonText,
                      { color: code && !isCodeVerified ? '#ffffff' : theme.textMuted }
                    ]}>
                      확인
                    </Text>
                  </TouchableOpacity>
                </View>
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
                    style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    placeholder="비밀번호 입력 (8자 이상)"
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Text style={[styles.helpText, { color: theme.textMuted }]}>
                    8자 이상 영문, 숫자, 특수문자 조합
                  </Text>
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
                  {confirmPassword && password !== confirmPassword && (
                    <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4 }}>
                      비밀번호가 일치하지 않습니다.
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isFormValid ? COLORS.primary : theme.disabledBg }
            ]}
            disabled={!isFormValid}
            onPress={() => navigation.navigate('DeviceSync')}
          >
            <Text style={[
              styles.submitButtonText,
              { color: isFormValid ? '#ffffff' : theme.disabledText }
            ]}>
              다음
            </Text>
          </TouchableOpacity>
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
