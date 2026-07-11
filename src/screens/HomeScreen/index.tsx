import React, { useState } from 'react';
import { View, Image, Platform } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf } from 'lucide-react-native';

// Navigation types
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';
import { getMediaImageUrl } from '@/utils/imageUrl';

import { styles } from './HomeScreen.styles';
import { GardenView } from './components/GardenView';
import { MissionBottomSheet } from './components/MissionBottomSheet';
import { LevelUpModal } from './components/LevelUpModal';
import { AnimalRevealModal } from './components/AnimalRevealModal';
import { useHomeData } from './hooks/useHomeData';
import { useAnimalReveal } from './hooks/useAnimalReveal';
import { useDraggableSheet } from './hooks/useDraggableSheet';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { isDarkMode } = useAppStore();

  const theme = {
    background: '#A6D7A8', // Pastel grass green
    cardBg: '#F5F4EE',    // Cream off-white card background
    textDark: '#1C2E21',  // Deep forest dark green text
    textMuted: '#7A8C7C', // Muted sage text
    border: '#E2E1D8',
  };

  const {
    currentRevealAnimal,
    revealStep,
    fadeAnim,
    scaleAnim,
    shakeStyle,
    startShake,
    triggerUnlockReveal,
    handleConfirmReveal,
    closeReveal,
  } = useAnimalReveal();

  const {
    totalPoints,
    missions,
    characters,
    isLevelUpVisible,
    setIsLevelUpVisible,
    levelUpAnimal,
    gardenLayout,
    setGardenLayout,
    completedCount,
    handleToggleMission,
    closeLevelUpModal,
  } = useHomeData(triggerUnlockReveal);

  const { sheetY, panResponder } = useDraggableSheet();

  // Glass styles
  const glassSheetStyle = {
    backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.55)' : 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.75)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.12 : 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  };

  const glassModalCardStyle = {
    backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.85)' : 'rgba(255, 255, 255, 0.75)',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.75)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.15 : 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={getMediaImageUrl('ui', 'splash_icon')}
            style={styles.logoImage}
          />
          <Text style={[styles.logoText, { color: theme.textDark }]}>든든</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Points badge */}
          <View style={[styles.pointsBadge, { backgroundColor: '#2E5E35', gap: 6, paddingHorizontal: 10 }]}>
            <Leaf color="#ffffff" size={14} fill="#ffffff" />
            <Text style={[styles.badgeText, { color: '#ffffff' }]}>{totalPoints}</Text>
          </View>
        </View>
      </View>

      {/* Main Garden Area */}
      <GardenView
        characters={characters}
        gardenLayout={gardenLayout}
        onLayout={(width, height) => setGardenLayout({ width, height })}
      />

      {/* Bottom Sheet Card */}
      <MissionBottomSheet
        missions={missions}
        completedCount={completedCount}
        isDarkMode={isDarkMode}
        theme={theme}
        glassSheetStyle={glassSheetStyle}
        sheetY={sheetY}
        panHandlers={panResponder.panHandlers}
        onToggleMission={handleToggleMission}
      />

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        visible={isLevelUpVisible}
        onRequestClose={() => setIsLevelUpVisible(false)}
        onConfirmClose={closeLevelUpModal}
        levelUpAnimal={levelUpAnimal}
        theme={theme}
      />

      {/* Animal Unlock Reveal Modal */}
      {/* <AnimalRevealModal
        currentRevealAnimal={currentRevealAnimal}
        revealStep={revealStep}
        shakeStyle={shakeStyle}
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
        onShakePress={startShake}
        onConfirm={handleConfirmReveal}
        onRequestClose={closeReveal}
      /> */}
    </SafeAreaView>
  );
}
