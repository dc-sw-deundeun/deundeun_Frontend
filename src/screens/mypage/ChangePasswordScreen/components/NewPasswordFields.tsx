import React from 'react';
import { View, TextInput } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { styles } from '../ChangePasswordScreen.styles';

interface NewPasswordFieldsProps {
  newPassword: string;
  onChangeNewPassword: (val: string) => void;
  confirmPassword: string;
  onChangeConfirmPassword: (val: string) => void;
  isCodeVerified: boolean;
  isLengthValid: boolean;
  isPatternValid: boolean;
  isMatchValid: boolean;
  theme: { card: string; border: string; text: string; textMuted: string };
}

export const NewPasswordFields: React.FC<NewPasswordFieldsProps> = ({
  newPassword,
  onChangeNewPassword,
  confirmPassword,
  onChangeConfirmPassword,
  isCodeVerified,
  isLengthValid,
  isPatternValid,
  isMatchValid,
  theme,
}) => {
  return (
    <>
      {/* 새 비밀번호 입력 그룹 */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>새 비밀번호</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }
          ]}
          placeholder="새 비밀번호 입력"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          value={newPassword}
          onChangeText={onChangeNewPassword}
          editable={isCodeVerified}
        />
        <View style={styles.requirementsRow}>
          <View style={styles.requirementItem}>
            <Check size={14} color={isLengthValid ? '#5F8557' : '#999999'} />
            <Text style={[styles.requirementText, { color: isLengthValid ? '#5F8557' : '#999999' }]}>
              8자 이상
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <Check size={14} color={isPatternValid ? '#5F8557' : '#999999'} />
            <Text style={[styles.requirementText, { color: isPatternValid ? '#5F8557' : '#999999' }]}>
              영문·숫자·특수문자
            </Text>
          </View>
        </View>
      </View>

      {/* 새 비밀번호 확인 입력 그룹 */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>새 비밀번호 확인</Text>
        <View style={styles.passwordConfirmWrapper}>
          <TextInput
            style={[
              styles.input,
              styles.confirmInput,
              {
                backgroundColor: theme.card,
                borderColor: isMatchValid ? '#8FA480' : theme.border,
                color: theme.text
              }
            ]}
            placeholder="새 비밀번호 다시 입력"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
            editable={isCodeVerified}
          />
          {isMatchValid && (
            <View style={styles.checkIconInInput}>
              <Check size={18} color="#5F8557" />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default NewPasswordFields;
