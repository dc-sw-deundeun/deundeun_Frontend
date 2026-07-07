import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { NotificationItem } from '@/api';
import { styles } from '../NotificationsScreen.styles';
import { getIcon, getIconBg, parseSection, formatDisplayTime } from '../utils';

interface NotificationSectionProps {
  sectionName: '오늘' | '이전';
  notifications: NotificationItem[];
  theme: { text: string; textMuted: string };
  onMarkAsRead: (id: number) => void;
}

// 날짜 구간(오늘/이전)별로 알림 카드 목록을 렌더링
export const NotificationSection: React.FC<NotificationSectionProps> = ({
  sectionName,
  notifications,
  theme,
  onMarkAsRead,
}) => {
  const filtered = notifications.filter((n) => parseSection(n.created_at) === sectionName);
  if (filtered.length === 0) return null;

  return (
    <View key={sectionName} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
        {sectionName === '오늘' ? '오늘' : '이전 알림'}
      </Text>
      <View style={styles.list}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onMarkAsRead(item.id)}
            activeOpacity={0.7}
          >
            <Card
              style={[
                styles.notifCard,
                !item.is_read && { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
                item.is_read && { opacity: 0.75 },
              ]}
              radius={16}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getIconBg(item.type) },
                ]}
              >
                {getIcon(item.type)}
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.notifTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.notifTime, { color: theme.textMuted }]}>
                    {formatDisplayTime(item.created_at)}
                  </Text>
                </View>
                <Text style={[styles.notifDesc, { color: theme.textMuted }]}>{item.body}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default NotificationSection;
