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
  onOpenExplanation: () => void;
  theme: { text: string; textMuted: string };
}

export const DiseaseResultCard: React.FC<DiseaseResultCardProps> = ({
  disease,
  onNavigateHealthReport,
  onOpenExplanation,
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

      {/* My Stats Card */}
      <Card style={styles.myStatsCard} padding={SPACING.md} radius={20}>
        <View style={styles.statsLeft}>
          <Text style={[styles.statsLabel, { color: theme.textMuted }]}>내 {disease.name} 최근 기록</Text>
          <Text style={[styles.statsValue, { color: theme.text }]}>
            {disease.name.includes('콜레스테롤') ? '232 mg/dL (주의)' : '126 mg/dL (주의)'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.statsLinkBtn, { backgroundColor: COLORS.primaryLight }]}
          onPress={onNavigateHealthReport}
        >
          <Text style={[styles.statsLinkText, { color: COLORS.primaryDark }]}>최근 분석 보기</Text>
        </TouchableOpacity>
      </Card>

      {/* Explanation Sheet Trigger Card */}
      <TouchableOpacity
        style={[styles.explanCard, { backgroundColor: COLORS.primaryDark }]}
        onPress={onOpenExplanation}
      >
        <View style={styles.explanLeft}>
          <HelpCircle color="#ffffff" size={24} />
          <View>
            <Text style={styles.explanTitle}>수치 쉽게 풀어주기</Text>
            <Text style={styles.explanDesc}>어려운 의학 용어와 검사 결과를 쉽게 이해해 보아요.</Text>
          </View>
        </View>
        <Text style={{ color: '#ffffff', fontSize: 18 }}>➔</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DiseaseResultCard;
