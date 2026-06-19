import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HomeStackScreenProps } from '@/types/navigation';
import { useAppStore } from '@/store/useAppStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import Button from '@/components/Button';
import api from '@/services/api';

interface UserData {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

export const HomeScreen: React.FC<HomeStackScreenProps<'Home'>> = ({ navigation }) => {
  const { count, isDarkMode, increment, decrement, toggleDarkMode } = useAppStore();
  
  // API Fetching 테스트 상태
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeColors = isDarkMode ? COLORS.dark : COLORS.light;

  const handleFetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      // 임시 API 호출 예제
      const userData = await api.get<UserData>('/users/1');
      setUser(userData);
    } catch (err: any) {
      setError(err.message || '데이터를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 테마 헤더 */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>DeunDeun App Setup</Text>
        <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
          React Native & TypeScript Boilerplate
        </Text>
      </View>

      {/* Zustand 전역 상태 및 테마 카드 */}
      <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>Zustand 상태 관리 & 테마</Text>
        
        <View style={styles.counterRow}>
          <Text style={[styles.counterText, { color: themeColors.text }]}>
            카운트: <Text style={styles.highlight}>{count}</Text>
          </Text>
          <View style={styles.counterButtons}>
            <Button title="-" onPress={decrement} size="sm" style={styles.controlBtn} />
            <Button title="+" onPress={increment} size="sm" style={styles.controlBtn} />
          </View>
        </View>

        <Button 
          title={isDarkMode ? '🌞 라이트 모드로 전환' : '🌙 다크 모드로 전환'} 
          onPress={toggleDarkMode}
          variant="outline"
          style={styles.actionBtn}
        />
      </View>

      {/* API 호출 예제 카드 */}
      <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>API 호출 및 비동기 상태</Text>
        
        {user ? (
          <View style={styles.userContainer}>
            <Text style={[styles.userLabel, { color: themeColors.text }]}>이름: {user.name}</Text>
            <Text style={[styles.userLabel, { color: themeColors.textMuted }]}>이메일: {user.email}</Text>
            <Text style={[styles.userLabel, { color: themeColors.textMuted }]}>회사: {user.company.name}</Text>
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
            {error ? `오류: ${error}` : '가져온 사용자 데이터가 없습니다.'}
          </Text>
        )}

        <Button 
          title="사용자 정보 가져오기 (fetch)" 
          onPress={handleFetchUser}
          loading={loading}
          variant="secondary"
          style={styles.actionBtn}
        />
      </View>

      {/* 네비게이션 이동 카드 */}
      <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>React Navigation</Text>
        <Text style={[styles.cardDescription, { color: themeColors.textMuted }]}>
          네비게이터를 이용하여 Details 스크린으로 이동하고 파라미터를 넘기는 테스트를 진행합니다.
        </Text>
        <Button 
          title="상세 페이지 이동" 
          onPress={() => navigation.navigate('Details', { itemId: 42, otherParam: 'Hello from Home!' })}
          variant="primary"
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  cardDescription: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  counterText: {
    ...TYPOGRAPHY.bodyBold,
  },
  highlight: {
    color: COLORS.primary,
    fontSize: 20,
  },
  counterButtons: {
    flexDirection: 'row',
  },
  controlBtn: {
    marginLeft: SPACING.sm,
    minWidth: 44,
  },
  actionBtn: {
    marginTop: SPACING.xs,
  },
  userContainer: {
    padding: SPACING.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    marginBottom: SPACING.md,
  },
  userLabel: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
});

export default HomeScreen;
