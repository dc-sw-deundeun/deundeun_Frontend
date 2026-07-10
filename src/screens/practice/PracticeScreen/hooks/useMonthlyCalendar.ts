import { useState, useRef, useEffect } from 'react';
import { ScrollView, LayoutAnimation } from 'react-native';
import { missionApi } from '@/api';
import { CalendarDay } from '@/api/mission';
import { DailyMission } from '../types';

export const useMonthlyCalendar = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  
  const [selectedDayDetail, setSelectedDayDetail] = useState<{ day: number; year: number; month: number } | null>(null);
  const [selectedDayMissions, setSelectedDayMissions] = useState<DailyMission[]>([]);
  const [loadingDayMissions, setLoadingDayMissions] = useState(false);

  useEffect(() => {
    loadCalendarData();
  }, [currentYear, currentMonth]);

  const loadCalendarData = async () => {
    try {
      const res = await missionApi.getMissionCalendar(currentYear, currentMonth);
      if (res.success && res.data) {
        setCalendarDays(res.data.days);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrevMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDayDetail(null);
  };

  const handleNextMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDayDetail(null);
  };

  const fetchMissionsForDate = async (year: number, month: number, day: number) => {
    setLoadingDayMissions(true);
    try {
      const targetDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const res = await missionApi.getMissionsByDate(targetDate);
      if (res.success && res.data) {
        const mapped = res.data.items.map(item => ({
          id: item.mission_id,
          title: item.title,
          category: item.rationale || item.category || '오늘의 건강 실천',
          completed: item.status === 'COMPLETED',
          xp: item.xp_reward,
          missionType: item.category || item.mission_type || 'activity',
        }));
        setSelectedDayMissions(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDayMissions(false);
    }
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 350);
  };

  const handleGoToToday = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const now = new Date();
    const tYear = now.getFullYear();
    const tMonth = now.getMonth() + 1;
    const tDay = now.getDate();

    setCurrentYear(tYear);
    setCurrentMonth(tMonth);
    setSelectedDayDetail({ day: tDay, year: tYear, month: tMonth });
    await fetchMissionsForDate(tYear, tMonth, tDay);
  };

  const handleDayPress = async (day: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (selectedDayDetail && selectedDayDetail.day === day && selectedDayDetail.month === currentMonth) {
      setSelectedDayDetail(null);
    } else {
      setSelectedDayDetail({ day, year: currentYear, month: currentMonth });
      await fetchMissionsForDate(currentYear, currentMonth, day);
    }
  };

  const closeDayDetail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDayDetail(null);
  };

  const getMonthData = () => {
    // calculate offset (0 for Sunday, 1 for Monday...)
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const offset = firstDay;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const levels: Record<number, number> = {};
    calendarDays.forEach(d => {
      const day = parseInt(d.date.split('-')[2], 10);
      if (d.total === 0) {
        levels[day] = 0; // No mission
      } else if (d.completed === 0) {
        levels[day] = 1; // Gray
      } else if (d.completed < d.total) {
        levels[day] = 2; // Light green
      } else {
        levels[day] = 3; // Dark green
      }
    });

    return { offset, days: daysInMonth, levels, rawDays: calendarDays };
  };

  const monthData = getMonthData();
  const selectedMonthString = `${currentYear}년 ${currentMonth}월`;

  return {
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
  };
};

export default useMonthlyCalendar;
