import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import { SPACING } from '@/constants/theme';
import { styles } from '../MyPageScreen.styles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description: string;
  icon?: React.ReactNode;
  confirmBgColor?: string;
  confirmText?: string;
  hideCancel?: boolean;
  onCancel?: () => void;
  onConfirm: () => void;
  theme: { text: string; border: string; card?: string };
}

// 회원 탈퇴 / 로그아웃 확인용 공통 다이얼로그
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  description,
  icon,
  confirmBgColor,
  confirmText = '확인',
  hideCancel = false,
  onCancel,
  onConfirm,
  theme,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.modalOverlay}>
        <View 
          style={[
            styles.deleteModalContent, 
            { 
              backgroundColor: theme.card || '#ffffff', 
              borderRadius: 24, 
              padding: SPACING.lg,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 15,
              elevation: 5,
            }
          ]}
        >
          {icon ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {icon}
              <Text style={styles.modalTitleText}>{title}</Text>
            </View>
          ) : (
            <Text style={styles.modalTitleText}>{title}</Text>
          )}
          <Text style={styles.modalDescriptionText}>
            {description}
          </Text>
          <View style={styles.modalActions}>
            {!hideCancel && (
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn, { borderColor: theme.border }]}
                onPress={onCancel}
              >
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>취소</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.modalBtn,
                styles.confirmBtn,
                confirmBgColor ? { backgroundColor: confirmBgColor } : null,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
