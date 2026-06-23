import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  // Forgot Password modal state
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSent, setIsForgotSent] = useState(false);

  const handleLogin = () => {
    // Navigate to MainTabs and reset
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
    });
  };

  const handleSendForgotEmail = () => {
    if (!forgotEmail) return;
    setIsForgotSent(true);
    setTimeout(() => {
      setIsForgotSent(false);
      setForgotModalVisible(false);
      setForgotEmail('');
      alert('임시 비밀번호가 메일로 발송되었습니다!');
    }, 1500);
  };

  const isFormValid = email.length > 0 && password.length > 0;

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
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="youngsoon@deundeun.kr"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>비밀번호</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="비밀번호 입력"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Checkbox and Forgot Password */}
            <View style={styles.row}>
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
                { backgroundColor: isFormValid ? COLORS.primary : theme.disabledBg }
              ]}
              disabled={!isFormValid}
              onPress={handleLogin}
            >
              <Text style={[
                styles.submitButtonText,
                { color: isFormValid ? '#ffffff' : theme.disabledText }
              ]}>
                로그인
              </Text>
            </TouchableOpacity>

            {/* Signup Footer */}
            <View style={styles.signupFooter}>
              <Text style={[styles.signupText, { color: theme.textMuted }]}>아직 회원이 아니신가요?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
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
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>비밀번호 찾기</Text>
              <TouchableOpacity onPress={() => setForgotModalVisible(false)}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>닫기</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
              가입하신 이메일 주소를 입력하시면{"\n"}임시 비밀번호를 보내드려요.
            </Text>

            <View style={[styles.inputGroup, { marginVertical: SPACING.md }]}>
              <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                placeholder="youngsoon@deundeun.kr"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={forgotEmail}
                onChangeText={setForgotEmail}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: forgotEmail ? COLORS.primary : theme.border, height: 50 }
              ]}
              disabled={!forgotEmail || isForgotSent}
              onPress={handleSendForgotEmail}
            >
              <Text style={{ color: forgotEmail ? '#ffffff' : theme.textMuted, fontWeight: '600' }}>
                {isForgotSent ? '전송 중...' : '임시 비밀번호 받기'}
              </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
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
