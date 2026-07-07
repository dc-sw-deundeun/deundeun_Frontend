import { useState } from 'react';

const getDaysInMonth = (year: number, month: number) => {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= numberOfDays; i++) {
    days.push(i);
  }
  return days;
};

// 검진일 선택용 달력 모달 상태를 담당하는 훅
export const useCalendarPicker = (onDaySelected: (dateStr: string) => void) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calYear, setCalYear] = useState(2023);
  const [calMonth, setCalMonth] = useState(9); // October
  const [selectedDay, setSelectedDay] = useState<number | null>(27);

  const calDays = getDaysInMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const mStr = String(calMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onDaySelected(`${calYear}-${mStr}-${dStr}`);
    setShowDatePicker(false);
  };

  return {
    showDatePicker,
    setShowDatePicker,
    calYear,
    calMonth,
    selectedDay,
    calDays,
    prevMonth,
    nextMonth,
    handleDaySelect,
  };
};

export default useCalendarPicker;
