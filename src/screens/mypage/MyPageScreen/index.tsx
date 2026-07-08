import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';

// Navigation types
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';

import { styles } from './MyPageScreen.styles';
import { AccountMenuCard } from './components/AccountMenuCard';
import { NotificationTogglesCard } from './components/NotificationTogglesCard';
import { ConfirmModal } from './components/ConfirmModal';
import { useMyPageSettings } from './hooks/useMyPageSettings';
import { useAccountActions } from './hooks/useAccountActions';

type MyPageScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'MyPage'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
    nickname,
    email,
    dietAlert,
    missionAlert,
    recordAlert,
    weeklyReport,
    handleToggleDietAlert,
    handleToggleMissionAlert,
    handleToggleRecordAlert,
    handleToggleWeeklyReport,
  } = useMyPageSettings();

  const { handleDeleteAccount, handleLogout } = useAccountActions(navigation);

  // Modal visibility states
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="마이페이지" variant="section" />
        <View style={styles.scrollContent}>
          {/* Profile Card */}
          <Card 
            style={styles.profileCard} 
            radius={24}
            onPress={() => navigation.navigate('EditProfile', { nickname, email })}
          >
            <View style={[styles.avatarCircle, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={{ fontSize: 32 }}>🥬</Text>
            </View>
            <View>
              <Text style={[styles.profileName, { color: theme.text }]}>{nickname} 님</Text>
              <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{email}</Text>
            </View>
          </Card>

          {/* Account Settings Menu */}
          <View style={styles.menuGroup}>
            <Text style={[styles.groupTitle, { color: theme.textMuted }]}>계정 및 보안</Text>
            <AccountMenuCard
              onChangePassword={() => navigation.navigate('ChangePassword')}
              onConnectedApps={() => navigation.navigate('ConnectedApps')}
              theme={theme}
            />
          </View>

          {/* Notifications toggles */}
          <View style={styles.menuGroup}>
            <Text style={[styles.groupTitle, { color: theme.textMuted }]}>알림 설정</Text>
            <NotificationTogglesCard
              dietAlert={dietAlert}
              onToggleDietAlert={handleToggleDietAlert}
              missionAlert={missionAlert}
              onToggleMissionAlert={handleToggleMissionAlert}
              recordAlert={recordAlert}
              onToggleRecordAlert={handleToggleRecordAlert}
              weeklyReport={weeklyReport}
              onToggleWeeklyReport={handleToggleWeeklyReport}
              theme={theme}
            />
          </View>

          {/* Footer logout */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setIsLogoutModalVisible(true)}
          >
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>

          {/* Delete Account button */}
          <TouchableOpacity
            style={styles.deleteAccountBtn}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Text style={styles.deleteAccountText}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Account confirmation Modal */}
      <ConfirmModal
        visible={isDeleteModalVisible}
        title="회원 탈퇴"
        description={'정말로 회원 탈퇴하겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.'}
        onCancel={() => setIsDeleteModalVisible(false)}
        onConfirm={() => {
          setIsDeleteModalVisible(false);
          handleDeleteAccount();
        }}
        theme={theme}
      />

      {/* Logout confirmation Modal */}
      <ConfirmModal
        visible={isLogoutModalVisible}
        title="로그아웃"
        description="로그아웃 하시겠습니까?"
        confirmBgColor={COLORS.primary}
        onCancel={() => setIsLogoutModalVisible(false)}
        onConfirm={() => {
          setIsLogoutModalVisible(false);
          handleLogout();
        }}
        theme={theme}
      />
    </SafeAreaView>
  );
}
