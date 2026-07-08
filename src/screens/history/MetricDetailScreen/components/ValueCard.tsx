import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { RangeBar } from '@/api';
import { segmentColorToHex } from '@/screens/history/HealthReportScreen/utils';
import { styles } from '../MetricDetailScreen.styles';

interface ValueCardProps {
  metricName: string;
  value: string;
  unit?: string | null;
  statusText: string;
  badgeColor: string;
  rangeBar: RangeBar | null;
  noteText?: string;
  theme: { text: string; textMuted: string };
}

export const ValueCard: React.FC<ValueCardProps> = ({
  metricName,
  value,
  unit,
  statusText,
  badgeColor,
  rangeBar,
  noteText,
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

      {rangeBar ? (
        <>
          {/* 검진 결과 상세 그래프: 서버가 계산한 구간 폭과 백분위(marker_percent)로 표시 */}
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

          {/* 구간별 실제 값 범위(from_value~to_value)를 각 구간 위치에 맞춰 표시 */}
          <View style={{ height: 14, position: 'relative', marginTop: 2 }}>
            {rangeBar.segments.map((seg, idx) => {
              const widthPercent = ((seg.to_value - seg.from_value) / (rangeBar.max - rangeBar.min)) * 100;
              const leftPercent = ((seg.from_value - rangeBar.min) / (rangeBar.max - rangeBar.min)) * 100;
              return (
                <Text
                  key={`${seg.label}-${idx}`}
                  numberOfLines={1}
                  style={[
                    styles.rangeLabelText,
                    {
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      textAlign: 'center',
                      color: theme.textMuted,
                    },
                  ]}
                >
                  {seg.label}
                </Text>
              );
            })}
          </View>
        </>
      ) : noteText ? (
        // 그래프용 구간 정보가 없는 지표(정상/비정상 판정만 존재): 안내 텍스트로 대체
        <View style={[styles.badge, { backgroundColor: badgeColor + '10', alignSelf: 'stretch', marginTop: 4 }]}>
          <Text style={[styles.rangeLabelText, { color: badgeColor, fontSize: 12, lineHeight: 16 }]}>{noteText}</Text>
        </View>
      ) : null}
    </Card>
  );
};

export default ValueCard;
