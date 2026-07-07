import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { Upload, PenTool } from 'lucide-react-native';
import { styles } from '../HistoryScreen.styles';

interface AddRecordSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (action: 'camera' | 'manual' | 'gallery') => void;
  isDarkMode: boolean;
  theme: { text: string; textMuted: string };
}

// 검진 기록 추가 방법을 선택하는 하단 액션 시트
export const AddRecordSheet: React.FC<AddRecordSheetProps> = ({
  visible,
  onClose,
  onSelect,
  isDarkMode,
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
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              borderWidth: 1,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>무엇을 추가할까요?</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: theme.textMuted, fontSize: 16 }}>취소</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionSheetList}>
            <TouchableOpacity
              style={styles.actionSheetRow}
              onPress={() => onSelect('camera')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(71,92,58,0.08)' }]}>
                <Upload color={COLORS.primary} size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionSheetTitle, { color: theme.text }]}>검진결과 업로드</Text>
                <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                  사진을 찍으면 인공지능이 수치를 자동 분석해요.
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.modalDivider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} />

            <TouchableOpacity
              style={styles.actionSheetRow}
              onPress={() => onSelect('manual')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(71,92,58,0.08)' }]}>
                <PenTool color={COLORS.primary} size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionSheetTitle, { color: theme.text }]}>직접 입력하기</Text>
                <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                  수치를 손으로 직접 입력하여 기록할게요.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddRecordSheet;
