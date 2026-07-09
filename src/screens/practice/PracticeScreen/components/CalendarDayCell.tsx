import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../PracticeScreen.styles';

interface CalendarDayCellProps {
  day: number;
  level: number;
  isSelected: boolean;
  theme: any;
  onPress: (day: number) => void;
}

// 캘린더 날짜 셀 - 호버/선택 시 float + spring 애니메이션 적용
export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ day, level, isSelected, theme, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Animation values
  const animScale = useRef(new Animated.Value(1)).current;
  const animTranslate = useRef(new Animated.Value(0)).current;
  const animRotate = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (isSelected) {
      Animated.loop(
        Animated.timing(animRotate, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      animRotate.stopAnimation();
      animRotate.setValue(0);
    }
  }, [isSelected]);

  const spin = animRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
        {isSelected && (
          <Animated.View
            style={{
              position: 'absolute',
              width: 38,
              height: 38,
              borderRadius: 19,
              borderWidth: 1.5,
              borderColor: '#5B744C',
              borderStyle: 'dashed',
              transform: [{ rotate: spin }],
            }}
          />
        )}

        {level === 3 ? (
          <View style={[styles.circleFilled, { backgroundColor: '#5B744C' }]}>
            <Text style={styles.calendarCellTextWhite}>{day}</Text>
          </View>
        ) : level === 2 ? (
          <View style={[styles.circleFilled, { backgroundColor: '#A6C89B' }]}>
            <Text style={[styles.calendarCellTextGreen, { color: '#3F583B' }]}>{day}</Text>
          </View>
        ) : level === 1 ? (
          <View style={[styles.circleFilled, { backgroundColor: '#EAEAEA' }]}>
            <Text style={[styles.calendarCellTextDefault, { color: '#999999' }]}>{day}</Text>
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
