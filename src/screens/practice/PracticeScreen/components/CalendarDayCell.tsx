import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, View } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../PracticeScreen.styles';

interface CalendarDayCellProps {
  day: number;
  completedCount: number;
  isSelected: boolean;
  theme: any;
  onPress: (day: number) => void;
}

// 캘린더 날짜 셀 - 호버/선택 시 float + spring 애니메이션 적용
export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ day, completedCount, isSelected, theme, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Animation values
  const animScale = useRef(new Animated.Value(1)).current;
  const animTranslate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const active = isHovered || isSelected;
    Animated.parallel([
      Animated.spring(animScale, {
        toValue: active ? 1.15 : 1.0,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(animTranslate, {
        toValue: active ? -4 : 0,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isHovered, isSelected]);

  return (
    <Pressable
      onPress={() => onPress(day)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={styles.calendarCellWrapper}
    >
      <Animated.View
        style={{
          transform: [
            { scale: animScale },
            { translateY: animTranslate },
          ],
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {completedCount === 3 ? (
          <View style={[styles.circleRing, { borderColor: '#5B744C' }]}>
            <View style={[styles.circleFilled, { backgroundColor: '#5B744C' }]}>
              <Text style={styles.calendarCellTextWhite}>{day}</Text>
            </View>
          </View>
        ) : completedCount === 2 ? (
          <View style={[styles.circleFilled, { backgroundColor: '#A6C89B' }]}>
            <Text style={[styles.calendarCellTextGreen, { color: '#3F583B' }]}>{day}</Text>
          </View>
        ) : completedCount === 1 ? (
          <View style={[styles.circleFilled, { backgroundColor: '#CDE3C2' }]}>
            <Text style={[styles.calendarCellTextGreen, { color: '#3F583B' }]}>{day}</Text>
          </View>
        ) : (
          <View style={styles.circleEmpty}>
            <Text style={[styles.calendarCellTextDefault, { color: theme.text }]}>{day}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default CalendarDayCell;
