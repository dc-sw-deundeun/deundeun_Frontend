import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { AlertTriangle } from 'lucide-react-native';
import { styles } from '../HealthReportScreen.styles';
import { formatDate } from '../utils';

interface SummaryCardProps {
  cautionCount: number;
  dateStr: string;
  theme: { text: string; textMuted: string };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ cautionCount, dateStr, theme }) => {
  return (
    <Card style={styles.summaryCard} padding={SPACING.md}>
      <View style={styles.summaryTopRow}>
        <View style={[styles.alertIconCircle, { backgroundColor: (cautionCount > 0 ? COLORS.warning : COLORS.success) + '15' }]}>
          <AlertTriangle color={cautionCount > 0 ? COLORS.warning : COLORS.success} size={26} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            {cautionCount > 0 ? '종합 소견: 관리가 필요해요' : '종합 소견: 아주 건강해요!'}
          </Text>
          <Text style={[styles.summarySubtitle, { color: theme.textMuted }]}>
            {formatDate(dateStr)} 검진 결과 기준, 주의/경계 지표는 {cautionCount}개입니다.
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default SummaryCard;
