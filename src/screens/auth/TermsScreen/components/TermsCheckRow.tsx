import React, { useState } from 'react';
import { TouchableOpacity, View, ScrollView } from 'react-native';
import Text from '@/components/Text';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { styles } from '../TermsScreen.styles';

interface TermsCheckRowProps {
  checked: boolean;
  onPress: () => void;
  label: React.ReactNode;
  theme: { text: string; textMuted: string; border?: string };
  details?: string;
}

export const TermsCheckRow: React.FC<TermsCheckRowProps> = ({ checked, onPress, label, theme, details }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.checkRowContainer}>
      <View style={styles.checkRow}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={onPress}>
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
        
        {details && (
          <TouchableOpacity 
            style={styles.chevronContainer} 
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            {isExpanded ? (
              <ChevronUp color={theme.textMuted} size={20} />
            ) : (
              <ChevronDown color={theme.textMuted} size={20} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {details && isExpanded && (
        <View style={[styles.detailsContainer, { backgroundColor: theme.border ? theme.border + '40' : 'rgba(0,0,0,0.03)' }]}>
          <ScrollView style={styles.detailsScrollView} nestedScrollEnabled={true}>
            <Text style={[styles.detailsText, { color: theme.textMuted }]}>{details}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default TermsCheckRow;
