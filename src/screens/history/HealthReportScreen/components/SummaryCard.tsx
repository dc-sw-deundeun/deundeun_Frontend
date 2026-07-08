import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { AlertTriangle } from 'lucide-react-native';
import { styles } from '../HealthReportScreen.styles';
import { formatDate } from '../utils';

interface SummaryCardProps {
  overallTitle?: string;
  normalCount: number;
  cautionCount: number;
  riskCount: number;
  dateStr: string;
  theme: { text: string; textMuted: string };
  summaryText?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  overallTitle,
  normalCount,
  cautionCount,
  riskCount,
  dateStr,
  theme,
  summaryText,
}) => {
  const title = overallTitle || (cautionCount + riskCount > 0 ? '관리가 필요해요' : '아주 건강해요!');

  return (
    <Card style={styles.summaryCard} padding={SPACING.md}>
      <View style={{ gap: 4 }}>
        <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>종합 소견</Text>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800' }}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SPACING.sm }}>
        {riskCount > 0 && (
          <View style={{ backgroundColor: COLORS.error + '15', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 }}>
            <Text style={{ color: COLORS.error, fontWeight: '800', fontSize: 13 }}>위험 {riskCount}</Text>
          </View>
        )}
        {cautionCount > 0 && (
          <View style={{ backgroundColor: COLORS.warning + '15', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 }}>
            <Text style={{ color: COLORS.warning, fontWeight: '800', fontSize: 13 }}>주의 {cautionCount}</Text>
          </View>
        )}
        {normalCount > 0 && (
          <View style={{ backgroundColor: COLORS.success + '15', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 }}>
            <Text style={{ color: COLORS.success, fontWeight: '800', fontSize: 13 }}>정상 {normalCount}</Text>
          </View>
        )}
      </View>

      {summaryText ? (
        <View style={{ marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }}>
          <Text style={{ color: theme.text, fontSize: 13, lineHeight: 18, fontWeight: '500' }}>
            {summaryText}
          </Text>
        </View>
      ) : null}
    </Card>
  );
};

export default SummaryCard;
