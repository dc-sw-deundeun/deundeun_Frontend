import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { styles } from '../TermsScreen.styles';

interface AllAgreeRowProps {
  allAgreed: boolean;
  onPress: () => void;
  theme: { text: string; textMuted: string; border: string };
}

export const AllAgreeRow: React.FC<AllAgreeRowProps> = ({ allAgreed, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={[
        styles.allAgreeRow,
        { borderColor: allAgreed ? COLORS.primary : theme.border },
        allAgreed && { backgroundColor: COLORS.primaryLight }
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: allAgreed ? COLORS.primary : theme.textMuted },
          allAgreed && { backgroundColor: COLORS.primary }
        ]}
      >
        {allAgreed && <Check color="#ffffff" size={16} strokeWidth={3} />}
      </View>
      <Text style={[styles.allAgreeText, { color: allAgreed ? COLORS.primaryDark : theme.text }]}>
        약관에 모두 동의합니다
      </Text>
    </TouchableOpacity>
  );
};

export default AllAgreeRow;
