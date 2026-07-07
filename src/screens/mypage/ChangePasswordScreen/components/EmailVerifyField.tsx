import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { styles } from '../ChangePasswordScreen.styles';

interface EmailVerifyFieldProps {
  email: string;
  onChangeEmail: (val: string) => void;
  isCodeSent: boolean;
  isCodeVerified: boolean;
  loading: boolean;
  onRequestVerify: () => void;
  theme: { card: string; border: string; text: string; textMuted: string };
}

export const EmailVerifyField: React.FC<EmailVerifyFieldProps> = ({
  email,
  onChangeEmail,
  isCodeSent,
  isCodeVerified,
  loading,
  onRequestVerify,
  theme,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
      <View style={styles.inlineRow}>
        <TextInput
          style={[
            styles.input,
            styles.flexInput,
            { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }
          ]}
          placeholder="예: youngsoon@deundeun.kr"
          placeholderTextColor={theme.textMuted}
          value={email}
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isCodeVerified}
        />
        <TouchableOpacity
          style={[
            styles.inlineBtn,
            { borderColor: isCodeVerified ? theme.border : COLORS.primary }
          ]}
          onPress={onRequestVerify}
          disabled={isCodeVerified || loading}
        >
          <Text style={[
            styles.inlineBtnText,
            { color: isCodeVerified ? theme.textMuted : '#354B33' }
          ]}>
            {isCodeSent ? '재요청' : '인증요청'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmailVerifyField;
