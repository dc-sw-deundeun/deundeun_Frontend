import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Star, Award } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { useFocusEffect } from '@react-navigation/native';
import { characterApi, CharacterMeResponse, AnimalCatalogItem } from '@/api';

// 동물 코드와 로컬 이미지 매핑 정의 (사용자 가이드 반영)
const ANIMAL_IMAGES: Record<string, any> = {
  frog: require('../../assets/animal/frog1.png'),
  chick: require('../../assets/animal/chick1.png'),
  pan: require('../../assets/animal/pan1.png'), // 펭귄
  dog: require('../../assets/animal/dog1.png'),
  cat: require('../../assets/animal/cat1.png'),
  tig: require('../../assets/animal/tig1.png'), // 호랑이
  bear: require('../../assets/animal/bear1.png'), // 판다
  mon: require('../../assets/animal/mon1.png'), // 원숭이
};

// 백엔드 동물 코드를 로컬 이미지 매핑 키로 변환
const mapAnimalCodeToAssetKey = (code: string): string => {
  switch (code) {
    case 'penguin':
      return 'pan';
    case 'tiger':
      return 'tig';
    case 'panda':
      return 'bear';
    case 'monkey':
      return 'mon';
    default:
      return code; // 'frog', 'chick', 'dog', 'cat'
  }
};

export default function GrowthScreen() {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [loading, setLoading] = useState(true);
  const [characterInfo, setCharacterInfo] = useState<CharacterMeResponse | null>(null);
  const [animalsCatalog, setAnimalsCatalog] = useState<AnimalCatalogItem[]>([]);

  // API 데이터 로드
  const loadGrowthData = useCallback(async () => {
    try {
      setLoading(true);
      const [charRes, catalogRes] = await Promise.all([
        characterApi.getMyCharacter(),
        characterApi.getAnimalsCatalog(),
      ]);

      if (charRes.success && charRes.data) {
        setCharacterInfo(charRes.data);
      }
      if (catalogRes.success && catalogRes.data) {
        setAnimalsCatalog(catalogRes.data.animals);
      }
    } catch (error) {
      console.error('성장 기록 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면 포커스 시 실시간 성장 기록 갱신
  useFocusEffect(
    useCallback(() => {
      loadGrowthData();
    }, [loadGrowthData])
  );

  if (loading && !characterInfo) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const currentLevel = characterInfo?.level ?? 1;
  const currentExp = characterInfo?.current_level_exp ?? 0;
  const expToNext = characterInfo?.exp_to_next_level ?? 100;
  const totalRequiredExp = currentExp + expToNext;
  const progressPercent = `${((characterInfo?.progress_ratio ?? 0) * 100).toFixed(0)}%`;
  const totalExp = characterInfo?.total_exp ?? 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="성장 기록" variant="section" />
        <View style={styles.scrollContent}>

          {/* Progress Card */}
          <Card style={styles.card} radius={24}>
            <View style={styles.progressHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Star color={COLORS.primary} size={18} fill={COLORS.primaryLight} />
                <Text style={[styles.progressTitle, { color: theme.text }]}>성장 포인트 (Lv {currentLevel})</Text>
              </View>
              <Text style={[styles.progressRatio, { color: COLORS.primary }]}>{currentExp} / {totalRequiredExp} XP</Text>
            </View>

            {/* Level Bar */}
            <View style={[styles.progressBarContainer, { backgroundColor: theme.background }]}>
              <View style={[styles.progressBarFill, { backgroundColor: COLORS.primary, width: progressPercent }]} />
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
                  <Text style={[styles.statValue, { color: theme.text }]}>{totalExp.toLocaleString()}</Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>든든 포인트</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Companions Grid */}
          <View style={styles.companionsSection}>
            <Text style={[styles.companionsTitle, { color: theme.text }]}>함께 자란 친구들</Text>

            <View style={styles.companionsGrid}>
              {animalsCatalog.map((animal) => {
                const assetKey = mapAnimalCodeToAssetKey(animal.animal_code);
                const imageSource = ANIMAL_IMAGES[assetKey];
                const isUnlocked = animal.is_unlocked;

                return (
                  <View
                    key={animal.animal_code}
                    style={[
                      styles.companionCard,
                      {
                        backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.65)' : 'rgba(255, 255, 255, 0.55)',
                        borderColor: isUnlocked
                          ? (isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.6)')
                          : 'rgba(0, 0, 0, 0.02)',
                        opacity: isUnlocked ? 1 : 0.55,
                      },
                    ]}
                  >
                    {isUnlocked ? (
                      <>
                        <View style={[styles.emojiCircle, { backgroundColor: theme.background }]}>
                          {imageSource ? (
                            <Image source={imageSource} style={styles.companionImage} />
                          ) : (
                            <Text style={styles.companionEmoji}>🐾</Text>
                          )}
                        </View>
                        <Text style={[styles.companionName, { color: theme.text }]} numberOfLines={1}>{animal.name}</Text>
                        <View style={[styles.levelBadge, { backgroundColor: COLORS.primaryLight }]}>
                          <Text style={[styles.levelText, { color: COLORS.primaryDark }]}>
                            Lv {animal.unlock_level}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={[styles.emojiCircle, { backgroundColor: theme.background, opacity: 0.7 }]}>
                          {imageSource ? (
                            <View style={styles.imageOverlayContainer}>
                              <Image source={imageSource} style={[styles.companionImage, { opacity: 0.15 }]} />
                              <View style={[StyleSheet.absoluteFill, styles.lockOverlay]}>
                                <Text style={styles.lockText}>🔒</Text>
                              </View>
                            </View>
                          ) : (
                            <Text style={[styles.companionEmoji, { fontSize: 24 }]}>🔒</Text>
                          )}
                        </View>
                        <Text style={[styles.companionName, { color: theme.textMuted }]} numberOfLines={1}>잠김</Text>
                        <View style={[styles.levelBadge, { backgroundColor: theme.border }]}>
                          <Text style={[styles.levelText, { color: theme.textMuted }]}>Lv {animal.unlock_level}</Text>
                        </View>
                      </>
                    )}
                  </View>
                );
              })}
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
  companionImage: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
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
  imageOverlayContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 16,
  },
});
