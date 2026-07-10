import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { Switch } from 'react-native';
import { COLORS } from '@/constants/theme';
import { Leaf, Bell, Clock, Send } from 'lucide-react-native';
import { styles } from '../MyPageScreen.styles';

import { missionApi } from '@/api';
import { Alert, TouchableOpacity } from 'react-native';

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
  const handleTestNotification = async () => {
    try {
      const res = await missionApi.sendMissionNotification();
      if (res.success) {
        Alert.alert('알림 전송', '테스트 알림이 전송되었습니다.');
      } else {
        Alert.alert('오류', '알림 전송에 실패했습니다.');
      }
    } catch (e) {
      Alert.alert('오류', '알림 전송 중 문제가 발생했습니다.');
    }
  };

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
        <View style={[styles.toggleItemLeft, { flex: 1 }]}>
          <Bell size={20} color="#354B33" />
          <Text style={[styles.toggleTitle, { color: theme.text }]}>미션 리마인드</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={handleTestNotification}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.primaryLight,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              gap: 4
            }}
          >
            <Send size={14} color={COLORS.primaryDark} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primaryDark }}>테스트 발송</Text>
          </TouchableOpacity>
          <Switch
            value={missionAlert}
            onValueChange={onToggleMissionAlert}
            trackColor={{ false: theme.border, true: COLORS.primary }}
            thumbColor="#ffffff"
          />
        </View>
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
