import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { RangeConfig } from '../constants';
import { styles } from '../MetricDetailScreen.styles';

interface ValueCardProps {
  metricName: string;
  value: string;
  unit?: string | null;
  statusText: string;
  badgeColor: string;
  positionPercentage: number;
  config: RangeConfig;
  theme: { text: string; textMuted: string };
}

export const ValueCard: React.FC<ValueCardProps> = ({
  metricName,
  value,
  unit,
  statusText,
  badgeColor,
  positionPercentage,
  config,
  theme,
}) => {
  return (
    <Card style={styles.glassCard}>
      <Text style={[styles.cardSubTitle, { color: theme.textMuted }]}>현재 {metricName}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.valueText, { color: theme.text }]}>
          {value}
          <Text style={[styles.unitText, { color: theme.textMuted }]}> {unit ?? ''}</Text>
        </Text>
        <View style={[styles.badge, { backgroundColor: badgeColor + '15' }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderBar}>
          <View style={[styles.barSegment, { backgroundColor: COLORS.success, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }]} />
          <View style={[styles.barSegment, { backgroundColor: COLORS.warning }]} />
          <View style={[styles.barSegment, { backgroundColor: COLORS.error, borderTopRightRadius: 4, borderBottomRightRadius: 4 }]} />
        </View>
        <View style={[styles.sliderDot, { left: `${positionPercentage}%`, borderColor: badgeColor }]} />
      </View>

      <View style={styles.rangeTextRow}>
        <Text style={[styles.rangeLabelText, { color: theme.textMuted }]}>{config.normalText}</Text>
        <Text style={[styles.rangeLabelText, { color: theme.textMuted }]}>{config.cautionText}</Text>
        <Text style={[styles.rangeLabelText, { color: theme.textMuted }]}>{config.dangerText}</Text>
      </View>
    </Card>
  );
};

export default ValueCard;
