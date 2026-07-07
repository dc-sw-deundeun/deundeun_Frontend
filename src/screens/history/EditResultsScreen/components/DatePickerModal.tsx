import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { styles } from '../EditResultsScreen.styles';
import { MONTHS, DAYS } from '../constants';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  calYear: number;
  calMonth: number;
  calDays: (number | null)[];
  selectedDay: number | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDaySelect: (day: number) => void;
  theme: { text: string; textMuted: string; border: string; card: string };
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  calYear,
  calMonth,
  calDays,
  selectedDay,
  onPrevMonth,
  onNextMonth,
  onDaySelect,
  theme,
}) => {
  const today = new Date();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.calOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <Card style={[styles.calCard, { backgroundColor: theme.card }]} radius={24}>
            {/* Month Navigation */}
            <View style={styles.calHeader}>
              <TouchableOpacity onPress={onPrevMonth} style={styles.calNavBtn}>
                <ChevronLeft size={22} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.calTitle, { color: theme.text }]}>
                {calYear}년 {MONTHS[calMonth]}
              </Text>
              <TouchableOpacity onPress={onNextMonth} style={styles.calNavBtn}>
                <ChevronRight size={22} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Day Headers */}
            <View style={styles.calDayRow}>
              {DAYS.map((d, i) => (
                <Text
                  key={d}
                  style={[
                    styles.calDayName,
                    { color: i === 0 ? COLORS.error : i === 6 ? COLORS.primary : theme.textMuted },
                  ]}
                >
                  {d}
                </Text>
              ))}
            </View>

            {/* Day Grid */}
            <View style={styles.calGrid}>
              {calDays.map((day, i) => {
                const isSelected = day !== null && day === selectedDay;
                const isToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();
                const isSunday = i % 7 === 0;
                const isSaturday = i % 7 === 6;

                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.calCell,
                      isSelected && { backgroundColor: COLORS.primary },
                      isToday && !isSelected && { borderWidth: 1.5, borderColor: COLORS.primary },
                    ]}
                    onPress={() => day && onDaySelect(day)}
                    disabled={!day}
                  >
                    {day !== null && (
                      <Text
                        style={[
                          styles.calCellText,
                          {
                            color: isSelected
                              ? '#ffffff'
                              : isSunday
                                ? COLORS.error
                                : isSaturday
                                  ? COLORS.primary
                                  : theme.text,
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.calCancelBtn, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.calCancelText, { color: theme.textMuted }]}>취소</Text>
            </TouchableOpacity>
          </Card>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DatePickerModal;
