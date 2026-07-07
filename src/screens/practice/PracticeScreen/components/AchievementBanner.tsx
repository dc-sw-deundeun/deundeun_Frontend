import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../PracticeScreen.styles';

interface AchievementBannerProps {
  glassBannerStyle: any;
}

export const AchievementBanner: React.FC<AchievementBannerProps> = ({ glassBannerStyle }) => {
  return (
    <View style={[styles.achievementCard, glassBannerStyle]}>
      <View style={styles.glassShine} pointerEvents="none" />
      <Text style={styles.achievementTitle}>주간 미션 달성 현황</Text>
      <View style={styles.achievementPill}>
        <Text style={styles.achievementPillText}>★ 상위 5% 달성 중</Text>
      </View>
    </View>
  );
};

export default AchievementBanner;
