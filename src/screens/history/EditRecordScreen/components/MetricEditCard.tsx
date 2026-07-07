import React from 'react';
import { View, TextInput } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { MetricResponse } from '@/api';
import { styles } from '../EditRecordScreen.styles';
import { statusColor, statusLabel } from '../utils';

interface MetricEditCardProps {
  metric: MetricResponse;
  currentVal: string;
  onChangeValue: (v: string) => void;
  theme: { text: string; textMuted: string; background: string; border: string };
}

export const MetricEditCard: React.FC<MetricEditCardProps> = ({
  metric,
  currentVal,
  onChangeValue,
  theme,
}) => {
  const sc = statusColor(metric.status, theme.textMuted);
  const sl = statusLabel(metric.status);
  const isDirty = currentVal.trim() !== (metric.value ?? '');

  return (
    <Card style={styles.metricCard}>
      {/* 지표명 + 상태 배지 */}
      <View style={styles.cardHeader}>
        <Text style={[styles.metricName, { color: theme.text }]}>
          {metric.metric_name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {isDirty && (
            <View style={[styles.dirtyDot, { backgroundColor: COLORS.warning }]} />
          )}
          <View style={[styles.statusBadge, { backgroundColor: sc + '18' }]}>
            <Text style={[styles.statusText, { color: sc }]}>{sl}</Text>
          </View>
        </View>
      </View>

      {/* 입력 필드 */}
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background,
              borderColor: isDirty ? COLORS.primary : theme.border,
              color: theme.text,
            },
          ]}
          value={currentVal}
          onChangeText={onChangeValue}
          keyboardType="decimal-pad"
          placeholder={metric.value ?? '-'}
          placeholderTextColor={theme.textMuted}
        />
        {metric.unit && (
          <View
            style={[styles.unitBox, { backgroundColor: theme.background }]}
          >
            <Text style={[styles.unitText, { color: theme.textMuted }]}>
              {metric.unit}
            </Text>
          </View>
        )}
      </View>

      {/* 참고 범위 */}
      {(metric.reference_min !== null || metric.reference_max !== null) && (
        <Text style={[styles.refText, { color: theme.textMuted }]}>
          참고 범위: {metric.reference_min ?? '?'} ~ {metric.reference_max ?? '?'}{' '}
          {metric.unit ?? ''}
        </Text>
      )}
    </Card>
  );
};

export default MetricEditCard;
