import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { styles } from '../HistoryScreen.styles';
import { formatDisplayDate } from '../utils';

interface RecordCardProps {
  record: any;
  seq: number;
  onPress: () => void;
  theme: { text: string; textMuted: string };
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, seq, onPress, theme }) => {
  const isVerified = record.verification_status === 'VERIFIED';
  const dateText = formatDisplayDate(record.measured_at || record.created_at);

  return (
    <Card style={styles.recordCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfoLeft}>
          <Calendar size={18} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={[styles.cardDate, { color: theme.text }]}>
            {dateText} <Text style={{ color: theme.textMuted, fontWeight: '500' }}>· {seq}차</Text>
          </Text>
        </View>
        <ChevronRight size={18} color={theme.textMuted} />
      </View>

      <Text style={[styles.hospitalText, { color: theme.textMuted }]}>
        {record.source_type === 'OCR' ? 'OCR 분석 검진표' : '수동 입력 기록'}
      </Text>

      {/* Badges row */}
      <View style={styles.badgesRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: (isVerified ? COLORS.success : COLORS.warning) + '15'
            }
          ]}
        >
          <Text style={[styles.badgeText, { color: isVerified ? COLORS.success : COLORS.warning }]}>
            {isVerified ? '검수완료' : '검수대기'}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: COLORS.primary + '12' }]}>
          <Text style={[styles.badgeText, { color: COLORS.primary }]}>
            지표 {record.metric_count ?? 0}개
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default RecordCard;
