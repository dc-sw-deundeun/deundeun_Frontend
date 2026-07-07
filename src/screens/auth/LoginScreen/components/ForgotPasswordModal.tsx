import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import { X } from 'lucide-react-native';
import { styles } from '../LoginScreen.styles';
import { ForgotEmailStep } from './ForgotEmailStep';
import { ForgotResetStep } from './ForgotResetStep';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  forgotStep: 1 | 2;
  forgotEmail: string;
  onChangeForgotEmail: (val: string) => void;
  forgotEmailError: string;
  forgotCode: string;
  onChangeForgotCode: (val: string) => void;
  forgotCodeError: string;
  isForgotCodeVerified: boolean;
  forgotTimeLeft: number;
  forgotResendCooldown: number;
  forgotVerifyFailCount: number;
  isForgotLoading: boolean;
  onSendForgotEmail: () => void;
  onConfirmCode: () => void;
  newPassword: string;
  onChangeNewPassword: (val: string) => void;
  newPasswordError: string;
  newPasswordConfirm: string;
  onChangeNewPasswordConfirm: (val: string) => void;
  onConfirmPasswordReset: () => void;
  theme: { card: string; background: string; border: string; text: string; textMuted: string };
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  forgotStep,
  forgotEmail,
  onChangeForgotEmail,
  forgotEmailError,
  forgotCode,
  onChangeForgotCode,
  forgotCodeError,
  isForgotCodeVerified,
  forgotTimeLeft,
  forgotResendCooldown,
  forgotVerifyFailCount,
  isForgotLoading,
  onSendForgotEmail,
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {forgotStep === 1 ? '비밀번호 찾기' : '새 비밀번호 설정'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X color={theme.text} size={24} />
            </TouchableOpacity>
          </View>

          {forgotStep === 1 ? (
            <ForgotEmailStep
              forgotEmail={forgotEmail}
              onChangeForgotEmail={onChangeForgotEmail}
              forgotEmailError={forgotEmailError}
              isForgotLoading={isForgotLoading}
              onSendForgotEmail={onSendForgotEmail}
              theme={theme}
            />
          ) : (
            <ForgotResetStep
              forgotEmail={forgotEmail}
              forgotCode={forgotCode}
              onChangeForgotCode={onChangeForgotCode}
              forgotCodeError={forgotCodeError}
              isForgotCodeVerified={isForgotCodeVerified}
              forgotTimeLeft={forgotTimeLeft}
              forgotResendCooldown={forgotResendCooldown}
              forgotVerifyFailCount={forgotVerifyFailCount}
              isForgotLoading={isForgotLoading}
              onResendEmail={onSendForgotEmail}
              onConfirmCode={onConfirmCode}
              newPassword={newPassword}
              onChangeNewPassword={onChangeNewPassword}
              newPasswordError={newPasswordError}
              newPasswordConfirm={newPasswordConfirm}
              onChangeNewPasswordConfirm={onChangeNewPasswordConfirm}
              onConfirmPasswordReset={onConfirmPasswordReset}
              theme={theme}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;
