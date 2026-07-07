import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../PracticeScreen.styles';

interface VerifyMissionModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  theme: { card: string; text: string; textMuted: string; border: string };
}

export const VerifyMissionModal: React.FC<VerifyMissionModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  theme,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalInnerContainer}>
          {/* Options card */}
          <View style={[styles.modalOptionsCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitleText, { color: '#8F8E84' }]}>무엇을 추가할까요?</Text>

            {/* Option 1: Camera */}
            <TouchableOpacity
              style={styles.modalOptionRow}
              onPress={onConfirm}
            >
              <View style={[styles.modalIconWrapper, { backgroundColor: '#EBF2E8' }]}>
                <Text style={{ fontSize: 20 }}>📸</Text>
              </View>
              <View style={styles.modalTextGroup}>
                <Text style={[styles.modalOptionTitle, { color: theme.text }]}>검진 결과지 촬영</Text>
                <Text style={[styles.modalOptionDesc, { color: theme.textMuted }]}>사진을 찍으면 수치를 자동 인식해요</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

            {/* Option 2: Pencil */}
            <TouchableOpacity
              style={styles.modalOptionRow}
              onPress={onConfirm}
            >
              <View style={[styles.modalIconWrapper, { backgroundColor: '#FCF3E6' }]}>
                <Text style={{ fontSize: 20 }}>✍️</Text>
              </View>
              <View style={styles.modalTextGroup}>
                <Text style={[styles.modalOptionTitle, { color: theme.text }]}>직접 입력하기</Text>
                <Text style={[styles.modalOptionDesc, { color: theme.textMuted }]}>수치를 손으로 입력할게요</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

            {/* Option 3: Image */}
            <TouchableOpacity
              style={styles.modalOptionRow}
              onPress={onConfirm}
            >
              <View style={[styles.modalIconWrapper, { backgroundColor: '#EEF4FA' }]}>
                <Text style={{ fontSize: 20 }}>📄</Text>
              </View>
              <View style={styles.modalTextGroup}>
                <Text style={[styles.modalOptionTitle, { color: theme.text }]}>이미지 불러오기</Text>
                <Text style={[styles.modalOptionDesc, { color: theme.textMuted }]}>저장된 스캔 파일에서 가져와요</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Cancel Card */}
          <TouchableOpacity
            style={[styles.modalCancelCard, { backgroundColor: theme.card }]}
            onPress={onCancel}
          >
            <Text style={styles.modalCancelText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyMissionModal;
