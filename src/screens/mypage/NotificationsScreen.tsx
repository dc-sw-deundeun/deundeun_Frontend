import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BellRing, Sparkles, AlertCircle, UserCheck } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { RootStackScreenProps } from '@/types/navigation';
import { notificationApi, NotificationItem } from '@/api';

export default function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications();
      if (res.success && res.data && res.data.items) {
        // 백엔드 데이터에 기본적으로 is_read가 포함되어 있지 않을 수 있으므로 초기값 false 설정
        const items = res.data.items.map((item) => ({
          ...item,
          is_read: item.is_read ?? false,
        }));
        setNotifications(items);
      }
    } catch (error) {
      console.error('알림 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markNotificationRead(id);
      // 로컬 상태 즉시 업데이트
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('growth') || t.includes('level') || t.includes('character')) {
      return <Sparkles size={18} color="#EF6C00" />;
    }
    if (t.includes('mission') || t.includes('assign')) {
      return <BellRing size={18} color={COLORS.primary} />;
    }
    if (t.includes('trend') || t.includes('analysis')) {
      return <AlertCircle size={18} color={COLORS.success} />;
    }
    return <UserCheck size={18} color="#1565C0" />;
  };

  const getIconBg = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('growth') || t.includes('level') || t.includes('character')) return '#FFF3E0';
    if (t.includes('mission') || t.includes('assign')) return '#E8F5E9';
    if (t.includes('trend') || t.includes('analysis')) return '#E8F5E9';
    return '#E3F2FD';
  };

  const parseSection = (dateStr: string): '오늘' | '이전' => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        return '오늘';
      }
    } catch (e) {
      // parsing fallback
    }
    return '이전';
  };

  const formatDisplayTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
      } else {
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
      }
    } catch (e) {
      return dateStr;
    }
  };

  const renderSection = (sectionName: '오늘' | '이전') => {
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
              onPress={() => handleMarkAsRead(item.id)}
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="알림" onBack={() => navigation.goBack()} />

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>새로운 알림이 없습니다.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderSection('오늘')}
          {renderSection('이전')}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  section: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    paddingLeft: SPACING.xs,
  },
  list: {
    gap: SPACING.sm,
  },
  notifCard: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  notifDesc: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});
