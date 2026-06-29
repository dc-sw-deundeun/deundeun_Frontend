import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, User, Link, Bell, Lock } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { storage } from '@/utils/storage';
import { setAccessToken } from '@/api';

// Navigation types
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';

type MyPageScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'MyPage'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Toggle states
  const [dietAlert, setDietAlert] = useState(true);
  const [missionAlert, setMissionAlert] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="마이페이지" variant="section" />
        <View style={styles.scrollContent}>
          {/* Profile Card */}
          <Card style={styles.profileCard} radius={24}>
            <View style={[styles.avatarCircle, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={{ fontSize: 32 }}>🥬</Text>
            </View>
            <View>
              <Text style={[styles.profileName, { color: theme.text }]}>김영순 님</Text>
              <Text style={[styles.profileEmail, { color: theme.textMuted }]}>youngsoon@deundeun.kr</Text>
            </View>
          </Card>

          {/* Account Settings Menu */}
          <View style={styles.menuGroup}>
            <Text style={[styles.groupTitle, { color: theme.textMuted }]}>계정 및 보안</Text>

            <Card style={styles.menuList} padding={0}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <User size={18} color={theme.text} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>내 정보</Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </TouchableOpacity>

              <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <View style={styles.menuItemLeft}>
                  <Lock size={18} color={theme.text} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>비밀번호 변경</Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </TouchableOpacity>

              <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ConnectedApps')}
              >
                <View style={styles.menuItemLeft}>
                  <Link size={18} color={theme.text} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>연동 앱 관리</Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </TouchableOpacity>
            </Card>
          </View>

          {/* Notifications toggles */}
          <View style={styles.menuGroup}>
            <Text style={[styles.groupTitle, { color: theme.textMuted }]}>알림 설정</Text>

            <Card style={styles.menuList} padding={0}>
              {/* Toggle 1 */}
              <View style={styles.toggleItem}>
                <View style={styles.toggleItemLeft}>
                  <Bell size={18} color={theme.text} />
                  <View>
                    <Text style={[styles.toggleTitle, { color: theme.text }]}>식단 기록 알림</Text>
                    <Text style={[styles.toggleDesc, { color: theme.textMuted }]}>식사 전후 기록을 리마인드 해드려요</Text>
                  </View>
                </View>
                <Switch
                  value={dietAlert}
                  onValueChange={setDietAlert}
                  trackColor={{ false: theme.border, true: COLORS.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

              {/* Toggle 2 */}
              <View style={styles.toggleItem}>
                <View style={styles.toggleItemLeft}>
                  <Bell size={18} color={theme.text} />
                  <View>
                    <Text style={[styles.toggleTitle, { color: theme.text }]}>미션 리마인드</Text>
                    <Text style={[styles.toggleDesc, { color: theme.textMuted }]}>오늘 해야 할 미션을 알림으로 알려요</Text>
                  </View>
                </View>
                <Switch
                  value={missionAlert}
                  onValueChange={setMissionAlert}
                  trackColor={{ false: theme.border, true: COLORS.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

              {/* Toggle 3 */}
              <View style={styles.toggleItem}>
                <View style={styles.toggleItemLeft}>
                  <Bell size={18} color={theme.text} />
                  <View>
                    <Text style={[styles.toggleTitle, { color: theme.text }]}>주간 리포트</Text>
                    <Text style={[styles.toggleDesc, { color: theme.textMuted }]}>매주 월요일 건강 실천 결과를 요약 제공해요</Text>
                  </View>
                </View>
                <Switch
                  value={weeklyReport}
                  onValueChange={setWeeklyReport}
                  trackColor={{ false: theme.border, true: COLORS.primary }}
                  thumbColor="#ffffff"
                />
              </View>
            </Card>
          </View>

          {/* Footer logout */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={async () => {
              await storage.clearTokens();
              setAccessToken(null);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Splash' }],
              });
            }}
          >
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  menuGroup: {
    gap: SPACING.sm,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    paddingLeft: SPACING.xs,
  },
  menuList: {
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDivider: {
    height: 1,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  toggleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  toggleDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  logoutBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '700',
  },
});
