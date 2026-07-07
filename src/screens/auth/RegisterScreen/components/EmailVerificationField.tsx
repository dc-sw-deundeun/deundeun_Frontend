import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { styles } from '../RegisterScreen.styles';

interface EmailVerificationFieldProps {
  email: string;
  onChangeEmail: (val: string) => void;
  emailError: string;
  isCodeSent: boolean;
  isCodeVerified: boolean;
  isLoading: boolean;
  resendCooldown: number;
  onSendCode: () => void;
  theme: { card: string; border: string; text: string; textMuted: string };
}

export const EmailVerificationField: React.FC<EmailVerificationFieldProps> = ({
  email,
  onChangeEmail,
  emailError,
  isCodeSent,
  isCodeVerified,
  isLoading,
  resendCooldown,
  onSendCode,
  theme,
}) => {
  return (
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
          onChangeText={onChangeEmail}
          editable={!isCodeSent}
        />
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { backgroundColor: email && !isLoading && !emailError && !isCodeVerified && resendCooldown === 0 ? COLORS.primary : theme.border }
          ]}
          disabled={!email || isLoading || !!emailError || isCodeVerified || resendCooldown > 0}
          onPress={onSendCode}
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
  );
};

export default EmailVerificationField;
