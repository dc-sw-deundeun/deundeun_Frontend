import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import Input from '@/components/Input';
import { Mail } from 'lucide-react-native';
import { styles } from '../../LoginScreen/LoginScreen.styles';
import { COLORS, SPACING } from '@/constants/theme';

interface ForgotEmailStepProps {
  forgotEmail: string;
  onChangeForgotEmail: (val: string) => void;
  forgotEmailError: string;
  isForgotLoading: boolean;
  onSendForgotEmail: () => void;
  theme: { background: string; border: string; text: string; textMuted: string };
}

export const ForgotEmailStep: React.FC<ForgotEmailStepProps> = ({
  forgotEmail,
  onChangeForgotEmail,
  forgotEmailError,
  isForgotLoading,
  onSendForgotEmail,
  theme,
}) => {
  return (
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
          onChangeText={onChangeForgotEmail}
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
        onPress={onSendForgotEmail}
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
  );
};

export default ForgotEmailStep;
