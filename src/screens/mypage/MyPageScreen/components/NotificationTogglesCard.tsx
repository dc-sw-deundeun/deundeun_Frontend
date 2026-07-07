import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { Switch } from 'react-native';
import { COLORS } from '@/constants/theme';
import { Leaf, Bell, Clock } from 'lucide-react-native';
import { styles } from '../MyPageScreen.styles';

interface NotificationTogglesCardProps {
  dietAlert: boolean;
  onToggleDietAlert: (value: boolean) => void;
  missionAlert: boolean;
  onToggleMissionAlert: (value: boolean) => void;
  recordAlert: boolean;
  onToggleRecordAlert: (value: boolean) => void;
  weeklyReport: boolean;
  onToggleWeeklyReport: (value: boolean) => void;
  theme: { text: string; border: string };
}

export const NotificationTogglesCard: React.FC<NotificationTogglesCardProps> = ({
  dietAlert,
  onToggleDietAlert,
  missionAlert,
  onToggleMissionAlert,
  recordAlert,
  onToggleRecordAlert,
  weeklyReport,
  onToggleWeeklyReport,
  theme,
}) => {
  return (
    <Card style={styles.menuList} padding={0}>
      {/* Toggle 1 */}
      <View style={styles.toggleItem}>
        <View style={styles.toggleItemLeft}>
          <Leaf size={20} color="#354B33" />
          <Text style={[styles.toggleTitle, { color: theme.text }]}>식단 기록 알림</Text>
        </View>
        <Switch
          value={dietAlert}
          onValueChange={onToggleDietAlert}
          trackColor={{ false: theme.border, true: COLORS.primary }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

      {/* Toggle 2 */}
      <View style={styles.toggleItem}>
        <View style={styles.toggleItemLeft}>
          <Bell size={20} color="#354B33" />
          <Text style={[styles.toggleTitle, { color: theme.text }]}>미션 리마인드</Text>
        </View>
        <Switch
          value={missionAlert}
          onValueChange={onToggleMissionAlert}
          trackColor={{ false: theme.border, true: COLORS.primary }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

      {/* Toggle 3 */}
      <View style={styles.toggleItem}>
        <View style={styles.toggleItemLeft}>
          <Bell size={20} color="#354B33" />
          <Text style={[styles.toggleTitle, { color: theme.text }]}>기록 리마인드</Text>
        </View>
        <Switch
          value={recordAlert}
          onValueChange={onToggleRecordAlert}
          trackColor={{ false: theme.border, true: COLORS.primary }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

      {/* Toggle 4 */}
      <View style={styles.toggleItem}>
        <View style={styles.toggleItemLeft}>
          <Clock size={20} color="#354B33" />
          <Text style={[styles.toggleTitle, { color: theme.text }]}>주간 리포트</Text>
        </View>
        <Switch
          value={weeklyReport}
          onValueChange={onToggleWeeklyReport}
          trackColor={{ false: theme.border, true: COLORS.primary }}
          thumbColor="#ffffff"
        />
      </View>
    </Card>
  );
};

export default NotificationTogglesCard;
