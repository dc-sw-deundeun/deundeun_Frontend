import React from 'react';
import { View, ScrollView, Platform, UIManager } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { styles } from './PracticeScreen.styles';
import { WeeklyRecordCard } from './components/WeeklyRecordCard';
import { MissionListCard } from './components/MissionListCard';
import { AchievementBanner } from './components/AchievementBanner';
import { MonthlyCalendarCard } from './components/MonthlyCalendarCard';
import { VerifyMissionModal } from './components/VerifyMissionModal';
import { useTodayMissions } from './hooks/useTodayMissions';
import { useMonthlyCalendar } from './hooks/useMonthlyCalendar';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PracticeScreen() {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Glassmorphism design styles preserving base colors
  const glassCardStyle = {
    backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.5)' : 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.75)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.12 : 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  };

  const glassBannerStyle = {
    backgroundColor: isDarkMode ? 'rgba(35, 48, 33, 0.65)' : 'rgba(53, 75, 51, 0.5)',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.12 : 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  };

  const {
    missions,
    streakDays,
    completedCount,
    isVerifyModalVisible,
    handleVerifyPress,
    handleCompleteVerification,
    handleCancelVerification,
  } = useTodayMissions();

  const {
    scrollViewRef,
    selectedMonth,
    selectedDayDetail,
    monthData,
    getMonthData,
    handlePrevMonth,
    handleNextMonth,
    handleDayPress,
    closeDayDetail,
  } = useMonthlyCalendar();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header with Search, Dark Mode, and Bell actions */}
        <ScreenHeader
          title="매일의 실천"
          variant="section"
        />

        <View style={styles.scrollContent}>
          {/* 1. 이번 주 기록 Card */}
          <WeeklyRecordCard streakDays={streakDays} glassCardStyle={glassCardStyle} theme={theme} />

          {/* 2. 오늘의 미션 Section Header & Cards */}
          <MissionListCard
            missions={missions}
            completedCount={completedCount}
            glassCardStyle={glassCardStyle}
            onVerifyPress={handleVerifyPress}
            theme={theme}
          />

          {/* 3. 주간 미션 달성 현황 Banner */}
          <AchievementBanner glassBannerStyle={glassBannerStyle} />

          {/* 4. 월간 활동 현황 Calendar Card (Expands smoothly to show details inline) */}
          <MonthlyCalendarCard
            glassCardStyle={glassCardStyle}
            theme={theme}
            selectedMonth={selectedMonth}
            selectedDayDetail={selectedDayDetail}
            monthData={monthData}
            getMonthData={getMonthData}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDayPress={handleDayPress}
            onCloseDayDetail={closeDayDetail}
          />
        </View>
      </ScrollView>

      {/* Verification bottom sheet modal */}
      <VerifyMissionModal
        visible={isVerifyModalVisible}
        onConfirm={handleCompleteVerification}
        onCancel={handleCancelVerification}
        theme={theme}
      />
    </SafeAreaView>
  );
}
