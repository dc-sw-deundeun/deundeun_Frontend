import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import ScreenHeader from '@/components/ScreenHeader';
import { styles } from './LoginScreen.styles';
import { LoginFormFields } from './components/LoginFormFields';
import { useLoginForm } from './hooks/useLoginForm';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
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
  } = useLoginForm(navigation);

  // Check if we returned from ForgotPassword with a prefilled email
  React.useEffect(() => {
    const params = (navigation as any).getState().routes.find((r: any) => r.name === 'Login')?.params;
    if (params?.prefilledEmail) {
      setEmail(params.prefilledEmail);
      navigation.setParams({ prefilledEmail: undefined } as any);
    }
  }, [navigation]);

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
          <LoginFormFields
            email={email}
            onChangeEmail={(val) => {
              setEmail(val);
              validateEmailFormat(val);
              if (passwordError) setPasswordError('');
            }}
            emailError={emailError}
            password={password}
            onChangePassword={(val) => {
              setPassword(val);
              validatePasswordFormat(val);
            }}
            passwordError={passwordError}
            autoLogin={autoLogin}
            onToggleAutoLogin={() => setAutoLogin(!autoLogin)}
            onForgotPassword={() => navigation.navigate('ForgotPassword')}
            theme={theme}
          />

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
    </SafeAreaView>
  );
}
