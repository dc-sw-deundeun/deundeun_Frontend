import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './ChangePasswordScreen.styles';
import { EmailVerifyField } from './components/EmailVerifyField';
import { CodeVerifyField } from './components/CodeVerifyField';
import { NewPasswordFields } from './components/NewPasswordFields';
import { SuccessModal } from './components/SuccessModal';
import { useChangePasswordForm } from './hooks/useChangePasswordForm';

export default function ChangePasswordScreen({ navigation }: RootStackScreenProps<'ChangePassword'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
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
  } = useChangePasswordForm(navigation);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScreenHeader title="비밀번호 변경" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            {/* 가이드 배너 */}
            <View style={styles.bannerContainer}>
              <Lock size={18} color="#D09C4A" />
              <Text style={styles.bannerText}>
                안전을 위해 영문·숫자·특수문자를 섞어 8자 이상으로 설정해 주세요.
              </Text>
            </View>

            {/* 입력 폼 */}
            <View style={styles.form}>
              <EmailVerifyField
                email={email}
                onChangeEmail={setEmail}
                isCodeSent={isCodeSent}
                isCodeVerified={isCodeVerified}
                loading={loading}
                onRequestVerify={handleRequestVerify}
                theme={theme}
              />

              {isCodeSent && (
                <CodeVerifyField
                  code={code}
                  onChangeCode={setCode}
                  isCodeVerified={isCodeVerified}
                  timer={timer}
                  loading={loading}
                  onConfirmVerify={handleConfirmVerify}
                  theme={theme}
                />
              )}

              <NewPasswordFields
                newPassword={newPassword}
                onChangeNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                onChangeConfirmPassword={setConfirmPassword}
                isCodeVerified={isCodeVerified}
                isLengthValid={isLengthValid}
                isPatternValid={isPatternValid}
                isMatchValid={isMatchValid}
                theme={theme}
              />
            </View>
          </View>

          {/* 변경 완료 버튼 */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: canSubmit ? '#3D4C3A' : theme.disabledBg }
            ]}
            disabled={!canSubmit || loading}
            onPress={handleCompleteChange}
          >
            <Text style={[styles.submitButtonText, { color: canSubmit ? '#ffffff' : theme.disabledText }]}>
              비밀번호 변경 완료
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 비밀번호 변경 완료 성공 모달 */}
      <SuccessModal visible={successModalVisible} onClose={handleModalClose} />
    </SafeAreaView>
  );
}
