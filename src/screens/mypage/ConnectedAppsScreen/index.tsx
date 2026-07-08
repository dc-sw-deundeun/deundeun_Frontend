import React from 'react';
import { View, Platform } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Activity, Smartphone } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './ConnectedAppsScreen.styles';
import { SyncAppCard } from './components/SyncAppCard';
import { useConnectedApps } from './hooks/useConnectedApps';

export default function ConnectedAppsScreen({ navigation }: RootStackScreenProps<'ConnectedApps'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
    samsungSynced,
    setSamsungSynced,
    appleSynced,
    setAppleSynced,
    googleSynced,
    setGoogleSynced,
    handleToggleApp,
  } = useConnectedApps();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="연동 앱 관리" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.introContainer}>
          <Text style={[styles.introText, { color: theme.textMuted }]}>
            연동된 앱에서 걸음·심박·체중 데이터를 가져와 미션과 분석에 활용해요.
          </Text>
        </View>

        {/* Sync Sources Toggles */}
        <View style={styles.syncList}>
          {Platform.OS === 'android' && (
            <SyncAppCard
              icon={<Activity color="#2E7D32" size={22} />}
              iconBg="#E8F5E9"
              title="삼성 헬스"
              subtitle={samsungSynced ? '연동됨 · 방금 동기화' : '연결 안 됨'}
              value={samsungSynced}
              onValueChange={() => handleToggleApp('SAMSUNG_HEALTH', samsungSynced, setSamsungSynced)}
              theme={theme}
            />
          )}

          {Platform.OS === 'ios' && (
            <SyncAppCard
              icon={<Smartphone color="#C62828" size={22} />}
              iconBg="#FFEBEE"
              title="애플 건강"
              subtitle={appleSynced ? '연동됨 · 방금 동기화' : '연결 안 됨'}
              value={appleSynced}
              onValueChange={() => handleToggleApp('APPLE_HEALTH', appleSynced, setAppleSynced)}
              theme={theme}
            />
          )}

          <SyncAppCard
            icon={<ShieldCheck color="#1565C0" size={22} />}
            iconBg="#E3F2FD"
            title="구글 피트니스"
            subtitle={googleSynced ? '연동됨 · 10분 전 동기화' : '연결 안 됨'}
            value={googleSynced}
            onValueChange={() => handleToggleApp('GOOGLE_FIT', googleSynced, setGoogleSynced)}
            theme={theme}
          />
        </View>

        {/* Security / Privacy Warning */}
        <Card style={styles.securityNotice} radius={16}>
          <Text style={[styles.securityText, { color: theme.textMuted }]}>
            🛡️ 연동 데이터는 암호화되어 기기에 안전하게 보관되며, 사용자의 사전 동의 없이 외부 제 3자에게 제공되지 않습니다.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}
