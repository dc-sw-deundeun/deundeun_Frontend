import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './NotificationsScreen.styles';
import { NotificationSection } from './components/NotificationSection';
import { useNotifications } from './hooks/useNotifications';

export default function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const { notifications, loading, handleMarkAsRead } = useNotifications();

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
          <NotificationSection
            sectionName="오늘"
            notifications={notifications}
            theme={theme}
            onMarkAsRead={handleMarkAsRead}
          />
          <NotificationSection
            sectionName="이전"
            notifications={notifications}
            theme={theme}
            onMarkAsRead={handleMarkAsRead}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
