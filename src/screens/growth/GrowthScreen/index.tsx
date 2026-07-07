import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { styles } from './GrowthScreen.styles';
import { ProgressCard } from './components/ProgressCard';
import { CompanionCard } from './components/CompanionCard';
import { useGrowthData } from './hooks/useGrowthData';
import Text from '@/components/Text';

export default function GrowthScreen() {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const { loading, characterInfo, animalsCatalog } = useGrowthData();

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

  // 전체 카탈로그 중 고유하게 획득한 동물 수 계산 (중복 제외)
  const uniqueOwnedCount = animalsCatalog.filter(a => a.is_unlocked).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="성장 기록" variant="section" />
        <View style={styles.scrollContent}>

          {/* Progress Card */}
          <ProgressCard
            currentLevel={currentLevel}
            currentExp={currentExp}
            totalRequiredExp={totalRequiredExp}
            expToNext={expToNext}
            progressPercent={progressPercent}
            totalExp={totalExp}
            uniqueOwnedCount={uniqueOwnedCount}
            catalogCount={animalsCatalog.length}
            theme={theme}
          />

          {/* Companions Grid */}
          <View style={styles.companionsSection}>
            <Text style={[styles.companionsTitle, { color: theme.text }]}>
              함께 자란 친구들 ({uniqueOwnedCount} / {animalsCatalog.length})
            </Text>

            <View style={styles.companionsGrid}>
              {animalsCatalog.map((animal) => {
                // 유저의 실제 owned_animals 배열에서 동일한 동물이 몇 마리 있는지 세어 해당 동물의 레벨 계산
                const animalLevel = characterInfo?.owned_animals.filter(
                  (owned) => owned.animal_code === animal.animal_code
                ).length ?? 0;

                return (
                  <CompanionCard
                    key={animal.animal_code}
                    animal={animal}
                    animalLevel={animalLevel}
                    isDarkMode={isDarkMode}
                    theme={theme}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
