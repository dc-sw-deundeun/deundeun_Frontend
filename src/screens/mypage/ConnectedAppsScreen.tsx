import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Activity, Smartphone } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { RootStackScreenProps } from '@/types/navigation';

export default function ConnectedAppsScreen({ navigation }: RootStackScreenProps<'ConnectedApps'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Toggle states prefilled to match wireframe defaults
  const [samsungSynced, setSamsungSynced] = useState(true);
  const [appleSynced, setAppleSynced] = useState(false);
  const [googleSynced, setGoogleSynced] = useState(true);

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
          {/* Samsung Health */}
          <Card style={styles.syncCard}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
                <Activity color="#2E7D32" size={22} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>삼성 헬스</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
                  {samsungSynced ? '연동됨 · 방금 동기화' : '연결 안 됨'}
                </Text>
              </View>
            </View>
            <Switch
              value={samsungSynced}
              onValueChange={setSamsungSynced}
              trackColor={{ false: theme.border, true: COLORS.primary }}
              thumbColor="#ffffff"
            />
          </Card>

          {/* Apple Health */}
          <Card style={styles.syncCard}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
                <Smartphone color="#C62828" size={22} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>애플 건강</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
                  {appleSynced ? '연동됨 · 방금 동기화' : '연결 안 됨'}
                </Text>
              </View>
            </View>
            <Switch
              value={appleSynced}
              onValueChange={setAppleSynced}
              trackColor={{ false: theme.border, true: COLORS.primary }}
              thumbColor="#ffffff"
            />
          </Card>

          {/* Google Fit */}
          <Card style={styles.syncCard}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E3F2FD' }]}>
                <ShieldCheck color="#1565C0" size={22} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>구글 피트니스</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
                  {googleSynced ? '연동됨 · 10분 전 동기화' : '연결 안 됨'}
                </Text>
              </View>
            </View>
            <Switch
              value={googleSynced}
              onValueChange={setGoogleSynced}
              trackColor={{ false: theme.border, true: COLORS.primary }}
              thumbColor="#ffffff"
            />
          </Card>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.lg,
  },
  introContainer: {
    paddingVertical: SPACING.xs,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  syncList: {
    gap: SPACING.md,
    flex: 1,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  securityNotice: {
    padding: SPACING.md,
  },
  securityText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});
