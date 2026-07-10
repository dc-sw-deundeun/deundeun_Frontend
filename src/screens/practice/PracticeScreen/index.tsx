import React from 'react';
import { View, ScrollView, Platform, UIManager } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { styles } from './PracticeScreen.styles';
import { WeeklyRecordCard } from './components/WeeklyRecordCard';
import { MissionListCard } from './components/MissionListCard';
import { MonthlyCalendarCard } from './components/MonthlyCalendarCard';
import { SummaryGraphCard } from './components/SummaryGraphCard';
import { useTodayMissions } from './hooks/useTodayMissions';
import { useMonthlyCalendar } from './hooks/useMonthlyCalendar';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PracticeScreen() {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Solid white/ivory card style to match the design
  const glassCardStyle = {
    backgroundColor: isDarkMode ? '#2A2D27' : '#FFFFFF',
    borderWidth: 0,
    borderRadius: 24,
    shadowColor: isDarkMode ? '#000000' : '#8A9984',
    shadowOpacity: isDarkMode ? 0.2 : 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
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
    weeklyStats,
    summaryStats,
    completedCount,
    submittingId,
    handleVerifyPress,
  } = useTodayMissions();

  const {
    scrollViewRef,
    selectedMonthString,
    selectedDayDetail,
    selectedDayMissions,
    loadingDayMissions,
    monthData,
    handlePrevMonth,
    handleNextMonth,
    handleGoToToday,
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
          <WeeklyRecordCard 
            weeklyStats={weeklyStats} 
            summaryStats={summaryStats} 
            glassCardStyle={glassCardStyle} 
            theme={theme} 
          />

          {/* 2. 오늘의 미션 Section Header & Cards */}
          <MissionListCard
            missions={missions}
            completedCount={completedCount}
            glassCardStyle={glassCardStyle}
            onVerifyPress={handleVerifyPress}
            submittingId={submittingId}
            theme={theme}
          />



          {/* 4. 월간 활동 현황 Calendar Card (Expands smoothly to show details inline) */}
          <MonthlyCalendarCard
            glassCardStyle={glassCardStyle}
            theme={theme}
            selectedMonthString={selectedMonthString}
            selectedDayDetail={selectedDayDetail}
            selectedDayMissions={selectedDayMissions}
            loadingDayMissions={loadingDayMissions}
            monthData={monthData}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onGoToToday={handleGoToToday}
            onDayPress={handleDayPress}
            onCloseDayDetail={closeDayDetail}
          />

          {/* 5. 총 완료 미션 갯수 Graph Card */}
          <SummaryGraphCard
            weeklyStats={weeklyStats}
            summaryStats={summaryStats}
            glassCardStyle={glassCardStyle}
            theme={theme}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
