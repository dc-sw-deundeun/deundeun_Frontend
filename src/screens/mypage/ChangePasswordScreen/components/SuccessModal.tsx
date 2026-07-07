import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { SPACING } from '@/constants/theme';
import { Check } from 'lucide-react-native';
import { styles } from '../ChangePasswordScreen.styles';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalCard} padding={SPACING.xl} radius={28}>
          <Text style={styles.modalTitle}>비밀번호가 변경되었습니다.</Text>

          {/* 큰 체크박스 아이콘 */}
          <View style={styles.circleCheckWrapper}>
            <Check size={48} color="#5F8557" />
          </View>

          <View style={styles.modalDescContainer}>
            <Text style={styles.modalDescText}>변경된 비밀번호로 재로그인 바랍니다.</Text>
          </View>

          <TouchableOpacity
            style={styles.modalSubmitBtn}
            onPress={onClose}
          >
            <Text style={styles.modalSubmitBtnText}>로그인 화면으로 돌아가기</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Modal>
  );
};

export default SuccessModal;
