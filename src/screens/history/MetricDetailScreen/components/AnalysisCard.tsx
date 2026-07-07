import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { Info } from 'lucide-react-native';
import { styles } from '../MetricDetailScreen.styles';

interface AnalysisCardProps {
  explanation: string;
  theme: { text: string };
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ explanation, theme }) => {
  return (
    <Card style={[styles.glassCard, { backgroundColor: 'rgba(149, 194, 112, 0.12)', borderColor: 'rgba(149, 194, 112, 0.2)' }]}>
      <View style={styles.infoRow}>
        <Info size={16} color={COLORS.primary} />
        <Text style={[styles.infoTitle, { color: COLORS.primaryDark }]}>이게 무슨 의미일까요?</Text>
      </View>
      <Text style={[styles.explanationText, { color: theme.text }]}>{explanation}</Text>
    </Card>
  );
};

export default AnalysisCard;
