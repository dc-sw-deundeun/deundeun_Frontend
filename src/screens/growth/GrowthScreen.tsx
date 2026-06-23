import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Star, Award } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';

interface CompanionCharacter {
  id: number;
  emoji: string;
  name: string;
  level: number;
  unlocked: boolean;
}

export default function GrowthScreen() {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const characters: CompanionCharacter[] = [
    { id: 1, emoji: '🐯', name: '호랑이', level: 40, unlocked: true },
    { id: 2, emoji: '🐼', name: '판다', level: 35, unlocked: true },
    { id: 3, emoji: '🐰', name: '토끼', level: 33, unlocked: true },
    { id: 4, emoji: '🐹', name: '햄스터', level: 18, unlocked: true },
    { id: 5, emoji: '🐱', name: '고양이', level: 17, unlocked: true },
    { id: 6, emoji: '🦊', name: '여우', level: 14, unlocked: true },
    { id: 7, emoji: '🐻', name: '곰', level: 13, unlocked: true },
    { id: 8, emoji: '🐔', name: '닭', level: 0, unlocked: false },
    { id: 9, emoji: '🐷', name: '돼지', level: 0, unlocked: false },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="성장 기록" variant="section" />
        <View style={styles.scrollContent}>
          {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>오늘도 반가워요! ✦</Text>
          <Text style={[styles.welcomeSub, { color: theme.textMuted }]}>
            하루 미션을 지키며 든든이들을 레벨업 하세요.
          </Text>
        </View>

        {/* Progress Card */}
        <Card style={styles.card} radius={24}>
          <View style={styles.progressHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Star color={COLORS.primary} size={18} fill={COLORS.primaryLight} />
              <Text style={[styles.progressTitle, { color: theme.text }]}>성장 포인트</Text>
            </View>
            <Text style={[styles.progressRatio, { color: COLORS.primary }]}>35 / 50 XP</Text>
          </View>

          {/* Level Bar */}
          <View style={[styles.progressBarContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.progressBarFill, { backgroundColor: COLORS.primary }]} />
          </View>
          <Text style={[styles.progressHelpText, { color: theme.textMuted }]}>
            12일 연속 건강 기록 달성 중! (+15 XP 추가 획득 가능)
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Statistics Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Flame color={COLORS.warning} size={22} fill={COLORS.warning} />
              <View style={styles.statInfo}>
                <Text style={[styles.statValue, { color: theme.text }]}>28일</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>연속 실천</Text>
              </View>
            </View>

            <View style={styles.statBox}>
              <Award color={COLORS.primary} size={22} fill={COLORS.primaryLight} />
              <View style={styles.statInfo}>
                <Text style={[styles.statValue, { color: theme.text }]}>4,856</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>든든 포인트</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Companions Grid */}
        <View style={styles.companionsSection}>
          <Text style={[styles.companionsTitle, { color: theme.text }]}>함께 자란 친구들</Text>

          <View style={styles.companionsGrid}>
            {characters.map((char) => (
              <View
                key={char.id}
                style={[
                  styles.companionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: char.unlocked ? theme.border : 'rgba(0, 0, 0, 0.02)',
                    opacity: char.unlocked ? 1 : 0.5,
                  },
                ]}
              >
                {char.unlocked ? (
                  <>
                    <View style={[styles.emojiCircle, { backgroundColor: theme.background }]}>
                      <Text style={styles.companionEmoji}>{char.emoji}</Text>
                    </View>
                    <Text style={[styles.companionName, { color: theme.text }]}>{char.name}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: COLORS.primaryLight }]}>
                      <Text style={[styles.levelText, { color: COLORS.primaryDark }]}>
                        Lv {char.level}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.emojiCircle, { backgroundColor: theme.background, opacity: 0.5 }]}>
                      <Text style={[styles.companionEmoji, { fontSize: 24 }]}>🔒</Text>
                    </View>
                    <Text style={[styles.companionName, { color: theme.textMuted }]}>잠김</Text>
                    <View style={[styles.levelBadge, { backgroundColor: theme.border }]}>
                      <Text style={[styles.levelText, { color: theme.textMuted }]}>Lv --</Text>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        </View>
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
  welcomeSection: {
    gap: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '800',
  },
  welcomeSub: {
    fontSize: 13,
  },
  card: {
    padding: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  progressRatio: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    width: '70%', // 35 / 50
    height: '100%',
    borderRadius: 6,
  },
  progressHelpText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1.5,
    marginVertical: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  statInfo: {
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
  },
  companionsSection: {
    gap: SPACING.md,
  },
  companionsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  companionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  companionCard: {
    width: '30.5%',
    aspectRatio: 0.85,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  companionEmoji: {
    fontSize: 28,
  },
  companionName: {
    fontSize: 12,
    fontWeight: '700',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
