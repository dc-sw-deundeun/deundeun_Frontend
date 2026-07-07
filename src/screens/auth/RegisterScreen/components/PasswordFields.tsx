import React from 'react';
import { View, TextInput } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { styles } from '../RegisterScreen.styles';

interface PasswordFieldsProps {
  password: string;
  onChangePassword: (val: string) => void;
  passwordError: string;
  confirmPassword: string;
  onChangeConfirmPassword: (val: string) => void;
  theme: { card: string; border: string; text: string; textMuted: string };
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  onChangePassword,
  passwordError,
  confirmPassword,
  onChangeConfirmPassword,
  theme,
}) => {
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>비밀번호</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: passwordError ? COLORS.error : (password.length >= 8 && !passwordError ? COLORS.success : theme.border),
              color: theme.text
            }
          ]}
          placeholder="비밀번호 입력 (8자 이상 영문, 숫자, 특수문자)"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          value={password}
          onChangeText={onChangePassword}
        />
        {!!passwordError ? (
          <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
            {passwordError}
          </Text>
        ) : (password.length >= 8 && !passwordError ? (
          <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 4, fontWeight: '700' }}>
            ✓ 사용 가능한 안전한 비밀번호입니다.
          </Text>
        ) : (
          <Text style={[styles.helpText, { color: theme.textMuted }]}>
            8자 이상 영문, 숫자, 특수문자 조합
          </Text>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>비밀번호 재확인</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: confirmPassword ? (password === confirmPassword ? COLORS.success : COLORS.error) : theme.border,
              color: theme.text
            }
          ]}
          placeholder="비밀번호 다시 입력"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
        />
        {confirmPassword && password !== confirmPassword ? (
          <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
            비밀번호가 일치하지 않습니다.
          </Text>
        ) : (confirmPassword && password === confirmPassword ? (
          <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 4, fontWeight: '700' }}>
            ✓ 비밀번호가 일치합니다.
          </Text>
        ) : null)}
      </View>
    </>
  );
};

export default PasswordFields;
