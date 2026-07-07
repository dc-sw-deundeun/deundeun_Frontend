import React from 'react';
import { View, Switch } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { styles } from '../ConnectedAppsScreen.styles';

interface SyncAppCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: () => void;
  theme: typeof COLORS.light;
}

// 연동 앱 1건을 표시하는 토글 카드 (삼성 헬스 / 애플 건강 / 구글 피트니스 공통 렌더링)
export const SyncAppCard: React.FC<SyncAppCardProps> = ({
  icon,
  iconBg,
  title,
  subtitle,
  value,
  onValueChange,
  theme,
}) => {
  return (
    <Card style={styles.syncCard}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>{icon}</View>
        <View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: COLORS.primary }}
        thumbColor="#ffffff"
      />
    </Card>
  );
};

export default SyncAppCard;
