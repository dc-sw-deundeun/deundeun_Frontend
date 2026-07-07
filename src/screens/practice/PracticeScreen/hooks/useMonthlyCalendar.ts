import { useState, useRef } from 'react';
import { ScrollView, LayoutAnimation } from 'react-native';

// 월간 활동 캘린더의 월 전환 및 날짜 상세 토글을 담당하는 훅
export const useMonthlyCalendar = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedMonth, setSelectedMonth] = useState<'2024년 5월' | '2024년 4월'>('2024년 5월');
  const [selectedDayDetail, setSelectedDayDetail] = useState<{ day: number; month: string } | null>(null);

  const handlePrevMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMonth('2024년 4월');
    setSelectedDayDetail(null); // Clear selected day detail on month change
  };

  const handleNextMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMonth('2024년 5월');
    setSelectedDayDetail(null); // Clear selected day detail on month change
  };

  // Get Calendar details based on selected month
  const getMonthData = () => {
    if (selectedMonth === '2024년 5월') {
      return {
        offset: 3, // Wednesday start
        days: 31,
        counts: {
          1: 1, // light green
          2: 2, // medium green
          3: 3, // dark green with outline
          4: 1, // light green
          5: 3, // dark green with outline
        } as Record<number, number>,
      };
    } else {
      return {
        offset: 1, // Monday start
        days: 30,
        counts: {
          8: 1,
          9: 2,
          10: 3,
          11: 2,
          12: 1,
          15: 3,
          16: 2,
          22: 3,
        } as Record<number, number>,
      };
    }
  };

  const monthData = getMonthData();

  const handleDayPress = (day: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (selectedDayDetail && selectedDayDetail.day === day && selectedDayDetail.month === selectedMonth) {
      setSelectedDayDetail(null); // Toggle collapse
    } else {
      setSelectedDayDetail({ day, month: selectedMonth }); // Expand selected day

      // Auto-scroll ScrollView to bottom so expanded detail view is visible
      // Increased timeout to 350ms to ensure LayoutAnimation has finished expanding the layout
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 350);
    }
  };

  const closeDayDetail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDayDetail(null);
  };

  return {
    scrollViewRef,
    selectedMonth,
    selectedDayDetail,
    monthData,
    getMonthData,
    handlePrevMonth,
    handleNextMonth,
    handleDayPress,
    closeDayDetail,
  };
};

export default useMonthlyCalendar;
