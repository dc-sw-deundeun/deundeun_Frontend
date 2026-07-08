import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { HelpCircle } from 'lucide-react-native';
import { DiseaseResult } from '@/api';
import { styles } from '../SearchBrowseScreen.styles';

interface DiseaseResultCardProps {
  disease: DiseaseResult;
  onNavigateHealthReport: () => void;
  theme: { text: string; textMuted: string };
}

export const DiseaseResultCard: React.FC<DiseaseResultCardProps> = ({
  disease,
  onNavigateHealthReport,
  theme,
}) => {
  return (
    <View style={{ gap: SPACING.md, marginBottom: SPACING.md }}>
      {/* Main Result Card */}
      <Card style={styles.resultCard}>
        <Text style={[styles.resultCategory, { color: COLORS.primary }]}>건강 사전</Text>
        <Text style={[styles.resultTitle, { color: theme.text }]}>{disease.name}이란?</Text>
        <Text style={[styles.resultBody, { color: theme.textMuted }]}>
          {disease.description}
        </Text>
        {disease.symptoms && disease.symptoms.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 4 }}>주요 증상:</Text>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>
              {disease.symptoms.join(', ')}
            </Text>
          </View>
        )}
      </Card>



    </View>
  );
};

export default DiseaseResultCard;
