import { useRef } from 'react';
import { Animated, PanResponder, Easing } from 'react-native';

// 오늘의 미션 바텀시트를 드래그로 펼치고 접는 제스처를 담당하는 훅
export const useDraggableSheet = () => {
  // 0: 완전 펼침 (높이 650), 270: 중간 펼침 (높이 380), 460: 완전히 닫힘 (오늘의 미션 글씨만 보임)
  const sheetY = useRef(new Animated.Value(270)).current;
  const lastSheetY = useRef(270);

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
        } else if (totalY > 460) {
          sheetY.setValue(460 - lastSheetY.current);
        } else {
          sheetY.setValue(nextY);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        sheetY.flattenOffset();
        const currentY = (sheetY as any)._value;
        const vy = gestureState.vy;
        let targetY = currentY;

        // 클릭(탭) 이벤트로 인식될 경우 상태를 유지하여 쏙 내려가는 현상 방지
        if (Math.abs(gestureState.dy) < 5) {
          targetY = lastSheetY.current;
        } else {
          const isFlickUp = vy < -0.5;
          const isFlickDown = vy > 0.5;

          if (isFlickUp) {
            if (lastSheetY.current === 460) targetY = 270;
            else targetY = 0;
          } else if (isFlickDown) {
            if (lastSheetY.current === 0) targetY = 270;
            else targetY = 460;
          } else {
            // 가장 가까운 스냅 포인트 찾기
            const dist0 = Math.abs(currentY - 0);
            const dist270 = Math.abs(currentY - 270);
            const dist460 = Math.abs(currentY - 460);

            if (dist0 < dist270 && dist0 < dist460) targetY = 0;
            else if (dist270 < dist0 && dist270 < dist460) targetY = 270;
            else targetY = 460;
          }
        }

        // 통통 튀는 스프링 효과를 없애고 부드러운 타이밍 애니메이션으로 변경
        Animated.timing(sheetY, {
          toValue: targetY,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          lastSheetY.current = targetY;
        });
      },
    })
  ).current;

  return { sheetY, panResponder };
};

export default useDraggableSheet;
