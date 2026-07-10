import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../HealthReportScreen.styles';

interface PlainMetricRowProps {
  label: string;
  value: string;
  unit?: string | null;
  theme: { text: string; textMuted: string; border: string };
  isLast?: boolean;
}

// 신장/성별 등 정상·비정상 판정이나 그래프가 존재하지 않는 항목을 값만 그대로 보여주는 행
export const PlainMetricRow: React.FC<PlainMetricRowProps> = ({ label, value, unit, theme, isLast }) => {
  return (
    <View style={[styles.listItem, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
      <Text style={[styles.listLabel, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.listVal, { color: theme.textMuted, fontSize: 14, fontWeight: '700', marginTop: 0 }]}>
        {value}
        {unit ? ` ${unit}` : ''}
      </Text>
    </View>
  );
};

export default PlainMetricRow;
