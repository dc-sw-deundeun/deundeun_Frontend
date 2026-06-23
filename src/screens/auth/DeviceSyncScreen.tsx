import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Check, Smartphone, Activity, ShieldCheck } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';

export default function DeviceSyncScreen({ navigation }: RootStackScreenProps<'DeviceSync'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [connectingApp, setConnectingApp] = useState<string | null>(null);
  const [syncedApps, setSyncedApps] = useState<string[]>([]);

  const handleSync = (appName: string) => {
    if (syncedApps.includes(appName)) return;
    setConnectingApp(appName);

    // Simulate standard connection latency
    setTimeout(() => {
      setSyncedApps((prev) => [...prev, appName]);
      setConnectingApp(null);
    }, 1500);
  };

  const isAnySynced = syncedApps.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="기기 연동"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.skipButton}>
            <Text style={[styles.skipButtonText, { color: theme.textMuted }]}>건너뛰기</Text>
          </TouchableOpacity>
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
          {/* Samsung Health */}
          <TouchableOpacity
            style={[
              styles.syncCard,
              {
                backgroundColor: theme.card,
                borderColor: syncedApps.includes('Samsung') ? COLORS.primary : theme.border,
              },
            ]}
            onPress={() => handleSync('Samsung')}
            disabled={connectingApp !== null}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
                <Activity color="#2E7D32" size={24} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>삼성 헬스</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>걸음 · 수면 · 심박수 연동</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              {connectingApp === 'Samsung' ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : syncedApps.includes('Samsung') ? (
                <View style={[styles.checkCircle, { backgroundColor: COLORS.primary }]}>
                  <Check color="#ffffff" size={14} strokeWidth={3} />
                </View>
              ) : (
                <Text style={[styles.syncLinkText, { color: COLORS.primary }]}>연동하기</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Apple Health */}
          <TouchableOpacity
            style={[
              styles.syncCard,
              {
                backgroundColor: theme.card,
                borderColor: syncedApps.includes('Apple') ? COLORS.primary : theme.border,
              },
            ]}
            onPress={() => handleSync('Apple')}
            disabled={connectingApp !== null}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
                <Smartphone color="#C62828" size={24} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>애플 건강</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>활동 · 심전도 · 영양 연동</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              {connectingApp === 'Apple' ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : syncedApps.includes('Apple') ? (
                <View style={[styles.checkCircle, { backgroundColor: COLORS.primary }]}>
                  <Check color="#ffffff" size={14} strokeWidth={3} />
                </View>
              ) : (
                <Text style={[styles.syncLinkText, { color: COLORS.primary }]}>연동하기</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Google Fit */}
          <TouchableOpacity
            style={[
              styles.syncCard,
              {
                backgroundColor: theme.card,
                borderColor: syncedApps.includes('Google') ? COLORS.primary : theme.border,
              },
            ]}
            onPress={() => handleSync('Google')}
            disabled={connectingApp !== null}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E3F2FD' }]}>
                <ShieldCheck color="#1565C0" size={24} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>구글 피트니스</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>활동 · 심박 · 체중 연동</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              {connectingApp === 'Google' ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : syncedApps.includes('Google') ? (
                <View style={[styles.checkCircle, { backgroundColor: COLORS.primary }]}>
                  <Check color="#ffffff" size={14} strokeWidth={3} />
                </View>
              ) : (
                <Text style={[styles.syncLinkText, { color: COLORS.primary }]}>연동하기</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer buttons */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isAnySynced ? COLORS.primary : theme.disabledBg },
            ]}
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text
              style={[
                styles.submitButtonText,
                { color: isAnySynced ? '#ffffff' : theme.disabledText },
              ]}
            >
              {isAnySynced ? '든든 홈으로 가기' : '다음으로 넘어가기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    padding: SPACING.sm,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    lineHeight: 34,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  syncList: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.md,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  cardRight: {},
  syncLinkText: {
    fontSize: 14,
    fontWeight: '700',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    width: '100%',
    marginTop: SPACING.md,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
