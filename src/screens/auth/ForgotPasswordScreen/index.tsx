import React from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import ScreenHeader from '@/components/ScreenHeader';
import { styles } from '../LoginScreen/LoginScreen.styles';
import { useForgotPassword } from './hooks/useForgotPassword';
import { ForgotEmailStep } from './components/ForgotEmailStep';
import { ForgotResetStep } from './components/ForgotResetStep';

export default function ForgotPasswordScreen({ navigation }: RootStackScreenProps<'ForgotPassword'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
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
  } = useForgotPassword((resetEmail) => {
    // Navigate back to Login with the reset email so it can be populated
    navigation.navigate('Login', { prefilledEmail: resetEmail });
  });

  // Because useForgotPassword hook has a modal visible state we need to make sure we don't care about it here, 
  // or we need to pass true since it checks `!forgotModalVisible` in useEffect for timer.
  // We should actually update the hook to remove the modal logic, but for now we'll just remove the modal visible check in hook or let it run.
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader title={forgotStep === 1 ? '비밀번호 찾기' : '새 비밀번호 설정'} onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.modalContent, { backgroundColor: 'transparent', padding: 0 }]}>
            {forgotStep === 1 ? (
              <ForgotEmailStep
                forgotEmail={forgotEmail}
                onChangeForgotEmail={(val) => {
                  setForgotEmail(val);
                  if (forgotEmailError) setForgotEmailError('');
                }}
                forgotEmailError={forgotEmailError}
                isForgotLoading={isForgotLoading}
                onSendForgotEmail={handleSendForgotEmail}
                theme={theme}
              />
            ) : (
              <ForgotResetStep
                forgotEmail={forgotEmail}
                forgotCode={forgotCode}
                onChangeForgotCode={(val) => {
                  setForgotCode(val);
                  validateForgotCodeFormat(val);
                }}
                forgotCodeError={forgotCodeError}
                isForgotCodeVerified={isForgotCodeVerified}
                forgotTimeLeft={forgotTimeLeft}
                forgotResendCooldown={forgotResendCooldown}
                forgotVerifyFailCount={forgotVerifyFailCount}
                isForgotLoading={isForgotLoading}
                onResendEmail={handleSendForgotEmail}
                onConfirmCode={handleConfirmCode}
                newPassword={newPassword}
                onChangeNewPassword={(val) => {
                  setNewPassword(val);
                  validateNewPasswordFormat(val);
                }}
                newPasswordError={newPasswordError}
                newPasswordConfirm={newPasswordConfirm}
                onChangeNewPasswordConfirm={setNewPasswordConfirm}
                onConfirmPasswordReset={handleConfirmPasswordReset}
                theme={theme}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
