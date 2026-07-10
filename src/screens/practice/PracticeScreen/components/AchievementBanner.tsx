import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../PracticeScreen.styles';
import { WeeklyStatisticsResponse } from '@/api/mission';

interface AchievementBannerProps {
  weeklyStats: WeeklyStatisticsResponse | null;
  glassBannerStyle: any;
}

export const AchievementBanner: React.FC<AchievementBannerProps> = ({ weeklyStats, glassBannerStyle }) => {
  const completionRate = weeklyStats && weeklyStats.total > 0 
    ? Math.round((weeklyStats.completed / weeklyStats.total) * 100) 
    : 0;

  return (
    <View style={[styles.achievementCard, glassBannerStyle]}>
      <View style={styles.glassShine} pointerEvents="none" />
      <Text style={styles.achievementTitle}>주간 미션 달성 현황</Text>
      <View style={styles.achievementPill}>
        <Text style={styles.achievementPillText}>★ 이번 주 {completionRate}% 달성</Text>
      </View>
    </View>
  );
};

export default AchievementBanner;
