import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { CheckCircle2 } from 'lucide-react-native';
import { styles } from '../../LoginScreen/LoginScreen.styles';
import { formatForgotTime } from '../../LoginScreen/utils';

interface ForgotResetStepProps {
  forgotEmail: string;
  forgotCode: string;
  onChangeForgotCode: (val: string) => void;
  forgotCodeError: string;
  isForgotCodeVerified: boolean;
  forgotTimeLeft: number;
  forgotResendCooldown: number;
  forgotVerifyFailCount: number;
  isForgotLoading: boolean;
  onResendEmail: () => void;
  onConfirmCode: () => void;
  newPassword: string;
  onChangeNewPassword: (val: string) => void;
  newPasswordError: string;
  newPasswordConfirm: string;
  onChangeNewPasswordConfirm: (val: string) => void;
  onConfirmPasswordReset: () => void;
  theme: { background: string; border: string; text: string; textMuted: string };
}

export const ForgotResetStep: React.FC<ForgotResetStepProps> = ({
  forgotEmail,
  forgotCode,
  onChangeForgotCode,
  forgotCodeError,
  isForgotCodeVerified,
  forgotTimeLeft,
  forgotResendCooldown,
  forgotVerifyFailCount,
  isForgotLoading,
  onResendEmail,
  onConfirmCode,
  newPassword,
  onChangeNewPassword,
  newPasswordError,
  newPasswordConfirm,
  onChangeNewPasswordConfirm,
  onConfirmPasswordReset,
  theme,
}) => {
  return (
    <>
      <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
        이메일로 전송된 인증코드와{"\n"}새로운 비밀번호를 입력해 주세요.
      </Text>

      <View style={{ gap: SPACING.md, marginVertical: SPACING.md }}>
        {/* 1. Email Row with Resend Button matching RegisterScreen */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
          <View style={styles.row}>
            <TextInput
              style={[
                styles.input,
                {
                  flex: 1,
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                  opacity: 0.7
                }
              ]}
              value={forgotEmail}
              editable={false}
            />
            <TouchableOpacity
              style={[
                styles.verifyButton,
                { backgroundColor: !isForgotLoading && forgotResendCooldown === 0 ? COLORS.primary : theme.border }
              ]}
              disabled={isForgotLoading || forgotResendCooldown > 0}
              onPress={onResendEmail}
            >
              {isForgotLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={[
                  styles.verifyButtonText,
                  { color: forgotResendCooldown === 0 ? '#ffffff' : theme.textMuted }
                ]}>
                  {forgotResendCooldown > 0 ? `재요청 (${forgotResendCooldown}초)` : '재요청'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Verification Code Row matching RegisterScreen */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>인증번호</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, position: 'relative' }}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: isForgotCodeVerified ? COLORS.success : (forgotCodeError ? COLORS.error : theme.border),
                    color: theme.text
                  },
                  isForgotCodeVerified && { opacity: 0.7 }
                ]}
                placeholder="인증번호 6자리 입력"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                value={forgotCode}
                onChangeText={onChangeForgotCode}
                editable={!isForgotCodeVerified && forgotTimeLeft > 0 && forgotVerifyFailCount < 5}
              />
              {!isForgotCodeVerified && forgotTimeLeft > 0 && (
                <Text style={styles.timerText}>{formatForgotTime(forgotTimeLeft)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                { backgroundColor: forgotCode.length === 6 && !isForgotCodeVerified && !isForgotLoading && !forgotCodeError ? COLORS.primary : theme.border }
              ]}
              disabled={forgotCode.length !== 6 || isForgotCodeVerified || isForgotLoading || !!forgotCodeError}
              onPress={onConfirmCode}
            >
              {isForgotLoading && !isForgotCodeVerified ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={[
                  styles.verifyButtonText,
                  { color: forgotCode.length === 6 && !isForgotCodeVerified && !forgotCodeError ? '#ffffff' : theme.textMuted }
                ]}>
                  {isForgotCodeVerified ? '완료' : '확인'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {isForgotCodeVerified ? (
            <View style={styles.verifiedRow}>
              <CheckCircle2 color={COLORS.success} size={16} />
              <Text style={styles.verifiedText}>인증되었습니다.</Text>
            </View>
          ) : (forgotTimeLeft <= 0 ? (
            <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
              인증시간이 만료되었습니다. 재요청 버튼을 눌러주세요.
            </Text>
          ) : (!!forgotCodeError && (
            <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4, fontWeight: '600' }}>
              {forgotCodeError}
            </Text>
          )))}
        </View>

        {/* New Password input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>새 비밀번호</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                borderColor: newPasswordError ? COLORS.error : (newPassword.length >= 8 && !newPasswordError ? COLORS.success : theme.border),
                color: theme.text
              }
            ]}
            placeholder="8자 이상 영문, 숫자, 특수문자 조합"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            value={newPassword}
            onChangeText={onChangeNewPassword}
          />
          {!!newPasswordError ? (
            <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 2, fontWeight: '600' }}>
              {newPasswordError}
            </Text>
          ) : (newPassword.length >= 8 && !newPasswordError ? (
            <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 2, fontWeight: '700' }}>
              ✓ 사용 가능한 안전한 비밀번호입니다.
            </Text>
          ) : null)}
        </View>

        {/* New Password Confirm input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>새 비밀번호 재확인</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                borderColor: newPasswordConfirm ? (newPassword === newPasswordConfirm ? COLORS.success : COLORS.error) : theme.border,
                color: theme.text
              }
            ]}
            placeholder="새 비밀번호 다시 입력"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            value={newPasswordConfirm}
            onChangeText={onChangeNewPasswordConfirm}
          />
          {newPasswordConfirm && newPassword !== newPasswordConfirm ? (
            <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 2, fontWeight: '600' }}>
              비밀번호가 일치하지 않습니다.
            </Text>
          ) : (newPasswordConfirm && newPassword === newPasswordConfirm ? (
            <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 2, fontWeight: '700' }}>
              ✓ 비밀번호가 일치합니다.
            </Text>
          ) : null)}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: forgotCode && newPassword && newPasswordConfirm && !isForgotLoading ? COLORS.primary : theme.border, height: 50 }
        ]}
        disabled={!forgotCode || !newPassword || !newPasswordConfirm || isForgotLoading}
        onPress={onConfirmPasswordReset}
      >
        {isForgotLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={{ color: forgotCode && newPassword && newPasswordConfirm ? '#ffffff' : theme.textMuted, fontWeight: '600' }}>
            비밀번호 재설정 완료
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default ForgotResetStep;
