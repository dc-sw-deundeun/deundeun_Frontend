import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { CheckCircle2 } from 'lucide-react-native';
import { styles } from '../RegisterScreen.styles';
import { formatTime } from '../utils';

interface CodeVerificationFieldProps {
  code: string;
  onChangeCode: (val: string) => void;
  codeError: string;
  isCodeVerified: boolean;
  isLoading: boolean;
  timeLeft: number;
  verifyFailCount: number;
  onVerifyCode: () => void;
  theme: { card: string; border: string; text: string; textMuted: string };
}

export const CodeVerificationField: React.FC<CodeVerificationFieldProps> = ({
  code,
  onChangeCode,
  codeError,
  isCodeVerified,
  isLoading,
  timeLeft,
  verifyFailCount,
  onVerifyCode,
  theme,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text }]}>인증번호</Text>
      <View style={styles.row}>
        <View style={{ flex: 1, position: 'relative' }}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                borderColor: isCodeVerified ? COLORS.success : (codeError ? COLORS.error : theme.border),
                color: theme.text,
              },
              isCodeVerified && { opacity: 0.7 }
            ]}
            placeholder="인증번호 6자리 입력"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={code}
            onChangeText={onChangeCode}
            editable={!isCodeVerified && timeLeft > 0 && verifyFailCount < 5}
            maxLength={6}
          />
          {!isCodeVerified && timeLeft > 0 && (
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { backgroundColor: code.length === 6 && !isCodeVerified && !isLoading && !codeError ? COLORS.primary : theme.border }
          ]}
          disabled={code.length !== 6 || isCodeVerified || isLoading || !!codeError}
          onPress={onVerifyCode}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={[
              styles.verifyButtonText,
              { color: code.length === 6 && !isCodeVerified && !codeError ? '#ffffff' : theme.textMuted }
            ]}>
              확인
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {!!codeError && (
        <Text style={{ color: COLORS.error, fontSize: 13, marginTop: 4, fontWeight: '600' }}>
          {codeError}
        </Text>
      )}
      {isCodeVerified && (
        <View style={styles.verifiedRow}>
          <CheckCircle2 color={COLORS.success} size={16} />
          <Text style={styles.verifiedText}>인증되었어요</Text>
        </View>
      )}
    </View>
  );
};

export default CodeVerificationField;
