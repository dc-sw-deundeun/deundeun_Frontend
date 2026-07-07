import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { MetricResponse } from '@/api';
import { styles } from '../HealthReportScreen.styles';
import { mapStatusToKorean, getStatusColor } from '../utils';

interface FbsMetricCardProps {
  metric: MetricResponse;
  onPress: () => void;
  theme: { text: string; textMuted: string };
}

export const FbsMetricCard: React.FC<FbsMetricCardProps> = ({ metric, onPress, theme }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.detailCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>공복혈당 분석</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(mapStatusToKorean(metric.status)) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(mapStatusToKorean(metric.status)) }]}>
              {mapStatusToKorean(metric.status)} ({metric.value} {metric.unit})
            </Text>
          </View>
        </View>

        <Text style={[styles.interpretationText, { color: theme.textMuted }]}>
          공복혈당 수치가 {metric.value}{metric.unit}입니다. 지표를 클릭하여 더 자세한 추이 분석 및 건강 가이드를 확인해보세요.
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export default FbsMetricCard;
