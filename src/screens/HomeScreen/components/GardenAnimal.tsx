import React, { useState, useRef, useEffect } from 'react';
import { Animated, PanResponder, Platform, Pressable, Image } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../HomeScreen.styles';
import { GardenAnimalProps } from '../types';
import { ANIMAL_ACTIVE_IMAGES, ANIMAL_INACTIVE_IMAGES, mapAnimalCodeToAssetKey } from '../constants';

// 모든 정원 동물 캐릭터들을 동적으로 렌더링하고 랜덤하게 통통 움직이게 하는 컴포넌트
export const GardenAnimal = ({ gardenLayout, initialX, initialY, animalCode }: GardenAnimalProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const currentPosition = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });

  // 사용자가 드래그해서 옮겨놓은 자리를 새로운 이동의 중심점으로 유지하는 레프
  const basePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const xId = pan.x.addListener((v) => {
      currentPosition.current.x = v.value;
    });
    const yId = pan.y.addListener((v) => {
      currentPosition.current.y = v.value;
    });
    return () => {
      pan.x.removeListener(xId);
      pan.y.removeListener(yId);
    };
  }, [pan]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      const timeout = setTimeout(() => {
        setIsBlinking(false);
      }, 500);
      return () => clearTimeout(timeout);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 통통 랜덤하게 움직이는 효과
  useEffect(() => {
    let active = true;

    const startRandomMovement = () => {
      if (!active || isDragging) return;

      // 드래그된 basePosition 기준 상하좌우 최대 40px 범위 내 랜덤 절대 목적지 계산
      let absTargetX = initialX + basePosition.current.x + (Math.random() - 0.5) * 80;
      let absTargetY = initialY + basePosition.current.y + (Math.random() - 0.5) * 80;

      // 정원 경계 및 오늘의 미션 바텀시트 영역(height - 180)과 겹치지 않게 제한
      if (gardenLayout.width > 0 && gardenLayout.height > 0) {
        absTargetX = Math.max(0, Math.min(gardenLayout.width - 60, absTargetX));
        absTargetY = Math.max(0, Math.min(gardenLayout.height - 180, absTargetY));
      }

      // 상대적인 x, y 값으로 변환하여 애니메이션 처리
      const targetX = absTargetX - initialX;
      const targetY = absTargetY - initialY;

      Animated.spring(pan, {
        toValue: { x: targetX, y: targetY },
        tension: 1.2,   // 움직임 속도를 아주 느리고 부드럽게 설정
        friction: 12,   // 마찰력을 높여 통통 튀는 반동 wobbly 현상을 극도로 억제
        useNativeDriver: true,
      }).start(() => {
        if (!active) return;
        // 이동 완료 후 5~10초간 느긋하게 대기 후 다시 이동
        setTimeout(() => {
          startRandomMovement();
        }, 5000 + Math.random() * 5000);
      });
    };

    const startTimeout = setTimeout(() => {
      startRandomMovement();
    }, 1500 + Math.random() * 2000);

    return () => {
      active = false;
      clearTimeout(startTimeout);
      pan.stopAnimation();
    };
  }, [isDragging, gardenLayout]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.stopAnimation();
        startPosition.current = {
          x: currentPosition.current.x,
          y: currentPosition.current.y,
        };
        pan.setOffset({ x: startPosition.current.x, y: startPosition.current.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        let targetX = startPosition.current.x + gestureState.dx;
        let targetY = startPosition.current.y + gestureState.dy;

        // 드래그할 때도 오늘의 미션 시트와 겹치지 않게 가든 영역(height - 180) 밖으로 나가지 못하게 제한
        if (gardenLayout.width > 0 && gardenLayout.height > 0) {
          targetX = Math.max(0, Math.min(gardenLayout.width - 60, targetX + initialX)) - initialX;
          targetY = Math.max(0, Math.min(gardenLayout.height - 180, targetY + initialY)) - initialY;
        }

        const nextX = targetX - startPosition.current.x;
        const nextY = targetY - startPosition.current.y;

        pan.setValue({ x: nextX, y: nextY });
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        pan.flattenOffset();

        // 드래그 완료 후 손을 놓은 자리를 새로운 랜덤 배회의 중심 스폰지로 갱신
        basePosition.current = {
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        };
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        pan.flattenOffset();
      },
    })
  ).current;

  const showActive = isHovered || isBlinking || isDragging;
  const assetKey = mapAnimalCodeToAssetKey(animalCode);
  const activeImage = ANIMAL_ACTIVE_IMAGES[assetKey];
  const inactiveImage = ANIMAL_INACTIVE_IMAGES[assetKey];
  const imageSource = showActive ? activeImage : inactiveImage;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.frogContainer,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: showActive ? 1.15 : 1 }
          ],
          ...Platform.select({
            web: {
              cursor: isDragging ? 'grabbing' : 'grab',
            }
          }) as any
        }
      ]}
    >
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.frog}
          />
        ) : (
          <Text style={{ fontSize: 32 }}>🐾</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default GardenAnimal;
