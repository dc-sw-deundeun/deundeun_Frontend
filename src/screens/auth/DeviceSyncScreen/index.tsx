import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Smartphone, Activity, ShieldCheck } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { onboardingApi } from '@/api';
import { styles } from './DeviceSyncScreen.styles';
import { SyncSourceCard } from './components/SyncSourceCard';
import { useDeviceSync } from './hooks/useDeviceSync';

export default function DeviceSyncScreen({ navigation }: RootStackScreenProps<'DeviceSync'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const { connectingApp, syncedApps, handleSync } = useDeviceSync(() => navigation.navigate('CheckupOcr'));

  const isAnySynced = syncedApps.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="기기 연동"
        onBack={() => navigation.goBack()}
        right={
          !isAnySynced ? (
            <TouchableOpacity
              onPress={async () => {
                if (syncedApps.length > 0) {
                  // 이미 연동했다면 SKIP API를 부르지 않고(409 방지) 바로 이동
                  navigation.navigate('CheckupOcr');
                  return;
                }
                try {
                  await onboardingApi.connectWearable({ action: 'SKIP' });
                } catch (e) {
                  console.warn('Skip API error', e);
                }
                navigation.navigate('CheckupOcr');
              }}
              style={styles.skipButton}
            >
              <Text style={[styles.skipButtonText, { color: theme.textMuted }]}>건너뛰기</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <View style={styles.content}>
        {/* Step Header */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isAnySynced ? '연동이 완료됐어요!' : '건강 데이터를\n연동해 주세요'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {isAnySynced
              ? '이제 든든이가 건강 데이터를 읽어\n매일 맞춤 미션을 준비해요.'
              : '걸음 수·심박수 등을 가져와 더 정확한\n미션과 건강 분석을 제공해 드립니다.'}
          </Text>
        </View>

        {/* Sync Sources */}
        <View style={styles.syncList}>
          {Platform.OS === 'android' && (
            <SyncSourceCard
              icon={<Activity color="#2E7D32" size={24} />}
              iconBg="#E8F5E9"
              title="삼성 헬스"
              subtitle="걸음 · 수면 · 심박수 연동"
              isConnectingThis={connectingApp === 'Samsung'}
              isAnyConnecting={connectingApp !== null}
              isSynced={syncedApps.includes('Samsung')}
              isAnySynced={isAnySynced}
              onPress={() => handleSync('Samsung')}
              theme={theme}
            />
          )}

          {Platform.OS === 'ios' && (
            <SyncSourceCard
              icon={<Smartphone color="#C62828" size={24} />}
              iconBg="#FFEBEE"
              title="애플 건강"
              subtitle="활동 · 심전도 · 영양 연동"
              isConnectingThis={connectingApp === 'Apple'}
              isAnyConnecting={connectingApp !== null}
              isSynced={syncedApps.includes('Apple')}
              isAnySynced={isAnySynced}
              onPress={() => handleSync('Apple')}
              theme={theme}
            />
          )}

          <SyncSourceCard
            icon={<ShieldCheck color="#1565C0" size={24} />}
            iconBg="#E3F2FD"
            title="구글 피트니스"
            subtitle="활동 · 심박 · 체중 연동"
            isConnectingThis={connectingApp === 'Google'}
            isAnyConnecting={connectingApp !== null}
            isSynced={syncedApps.includes('Google')}
            isAnySynced={isAnySynced}
            onPress={() => handleSync('Google')}
            theme={theme}
          />
        </View>

        {/* Footer buttons */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isAnySynced ? COLORS.primary : theme.disabledBg },
            ]}
            onPress={() => navigation.navigate('CheckupOcr')}
          >
            <Text
              style={[
                styles.submitButtonText,
                { color: isAnySynced ? '#ffffff' : theme.disabledText },
              ]}
            >
              {isAnySynced ? '검진지 촬영하러 가기' : '다음으로 넘어가기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
