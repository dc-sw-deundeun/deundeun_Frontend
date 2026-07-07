import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { Trophy } from 'lucide-react-native';
import { styles } from '../HomeScreen.styles';

interface LevelUpModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirmClose: () => void;
  levelUpAnimal: string;
  theme: { textDark: string; textMuted: string };
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ visible, onRequestClose, onConfirmClose, levelUpAnimal, theme }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.dialogOverlay}>
        <View style={[styles.levelUpDialog, { backgroundColor: '#ffffff' }]}>
          <View style={styles.levelUpStars}>
            <Trophy color="#EF6C00" size={48} fill="#EF6C00" />
          </View>

          <Text style={[styles.levelUpBadge, { color: COLORS.primary }]}>LEVEL UP! ✦</Text>
          <Text style={[styles.levelUpTitle, { color: theme.textDark }]}>
            {levelUpAnimal}이가 자랐어요!
          </Text>

          <View style={styles.levelUpProgressRow}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.textMuted }}>Lv 33</Text>
            <Text style={{ fontSize: 20, color: COLORS.primary }}>➔</Text>
            <View style={[styles.levelNewBadge, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={{ color: COLORS.primaryDark, fontWeight: '800', fontSize: 16 }}>Lv 34</Text>
            </View>
          </View>

          <Text style={[styles.levelUpMessage, { color: theme.textMuted }]}>
            오늘의 미션을 모두 완료하여{"\n"}든든이의 성장이 빨라졌습니다!
          </Text>

          <TouchableOpacity
            style={[styles.levelUpCloseBtn, { backgroundColor: COLORS.primary }]}
            onPress={onConfirmClose}
          >
            <Text style={styles.levelUpCloseBtnText}>정원으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LevelUpModal;
