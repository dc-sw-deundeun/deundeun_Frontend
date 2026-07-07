import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { styles } from '../ChangePasswordScreen.styles';
import { formatTimer } from '../utils';

interface CodeVerifyFieldProps {
  code: string;
  onChangeCode: (val: string) => void;
  isCodeVerified: boolean;
  timer: number;
  loading: boolean;
  onConfirmVerify: () => void;
  theme: { card: string; border: string; text: string; textMuted: string; disabledBg: string };
}

export const CodeVerifyField: React.FC<CodeVerifyFieldProps> = ({
  code,
  onChangeCode,
  isCodeVerified,
  timer,
  loading,
  onConfirmVerify,
  theme,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text }]}>인증번호</Text>
      <View style={styles.inlineRow}>
        <View style={styles.timerInputWrapper}>
          <TextInput
            style={[
              styles.input,
              styles.timerInput,
              { backgroundColor: theme.card, borderColor: isCodeVerified ? '#8FA480' : theme.border, color: theme.text }
            ]}
            placeholder="인증번호 6자리 입력"
            placeholderTextColor={theme.textMuted}
            value={code}
            onChangeText={onChangeCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isCodeVerified}
          />
          {!isCodeVerified && timer > 0 && (
            <Text style={styles.timerText}>{formatTimer(timer)}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.inlineBtnSubmit,
            { backgroundColor: isCodeVerified ? theme.disabledBg : '#3D4C3A' }
          ]}
          onPress={onConfirmVerify}
          disabled={isCodeVerified || !code || loading}
        >
          <Text style={styles.inlineBtnSubmitText}>확인</Text>
        </TouchableOpacity>
      </View>
      {isCodeVerified && (
        <View style={styles.successCheckRow}>
          <Check size={14} color="#5F8557" />
          <Text style={styles.successCheckText}>인증되었어요</Text>
        </View>
      )}
    </View>
  );
};

export default CodeVerifyField;
