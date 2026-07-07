import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { getMetricRangeConfig } from '@/screens/history/MetricDetailScreen/constants';
import { mapStatusToKorean, getStatusColor } from '../utils';

interface MetricCardProps {
  metricName: string;
  metricCode: string;
  value: string;
  unit: string | null;
  status: string;
  onPress: () => void;
  theme: { text: string; textMuted: string; card: string; border: string };
  // systolic value for BP representation
  systolicValue?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metricName,
  metricCode,
  value,
  unit,
  status,
  onPress,
  theme,
  systolicValue,
}) => {
  const statusKorean = mapStatusToKorean(status);
  const badgeColor = getStatusColor(statusKorean);

  // Determine value to use for positioning the slider pin
  let numValue = parseFloat(value) || 0;
  if (metricCode === 'BloodPressure' && systolicValue) {
    numValue = systolicValue;
  }

  // Range config for slider positioning
  // If it's BloodPressure, use SystolicBP config
  const configCode = metricCode === 'BloodPressure' ? 'SystolicBP' : metricCode;
  const config = getMetricRangeConfig(configCode);

  const showSlider = metricCode !== 'BMI';

  // Calculate pin position percentage
  const positionPercentage = Math.min(
    Math.max(((numValue - config.minVal) / (config.maxVal - config.minVal)) * 100, 2),
    98
  );

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.card} padding={SPACING.md} radius={20}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>{metricName}</Text>
          <View style={styles.valueBadgeRow}>
            <Text style={styles.valueText}>
              {value}
              <Text style={[styles.unitText, { color: theme.textMuted }]}> {unit ?? ''}</Text>
            </Text>
            <View style={[styles.badge, { backgroundColor: badgeColor + '15' }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{statusKorean}</Text>
            </View>
          </View>
        </View>

        {showSlider && (
          <View style={styles.sliderContainer}>
            <View style={styles.sliderBar}>
              <View
                style={[
                  styles.barSegment,
                  { backgroundColor: COLORS.success, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
                ]}
              />
              <View style={[styles.barSegment, { backgroundColor: COLORS.warning }]} />
              <View
                style={[
                  styles.barSegment,
                  { backgroundColor: COLORS.error, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
                ]}
              />
            </View>
            <View style={[styles.sliderDot, { left: `${positionPercentage}%`, borderColor: badgeColor }]} />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  valueBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6A5438',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sliderContainer: {
    height: 16,
    justifyContent: 'center',
    position: 'relative',
    marginTop: 4,
  },
  sliderBar: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
  },
  barSegment: {
    flex: 1,
    height: '100%',
  },
  sliderDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    marginTop: -3,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});

export default MetricCard;
