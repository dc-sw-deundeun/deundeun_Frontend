import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../HomeScreen.styles';

interface MissionVerifyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
  glassModalCardStyle: any;
  theme: { textDark: string; textMuted: string; border: string };
}

export const MissionVerifyModal: React.FC<MissionVerifyModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isDarkMode,
  glassModalCardStyle,
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
        <View style={styles.modalInnerContainer}>
          {/* Options card */}
          <View style={[styles.modalOptionsCard, glassModalCardStyle]}>
            <Text style={[styles.modalTitleText, { color: isDarkMode ? '#C7C6BE' : '#8F8E84' }]}>무엇을 추가할까요?</Text>

            {/* Option 1: Camera */}
            <TouchableOpacity
              style={styles.modalOptionRow}
              onPress={onConfirm}
            >
              <View style={[styles.modalIconWrapper, { backgroundColor: isDarkMode ? 'rgba(235, 242, 232, 0.15)' : '#EBF2E8' }]}>
                <Text style={{ fontSize: 20 }}>📸</Text>
              </View>
              <View style={styles.modalTextGroup}>
                <Text style={[styles.modalOptionTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>검진 결과지 촬영</Text>
                <Text style={[styles.modalOptionDesc, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>사진을 찍으면 수치를 자동 인식해요</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.modalDivider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : theme.border }]} />

            {/* Option 2: Pencil */}
            <TouchableOpacity
              style={styles.modalOptionRow}
              onPress={onConfirm}
            >
              <View style={[styles.modalIconWrapper, { backgroundColor: isDarkMode ? 'rgba(252, 243, 230, 0.15)' : '#FCF3E6' }]}>
                <Text style={{ fontSize: 20 }}>✍️</Text>
              </View>
              <View style={styles.modalTextGroup}>
                <Text style={[styles.modalOptionTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>직접 입력하기</Text>
                <Text style={[styles.modalOptionDesc, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>수치를 손으로 입력할게요</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.modalDivider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : theme.border }]} />

            {/* Option 3: Image */}
            <TouchableOpacity
              style={styles.modalOptionRow}
              onPress={onConfirm}
            >
              <View style={[styles.modalIconWrapper, { backgroundColor: isDarkMode ? 'rgba(238, 244, 250, 0.15)' : '#EEF4FA' }]}>
                <Text style={{ fontSize: 20 }}>📄</Text>
              </View>
              <View style={styles.modalTextGroup}>
                <Text style={[styles.modalOptionTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>이미지 불러오기</Text>
                <Text style={[styles.modalOptionDesc, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>저장된 스캔 파일에서 가져와요</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Cancel Card */}
          <TouchableOpacity
            style={[styles.modalCancelCard, glassModalCardStyle]}
            onPress={onClose}
          >
            <Text style={[styles.modalCancelText, { color: isDarkMode ? '#FFFFFF' : '#8F8E84' }]}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MissionVerifyModal;
