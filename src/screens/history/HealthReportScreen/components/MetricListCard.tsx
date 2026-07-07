import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { SPACING } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';
import { MetricResponse } from '@/api';
import { styles } from '../HealthReportScreen.styles';
import { mapStatusToKorean, getStatusColor } from '../utils';

interface MetricListCardProps {
  metrics: MetricResponse[];
  onSelectMetric: (item: MetricResponse) => void;
  theme: { text: string; textMuted: string; border: string };
}

export const MetricListCard: React.FC<MetricListCardProps> = ({ metrics, onSelectMetric, theme }) => {
  return (
    <View style={styles.otherGroup}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>건강 세부 지표 목록</Text>

      <Card style={styles.cardList} padding={0}>
        {metrics.length === 0 ? (
          <View style={{ padding: SPACING.lg, alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted }}>검진 지표 데이터가 없습니다.</Text>
          </View>
        ) : (
          metrics.map((item, idx) => {
            const statusKorean = mapStatusToKorean(item.status);
            const statusColor = getStatusColor(statusKorean);

            return (
              <View key={item.metric_id}>
                {idx > 0 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => onSelectMetric(item)}
                >
                  <View>
                    <Text style={[styles.listLabel, { color: theme.text }]}>{item.metric_name}</Text>
                    <Text style={[styles.listVal, { color: theme.textMuted }]}>
                      {item.value ?? '-'} {item.unit ?? ''}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={[styles.itemBadge, { backgroundColor: statusColor + '15' }]}>
                      <Text style={[styles.itemBadgeText, { color: statusColor }]}>{statusKorean}</Text>
                    </View>
                    <ChevronRight size={16} color={theme.textMuted} />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </Card>
    </View>
  );
};

export default MetricListCard;
