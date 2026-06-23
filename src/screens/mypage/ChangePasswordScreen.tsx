import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';

export default function ChangePasswordScreen({ navigation }: RootStackScreenProps<'ChangePassword'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;

    setSuccessModalVisible(true);
  };

  const handleModalClose = () => {
    setSuccessModalVisible(false);
    // Redirect to Login as per wireframe spec
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader title="비밀번호 변경" onBack={() => navigation.goBack()} />

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>새로운 비밀번호 설정</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              안전을 위해 영문, 숫자, 특수문자를 섞어 8자 이상으로 설정해 주세요.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>현재 비밀번호</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="현재 비밀번호 입력"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>새 비밀번호</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="새 비밀번호 입력 (8자 이상)"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>새 비밀번호 확인</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: confirmPassword ? (newPassword === confirmPassword ? COLORS.success : COLORS.error) : theme.border,
                    color: theme.text
                  }
                ]}
                placeholder="새 비밀번호 다시 입력"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4 }}>
                  새 비밀번호가 일치하지 않습니다.
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isFormValid ? COLORS.primary : theme.disabledBg }
            ]}
            disabled={!isFormValid}
            onPress={handleSave}
          >
            <Text style={[
              styles.submitButtonText,
              { color: isFormValid ? '#ffffff' : theme.disabledText }
            ]}>
              비밀번호 변경 완료
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Change Password Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <CheckCircle2 color={COLORS.success} size={48} />
            <Text style={[styles.modalTitle, { color: theme.text }]}>비밀번호가 변경되었습니다</Text>
            <Text style={[styles.modalDesc, { color: theme.textMuted }]}>
              보안을 위해 변경된 비밀번호로{"\n"}다시 로그인해 주시기 바랍니다.
            </Text>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: COLORS.primary }]}
              onPress={handleModalClose}
            >
              <Text style={styles.modalBtnText}>로그인 화면으로 돌아가기</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
  },
  form: {
    flex: 1,
    gap: SPACING.lg,
    marginVertical: SPACING.xl,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  modalBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: SPACING.xs,
  },
  modalBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
