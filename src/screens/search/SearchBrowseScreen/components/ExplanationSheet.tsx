import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { Heart } from 'lucide-react-native';
import { DiseaseResult } from '@/api';
import { styles } from '../SearchBrowseScreen.styles';

interface ExplanationSheetProps {
  visible: boolean;
  disease: DiseaseResult | null;
  onClose: () => void;
  onRequestMission: () => void;
  theme: { text: string; textMuted: string; background: string; card: string };
}

export const ExplanationSheet: React.FC<ExplanationSheetProps> = ({
  visible,
  disease,
  onClose,
  onRequestMission,
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Heart color={COLORS.error} size={20} fill={COLORS.error + '30'} />
              <Text style={[styles.modalTitle, { color: theme.text }]}>{disease?.name} 쉽게 이해하기</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: theme.textMuted, fontSize: 16 }}>닫기</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.explanBody, { backgroundColor: theme.background }]}>
            <Text style={[styles.explanValueTitle, { color: theme.text }]}>
              {disease?.name.includes('콜레스테롤') ? '232 mg/dL' : '126 mg/dL'}
            </Text>
            <View style={[styles.explanStatusBadge, { backgroundColor: COLORS.warning + '15' }]}>
              <Text style={[styles.explanStatusText, { color: COLORS.warning }]}>주의 단계</Text>
            </View>

            <Text style={[styles.explanParagraph, { color: theme.text }]}>
              {disease?.description}
            </Text>

            <View style={styles.dosDontsRow}>
              <View style={[styles.boxCard, { backgroundColor: COLORS.primaryLight + '40', borderColor: COLORS.primary }]}>
                <Text style={[styles.boxHeader, { color: COLORS.primaryDark }]}>👍 이렇게 해요</Text>
                <Text style={[styles.boxText, { color: theme.text }]}>
                  {disease?.name.includes('콜레스테롤')
                    ? `- 식이섬유 풍부한 채소 섭취\n- 하루 30분 유산소 운동`
                    : `- 식후 가벼운 산책\n- 설탕/단 음료 줄이기`}
                </Text>
              </View>

              <View style={[styles.boxCard, { backgroundColor: COLORS.error + '05', borderColor: COLORS.error }]}>
                <Text style={[styles.boxHeader, { color: COLORS.error }]}>👎 이건 피해요</Text>
                <Text style={[styles.boxText, { color: theme.text }]}>
                  {disease?.name.includes('콜레스테롤')
                    ? `- 튀김류 등 고포화지방 식단\n- 늦은 시간 야식`
                    : `- 단 액상과당 음료\n- 기름진 인스턴트 식품`}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.sheetActionBtn, { backgroundColor: COLORS.primary }]}
            onPress={onRequestMission}
          >
            <Text style={styles.sheetActionText}>맞춤 미션 받기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ExplanationSheet;
