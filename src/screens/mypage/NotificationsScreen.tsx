import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BellRing, Sparkles, AlertCircle, UserCheck } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { RootStackScreenProps } from '@/types/navigation';

interface NotificationItem {
  id: number;
  section: '오늘' | '어제';
  title: string;
  desc: string;
  time: string;
  type: 'growth' | 'mission' | 'trend' | 'join';
}

export default function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const notifications: NotificationItem[] = [
    {
      id: 1,
      section: '오늘',
      title: '고양이가 Lv 41이 됐어요! ✦',
      desc: '아침 걷기를 21일째 지킨 보상이에요.',
      time: '방금 전',
      type: 'growth',
    },
    {
      id: 2,
      section: '오늘',
      title: '오늘의 미션이 도착했어요',
      desc: '물 자주 마시기, 잡곡밥 먼저 먹기 미션이 준비되었습니다.',
      time: '오전 8:00',
      type: 'mission',
    },
    {
      id: 3,
      section: '어제',
      title: '공복 혈당이 12 내려갔어요',
      desc: '126 ➔ 114 mg/dL로 줄었습니다. 꾸준한 실천의 결과예요!',
      time: '어제 오후 9:10',
      type: 'trend',
    },
    {
      id: 4,
      section: '어제',
      title: '새 친구 토끼가 합류했어요 🐰',
      desc: '하루 미션을 모두 성실히 지킨 보상입니다.',
      time: '어제 오후 6:40',
      type: 'join',
    },
  ];

  const getIcon = (type: string) => {
    if (type === 'growth') return <Sparkles size={18} color="#EF6C00" />;
    if (type === 'mission') return <BellRing size={18} color={COLORS.primary} />;
    if (type === 'trend') return <AlertCircle size={18} color={COLORS.success} />;
    return <UserCheck size={18} color="#1565C0" />;
  };

  const getIconBg = (type: string) => {
    if (type === 'growth') return '#FFF3E0';
    if (type === 'mission') return '#E8F5E9';
    if (type === 'trend') return '#E8F5E9';
    return '#E3F2FD';
  };

  const renderSection = (sectionName: '오늘' | '어제') => {
    const filtered = notifications.filter((n) => n.section === sectionName);
    return (
      <View key={sectionName} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{sectionName}</Text>
        <View style={styles.list}>
          {filtered.map((item) => (
            <Card key={item.id} style={styles.notifCard} radius={16}>
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
                  <Text style={[styles.notifTime, { color: theme.textMuted }]}>{item.time}</Text>
                </View>
                <Text style={[styles.notifDesc, { color: theme.textMuted }]}>{item.desc}</Text>
              </View>
            </Card>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="알림" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderSection('오늘')}
        {renderSection('어제')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  section: {
    gap: SPACING.sm,
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
