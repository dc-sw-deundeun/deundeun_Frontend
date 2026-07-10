import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import ScreenHeader from '@/components/ScreenHeader';
import { styles } from './RegisterScreen.styles';
import { EmailVerificationField } from './components/EmailVerificationField';
import { CodeVerificationField } from './components/CodeVerificationField';
import { PasswordFields } from './components/PasswordFields';
import { ProfileFields } from './components/ProfileFields';
import { useRegisterForm } from './hooks/useRegisterForm';

export default function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
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
    nickname,
    setNickname,
    sex,
    setSex,
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
  } = useRegisterForm(navigation);

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
            <EmailVerificationField
              email={email}
              onChangeEmail={(val) => {
                setEmail(val);
                validateEmailFormat(val);
              }}
              emailError={emailError}
              isCodeSent={isCodeSent}
              isCodeVerified={isCodeVerified}
              isLoading={isLoading}
              resendCooldown={resendCooldown}
              onSendCode={handleSendCode}
              theme={theme}
            />

            {/* Verification Code Input */}
            {isCodeSent && (
              <CodeVerificationField
                code={code}
                onChangeCode={setCode}
                codeError={codeError}
                isCodeVerified={isCodeVerified}
                isLoading={isLoading}
                timeLeft={timeLeft}
                verifyFailCount={verifyFailCount}
                onVerifyCode={handleVerifyCode}
                theme={theme}
              />
            )}

            {/* Passwords and Profile - Show only after email is verified for progressive UI */}
            {isCodeVerified && (
              <>
                <PasswordFields
                  password={password}
                  onChangePassword={(val) => {
                    setPassword(val);
                    validatePasswordFormat(val);
                  }}
                  passwordError={passwordError}
                  confirmPassword={confirmPassword}
                  onChangeConfirmPassword={setConfirmPassword}
                  theme={theme}
                />
                
                <ProfileFields
                  nickname={nickname}
                  onChangeNickname={setNickname}
                  sex={sex}
                  onChangeSex={setSex}
                  theme={{ ...theme, primary: COLORS.primary }}
                />
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
