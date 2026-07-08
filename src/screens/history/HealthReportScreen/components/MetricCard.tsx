import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { SPACING } from '@/constants/theme';
import { AnalysisMetricCard } from '@/api';
import { mapStatusToKorean, getStatusColor, segmentColorToHex } from '../utils';
import { getFallbackRangeBar } from '../fallbackRanges';

interface MetricCardProps {
  card: AnalysisMetricCard;
  onPress: () => void;
  theme: { text: string; textMuted: string; card: string; border: string };
}

export const MetricCard: React.FC<MetricCardProps> = ({ card, onPress, theme }) => {
  const badgeColor = getStatusColor(mapStatusToKorean(card.status));
  const numericValue = typeof card.value === 'number' ? card.value : parseFloat(String(card.value ?? ''));
  const rangeBar = card.range_bar ?? getFallbackRangeBar(card.code, numericValue);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.card} padding={SPACING.md} radius={20}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>{card.label}</Text>
          <View style={styles.valueBadgeRow}>
            <Text style={styles.valueText}>
              {card.value_text}
            </Text>
            <View style={[styles.badge, { backgroundColor: badgeColor + '15' }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{card.status_label}</Text>
            </View>
          </View>
        </View>

        {rangeBar ? (
          // 검진 결과 상세 그래프: 서버가 계산한 구간(segments)과 백분위(marker_percent)를 그대로 사용
          <View style={styles.sliderContainer}>
            <View style={styles.sliderBar}>
              {rangeBar.segments.map((seg, idx) => {
                const widthPercent = ((seg.to_value - seg.from_value) / (rangeBar.max - rangeBar.min)) * 100;
                const isFirst = idx === 0;
                const isLast = idx === rangeBar.segments.length - 1;
                return (
                  <View
                    key={`${seg.label}-${idx}`}
                    style={[
                      styles.barSegment,
                      {
                        flex: undefined,
                        width: `${Math.max(widthPercent, 0)}%`,
                        backgroundColor: segmentColorToHex(seg.color),
                        borderTopLeftRadius: isFirst ? 4 : 0,
                        borderBottomLeftRadius: isFirst ? 4 : 0,
                        borderTopRightRadius: isLast ? 4 : 0,
                        borderBottomRightRadius: isLast ? 4 : 0,
                      },
                    ]}
                  />
                );
              })}
            </View>
            <View
              style={[
                styles.sliderDot,
                {
                  left: `${Math.min(Math.max(rangeBar.marker_percent, 2), 98)}%`,
                  borderColor: segmentColorToHex(rangeBar.active_segment?.color) || badgeColor,
                },
              ]}
            />
          </View>
        ) : null}

        {rangeBar ? (
          // 구간별 실제 값 범위(API/기준치의 from_value~to_value)를 각 구간 위치에 맞춰 표시
          <View style={styles.rangeLabelRow}>
            {rangeBar.segments.map((seg, idx) => {
              const widthPercent = ((seg.to_value - seg.from_value) / (rangeBar.max - rangeBar.min)) * 100;
              const leftPercent = ((seg.from_value - rangeBar.min) / (rangeBar.max - rangeBar.min)) * 100;
              return (
                <Text
                  key={`${seg.label}-label-${idx}`}
                  numberOfLines={1}
                  style={[
                    styles.rangeLabelText,
                    { left: `${leftPercent}%`, width: `${widthPercent}%`, color: theme.textMuted },
                  ]}
                >
                  {seg.label}
                </Text>
              );
            })}
          </View>
        ) : (
          // 그래프용 구간 정보가 없는 지표(정상/비정상 판정만 존재): 배지 + 안내 텍스트로 대체
          card.badge_text && card.badge_text !== card.status_label ? (
            <View style={[styles.noGraphNote, { backgroundColor: badgeColor + '10' }]}>
              <Text style={[styles.noGraphNoteText, { color: badgeColor }]}>{card.badge_text}</Text>
            </View>
          ) : null
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
    overflow: 'hidden',
  },
  barSegment: {
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
  rangeLabelRow: {
    height: 14,
    position: 'relative',
    marginTop: 2,
  },
  rangeLabelText: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  noGraphNote: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  noGraphNoteText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});

export default MetricCard;
