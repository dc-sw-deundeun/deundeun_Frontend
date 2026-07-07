import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { Star, Award, PawPrint } from 'lucide-react-native';
import { styles } from '../GrowthScreen.styles';

interface ProgressCardProps {
  currentLevel: number;
  currentExp: number;
  totalRequiredExp: number;
  expToNext: number;
  progressPercent: string;
  totalExp: number;
  uniqueOwnedCount: number;
  catalogCount: number;
  theme: { text: string; textMuted: string; border: string; background: string };
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  currentLevel,
  currentExp,
  totalRequiredExp,
  expToNext,
  progressPercent,
  totalExp,
  uniqueOwnedCount,
  catalogCount,
  theme,
}) => {
  return (
    <Card style={styles.card} radius={24}>
      <View style={styles.progressHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Star color={COLORS.primary} size={18} fill={COLORS.primaryLight} />
          <Text style={[styles.progressTitle, { color: theme.text }]}>성장 포인트 (Lv {currentLevel})</Text>
        </View>
        <Text style={[styles.progressRatio, { color: COLORS.primary }]}>{currentExp} / {totalRequiredExp} XP</Text>
      </View>

      {/* Level Bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.progressBarFill, { backgroundColor: COLORS.primary, width: progressPercent as any }]} />
      </View>
      <Text style={[styles.progressHelpText, { color: theme.textMuted }]}>
        다음 레벨(Lv {currentLevel + 1})까지 {expToNext} XP 남았어요!
      </Text>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <PawPrint color={COLORS.primary} size={22} fill={COLORS.primaryLight} />
          <View style={styles.statInfo}>
            <Text style={[styles.statValue, { color: theme.text }]}>{uniqueOwnedCount} / {catalogCount}종</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>보유 동물</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <Award color={COLORS.primary} size={22} fill={COLORS.primaryLight} />
          <View style={styles.statInfo}>
            <Text style={[styles.statValue, { color: theme.text }]}>{totalExp.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>든든 포인트</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default ProgressCard;
