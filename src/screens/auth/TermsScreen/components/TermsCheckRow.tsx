import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { styles } from '../TermsScreen.styles';

interface TermsCheckRowProps {
  checked: boolean;
  onPress: () => void;
  label: React.ReactNode;
  theme: { text: string; textMuted: string };
}

export const TermsCheckRow: React.FC<TermsCheckRowProps> = ({ checked, onPress, label, theme }) => {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          { borderColor: checked ? COLORS.primary : theme.textMuted },
          checked && { backgroundColor: COLORS.primary }
        ]}
      >
        {checked && <Check color="#ffffff" size={14} strokeWidth={3} />}
      </View>
      <Text style={[styles.checkText, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TermsCheckRow;
