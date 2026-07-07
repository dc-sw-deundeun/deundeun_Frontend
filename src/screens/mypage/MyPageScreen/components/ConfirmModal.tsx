import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { SPACING } from '@/constants/theme';
import { styles } from '../MyPageScreen.styles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description: string;
  confirmBgColor?: string;
  onCancel: () => void;
  onConfirm: () => void;
  theme: { text: string; border: string };
}

// 회원 탈퇴 / 로그아웃 확인용 공통 다이얼로그
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  description,
  confirmBgColor,
  onCancel,
  onConfirm,
  theme,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.deleteModalContent} padding={SPACING.lg} radius={24}>
          <Text style={styles.modalTitleText}>{title}</Text>
          <Text style={styles.modalDescriptionText}>
            {description}
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn, { borderColor: theme.border }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelBtnText, { color: theme.text }]}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                styles.confirmBtn,
                confirmBgColor ? { backgroundColor: confirmBgColor } : null,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
