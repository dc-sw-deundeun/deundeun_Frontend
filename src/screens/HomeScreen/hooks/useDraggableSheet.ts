import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

// 오늘의 미션 바텀시트를 드래그로 펼치고 접는 제스처를 담당하는 훅
export const useDraggableSheet = () => {
  const sheetY = useRef(new Animated.Value(0)).current;
  const lastSheetY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        sheetY.setOffset(lastSheetY.current);
        sheetY.setValue(0);
      },
      onPanResponderMove: (e, gestureState) => {
        const nextY = gestureState.dy;
        const totalY = lastSheetY.current + nextY;
        if (totalY < 0) {
          sheetY.setValue(-lastSheetY.current);
        } else if (totalY > 260) {
          sheetY.setValue(260 - lastSheetY.current);
        } else {
          sheetY.setValue(nextY);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        sheetY.flattenOffset();
        const currentY = (sheetY as any)._value;
        let targetY = 0;
        if (currentY > 130) {
          targetY = 260;
        }

        Animated.spring(sheetY, {
          toValue: targetY,
          useNativeDriver: true,
          tension: 40,
          friction: 6,
        }).start(() => {
          lastSheetY.current = targetY;
        });
      },
    })
  ).current;

  return { sheetY, panResponder };
};

export default useDraggableSheet;
