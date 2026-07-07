import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { Check } from 'lucide-react-native';
import { styles } from '../LoginScreen.styles';

interface LoginFormFieldsProps {
  email: string;
  onChangeEmail: (val: string) => void;
  emailError: string;
  password: string;
  onChangePassword: (val: string) => void;
  passwordError: string;
  autoLogin: boolean;
  onToggleAutoLogin: () => void;
  onForgotPassword: () => void;
  theme: { card: string; border: string; text: string; textMuted: string };
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  onChangeEmail,
  emailError,
  password,
  onChangePassword,
  passwordError,
  autoLogin,
  onToggleAutoLogin,
  onForgotPassword,
  theme,
}) => {
  return (
    <View style={styles.form}>
      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: emailError ? COLORS.error : theme.border,
              color: theme.text
            }
          ]}
          placeholder="youngsoon@deundeun.kr"
          placeholderTextColor={theme.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={onChangeEmail}
        />
        {!!emailError && (
          <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
            {emailError}
          </Text>
        )}
      </View>

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>비밀번호</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: passwordError ? COLORS.error : theme.border,
              color: theme.text
            }
          ]}
          placeholder="비밀번호 입력"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          value={password}
          onChangeText={onChangePassword}
        />
        {!!passwordError && (
          <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
            {passwordError}
          </Text>
        )}
      </View>

      {/* Checkbox and Forgot Password */}
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={onToggleAutoLogin}
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

        <TouchableOpacity onPress={onForgotPassword}>
          <Text style={[styles.forgotText, { color: COLORS.primary }]}>
            비밀번호를 잊으셨나요?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginFormFields;
