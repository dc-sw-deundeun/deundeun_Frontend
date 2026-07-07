import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, PanResponder, Alert, Platform, Image, Pressable } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Check, Leaf } from 'lucide-react-native';
import { homeApi, missionApi } from '@/api';

// Navigation types
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface Mission {
  id: number;
  title: string;
  points: number;
  completed: boolean;
  emoji: string;
}

interface AnimalCharacter {
  id: string;
  animalCode: string;
  emoji: string;
  level: number | null; // null means no level tag displayed
  posX: number;
  posY: number;
}

interface GardenAnimalProps {
  gardenLayout: { width: number; height: number };
  initialX: number;
  initialY: number;
  animalCode: string;
}

// 모든 정원 동물 캐릭터들을 동적으로 렌더링하고 랜덤하게 통통 움직이게 하는 컴포넌트
const GardenAnimal = ({ gardenLayout, initialX, initialY, animalCode }: GardenAnimalProps) => {
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

// 각 동물의 목장 내 배치 위치 좌표 및 이모지 정의
const ANIMAL_COORDINATES: Record<string, { posX: number; posY: number; emoji: string }> = {
  frog: { posX: 50, posY: 110, emoji: '🐸' },
  cat: { posX: 260, posY: 90, emoji: '🐱' },
  bear: { posX: 140, posY: 170, emoji: '🐻' },
  chick: { posX: 60, posY: 220, emoji: '🐥' },
  dog: { posX: 260, posY: 200, emoji: '🐶' },
  mon: { posX: 190, posY: 240, emoji: '🐵' },
  pan: { posX: 120, posY: 80, emoji: '🐼' },
  tig: { posX: 180, posY: 130, emoji: '🐯' },
};

// 정적 에셋 로드 require 맵 (해금 연출 및 동물 매핑용)
const ANIMAL_INACTIVE_IMAGES: Record<string, any> = {
  frog: require('../assets/animal/frog1.png'),
  chick: require('../assets/animal/chick1.png'),
  pan: require('../assets/animal/pan1.png'), // penguin
  dog: require('../assets/animal/dog1.png'),
  cat: require('../assets/animal/cat1.png'),
  tig: require('../assets/animal/tig1.png'), // tiger
  bear: require('../assets/animal/bear1.png'), // panda
  mon: require('../assets/animal/mon1.png'), // monkey
};

const ANIMAL_ACTIVE_IMAGES: Record<string, any> = {
  frog: require('../assets/animal/frog2.png'),
  chick: require('../assets/animal/chick2.png'),
  pan: require('../assets/animal/pan2.png'), // penguin
  dog: require('../assets/animal/dog2.png'),
  cat: require('../assets/animal/cat2.png'),
  tig: require('../assets/animal/tig2.png'), // tiger
  bear: require('../assets/animal/bear2.png'), // panda
  mon: require('../assets/animal/mon2.png'), // monkey
};

// 백엔드 동물 코드를 에셋 매핑 키로 변환
const mapAnimalCodeToAssetKey = (code: string): string => {
  switch (code) {
    case 'penguin':
      return 'pan';
    case 'tiger':
      return 'tig';
    case 'panda':
      return 'bear';
    case 'monkey':
      return 'mon';
    default:
      return code; // 'frog', 'chick', 'dog', 'cat'
  }
};

const ANIMAL_NAMES: Record<string, string> = {
  frog: '개구리',
  chick: '병아리',
  penguin: '펭귄',
  dog: '강아지',
  cat: '고양이',
  tiger: '호랑이',
  panda: '판다',
  monkey: '원숭이',
};

const getRevealImage = (code: string) => {
  const assetKey = mapAnimalCodeToAssetKey(code);
  return ANIMAL_INACTIVE_IMAGES[assetKey] || require('../assets/animal/frog1.png');
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { isDarkMode } = useAppStore();

  const theme = {
    background: '#A6D7A8', // Pastel grass green
    cardBg: '#F5F4EE',    // Cream off-white card background
    textDark: '#1C2E21',  // Deep forest dark green text
    textMuted: '#7A8C7C', // Muted sage text
    border: '#E2E1D8',
  };

  // Streak & Points State
  const [streakDays, setStreakDays] = useState(27);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  // Today's Missions
  const [missions, setMissions] = useState<Mission[]>([]);

  // Floating animal characters positioning
  const [characters, setCharacters] = useState<AnimalCharacter[]>([]);

  // Verification Modal states
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState<number | null>(null);

  // Level Up Modal states
  const [isLevelUpVisible, setIsLevelUpVisible] = useState(false);
  const [levelUpAnimal, setLevelUpAnimal] = useState<string>('곰');

  // Garden container layout size to bound the frog drag
  const [gardenLayout, setGardenLayout] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);

  // Store previously loaded animal codes to detect new unlocks (diff)
  const [ownedAnimalCodes, setOwnedAnimalCodes] = useState<string[] | null>(null);

  // Unlock Modal Queue State
  const [unlockQueue, setUnlockQueue] = useState<string[]>([]);
  const [currentRevealAnimal, setCurrentRevealAnimal] = useState<string | null>('penguin');
  const [revealStep, setRevealStep] = useState<'idle' | 'shaking' | 'revealed'>('idle');

  // Animation values for Reveal
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // Loop wiggle animation values
  const idleWiggleAnim = useRef(new Animated.Value(0)).current;
  const wiggleLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // 선물 상자 대기 상태(idle)일 때 자동으로 부들부들 떠는 애니메이션 실행
  useEffect(() => {
    if (currentRevealAnimal !== null && revealStep === 'idle') {
      idleWiggleAnim.setValue(0);
      wiggleLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(idleWiggleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: 0, duration: 800, useNativeDriver: true }), // 쉬는 구간
        ])
      );
      wiggleLoopRef.current.start();
    } else {
      if (wiggleLoopRef.current) {
        wiggleLoopRef.current.stop();
      }
      idleWiggleAnim.setValue(0);
    }
    return () => {
      if (wiggleLoopRef.current) {
        wiggleLoopRef.current.stop();
      }
    };
  }, [currentRevealAnimal, revealStep]);

  // Shake animation sequence: left, right, left, right, center
  const startShake = () => {
    if (wiggleLoopRef.current) {
      wiggleLoopRef.current.stop();
    }
    idleWiggleAnim.setValue(0);

    setRevealStep('shaking');
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => {
      triggerReveal();
    });
  };

  // Fade in and scale up the animal sprite
  const triggerReveal = () => {
    setRevealStep('revealed');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const triggerUnlockReveal = (newlyUnlocked: string[]) => {
    const first = newlyUnlocked[0];
    const rest = newlyUnlocked.slice(1);
    setUnlockQueue(rest);
    setCurrentRevealAnimal(first);
    setRevealStep('idle');
  };

  const handleConfirmReveal = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    shakeAnim.setValue(0);

    if (unlockQueue.length > 0) {
      const nextAnimal = unlockQueue[0];
      setUnlockQueue(unlockQueue.slice(1));
      setCurrentRevealAnimal(nextAnimal);
      setRevealStep('idle');
    } else {
      setCurrentRevealAnimal(null);
      setRevealStep('idle');
    }
  };

  const interpolatedWiggle = idleWiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-4deg', '4deg'],
  });

  const interpolatedShake = shakeAnim.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  const shakeStyle = {
    transform: [
      { rotate: interpolatedWiggle },
      { rotate: interpolatedShake }
    ],
  };

  // 홈 화면 데이터 로드
  const loadHomeData = async () => {
    try {
      setLoading(true);
      const res = await homeApi.getHome();
      if (res.success && res.data) {
        const { character, today_missions } = res.data;

        // 경험치 및 레벨 설정 (current_level_exp를 나뭇잎 옆 포인트 값으로 매핑)
        setTotalPoints(character.current_level_exp);
        setUserLevel(character.level);

        // 오늘 미션 목록 매핑
        const mappedMissions = today_missions.items.map((item) => {
          let emoji = '🌿';
          if (item.template_code === 'DEFAULT_SELF_CHECK') {
            emoji = '🩺';
          } else if (item.category === 'FOOD' || item.category === 'DIET') {
            emoji = '🥗';
          } else if (item.category === 'EXERCISE' || item.category === 'ACTIVITY') {
            emoji = '🏃';
          }
          return {
            id: item.mission_id,
            title: item.title,
            points: item.xp_reward,
            completed: item.status === 'COMPLETED',
            emoji,
          };
        });
        setMissions(mappedMissions);

        // 보유 중인 캐릭터 동적 좌표 매핑 (최대 3마리 제한)
        const animalCounts: Record<string, number> = {};
        const mappedCharacters: any[] = [];

        character.owned_animals.forEach((animal, idx) => {
          const code = animal.animal_code;
          const count = (animalCounts[code] || 0) + 1;
          animalCounts[code] = count;

          if (count <= 3) {
            // 백엔드 동물 코드를 원래 좌표 키(bear, pan, tig, mon)로 매핑
            let coordKey = code;
            if (coordKey === 'panda') coordKey = 'bear';
            if (coordKey === 'penguin') coordKey = 'pan';
            if (coordKey === 'tiger') coordKey = 'tig';
            if (coordKey === 'monkey') coordKey = 'mon';

            const coord = ANIMAL_COORDINATES[coordKey] || { posX: 50 + (idx * 30), posY: 100 + (idx * 20), emoji: '🐾' };

            // 중복 동물일 경우 스폰 위치에 가로 35px 오프셋을 부여하여 겹침 방지
            const spawnOffset = (count - 1) * 35;

            mappedCharacters.push({
              id: `${code}_${count}`,
              animalCode: code,
              emoji: coord.emoji,
              level: null, // 레벨 라벨은 제거됨
              posX: coord.posX + spawnOffset,
              posY: coord.posY + (count > 1 ? 15 : 0),
            });
          }
        });
        setCharacters(mappedCharacters);

        // 이전 소유 동물 목록과 비교해 신규 해금 동물(Diff) 감지
        const currentAnimalCodes = character.owned_animals.map(a => a.animal_code);
        if (ownedAnimalCodes === null) {
          // 최초 로드 시에는 애니메이션 연출을 트리거하지 않고 상태만 동기화
          setOwnedAnimalCodes(currentAnimalCodes);
        } else {
          const newlyUnlocked = currentAnimalCodes.filter(code => !ownedAnimalCodes.includes(code));
          setOwnedAnimalCodes(currentAnimalCodes);
          if (newlyUnlocked.length > 0) {
            triggerUnlockReveal(newlyUnlocked);
          }
        }
      }
    } catch (error) {
      console.error('홈 화면 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 화면 포커스 시 실시간 홈 데이터 갱신
  useFocusEffect(
    React.useCallback(() => {
      loadHomeData();
    }, [])
  );

  // Glass styles
  const glassSheetStyle = {
    backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.55)' : 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.75)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.12 : 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  };

  const glassModalCardStyle = {
    backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.85)' : 'rgba(255, 255, 255, 0.75)',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.75)',
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.15 : 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  };

  // Draggable bottom sheet animation values
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

  const completedCount = missions.filter((m) => m.completed).length;

  const handleToggleMission = (id: number) => {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;

    if (mission.completed) {
      Alert.alert('알림', '이미 완료된 미션입니다.');
    } else {
      setActiveMissionId(id);
      setIsVerifyModalVisible(true);
    }
  };

  const handleCompleteVerification = async () => {
    if (activeMissionId !== null) {
      try {
        setLoading(true);
        // 서버에 미션 완료 요청 전송
        await missionApi.completeMission(activeMissionId);
        setIsVerifyModalVisible(false);
        Alert.alert('미션 인증 완료', '미션 인증이 완료되어 포인트(XP)가 지급되었습니다!');

        // 홈 데이터 리로드하여 실시간으로 포인트 및 동물 성장 상태 반영
        await loadHomeData();
      } catch (error) {
        console.error('미션 완료 처리 실패:', error);
        Alert.alert('오류', '미션 완료 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/splash_Icon.png')}
            style={styles.logoImage}
          />
          <Text style={[styles.logoText, { color: theme.textDark }]}>든든</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Points badge */}
          <View style={[styles.pointsBadge, { backgroundColor: '#2E5E35', gap: 6, paddingHorizontal: 10 }]}>
            <Leaf color="#ffffff" size={14} fill="#ffffff" />
            <Text style={[styles.badgeText, { color: '#ffffff' }]}>{totalPoints}</Text>
          </View>
        </View>
      </View>

      {/* Main Garden Area */}
      <View
        style={styles.gardenArea}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setGardenLayout({ width, height });
        }}
      >
        {/* Scattered mushrooms */}
        <Text style={[styles.mushroomDeco, { top: 50, left: 40 }]}>🍄</Text>
        <Text style={[styles.mushroomDeco, { top: 40, left: 220 }]}>🍄</Text>

        {/* Floating Animals */}
        {characters.map((char) => (
          <View
            key={char.id}
            style={[
              styles.animalNode,
              {
                left: char.posX,
                top: char.posY,
              },
            ]}
          >
            <View style={styles.emojiWrapper}>
              <GardenAnimal
                gardenLayout={gardenLayout}
                initialX={char.posX}
                initialY={char.posY}
                animalCode={char.animalCode}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Sheet Card */}
      <Animated.View
        style={[
          styles.bottomSheet,
          glassSheetStyle,
          {
            transform: [{ translateY: sheetY }],
          },
        ]}
      >
        {/* Drag handle line indicator & Drag Area */}
        <View {...panResponder.panHandlers} style={styles.sheetHeaderZone}>
          <View style={[styles.dragHandle, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]} />
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>오늘의 미션</Text>
            <Text style={[styles.sheetProgress, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>
              {completedCount}/{missions.length}
            </Text>
          </View>
        </View>

        {/* Mission Rows */}
        <ScrollView style={styles.missionScroll} showsVerticalScrollIndicator={false}>
          {missions.map((mission) => (
            <TouchableOpacity
              key={mission.id}
              style={[
                styles.missionRow,
                {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.border,
                },
              ]}
              onPress={() => handleToggleMission(mission.id)}
              activeOpacity={0.7}
            >
              <View style={styles.missionLeft}>
                {/* Icon wrapper circular background */}
                <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? 'rgba(228, 242, 230, 0.15)' : '#E4F2E6' }]}>
                  <Text style={styles.iconEmoji}>{mission.emoji}</Text>
                </View>
                <Text
                  style={[
                    styles.missionTitleText,
                    { color: isDarkMode ? '#FFFFFF' : theme.textDark },
                    mission.completed && styles.lineThrough,
                  ]}
                >
                  {mission.title}
                </Text>
              </View>

              <View style={styles.missionRight}>
                <Text style={[styles.pointsText, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>
                  +{mission.points}
                </Text>

                {/* Checkbox indicator */}
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#D3D2CC' },
                    mission.completed && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                  ]}
                >
                  {mission.completed && <Check color="#ffffff" size={14} strokeWidth={3} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Verification bottom sheet modal */}
      <Modal
        visible={isVerifyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVerifyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalInnerContainer}>
            {/* Options card */}
            <View style={[styles.modalOptionsCard, glassModalCardStyle]}>
              <Text style={[styles.modalTitleText, { color: isDarkMode ? '#C7C6BE' : '#8F8E84' }]}>무엇을 추가할까요?</Text>

              {/* Option 1: Camera */}
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={handleCompleteVerification}
              >
                <View style={[styles.modalIconWrapper, { backgroundColor: isDarkMode ? 'rgba(235, 242, 232, 0.15)' : '#EBF2E8' }]}>
                  <Text style={{ fontSize: 20 }}>📸</Text>
                </View>
                <View style={styles.modalTextGroup}>
                  <Text style={[styles.modalOptionTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>검진 결과지 촬영</Text>
                  <Text style={[styles.modalOptionDesc, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>사진을 찍으면 수치를 자동 인식해요</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.modalDivider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : theme.border }]} />

              {/* Option 2: Pencil */}
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={handleCompleteVerification}
              >
                <View style={[styles.modalIconWrapper, { backgroundColor: isDarkMode ? 'rgba(252, 243, 230, 0.15)' : '#FCF3E6' }]}>
                  <Text style={{ fontSize: 20 }}>✍️</Text>
                </View>
                <View style={styles.modalTextGroup}>
                  <Text style={[styles.modalOptionTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>직접 입력하기</Text>
                  <Text style={[styles.modalOptionDesc, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>수치를 손으로 입력할게요</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.modalDivider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : theme.border }]} />

              {/* Option 3: Image */}
              <TouchableOpacity
                style={styles.modalOptionRow}
                onPress={handleCompleteVerification}
              >
                <View style={[styles.modalIconWrapper, { backgroundColor: isDarkMode ? 'rgba(238, 244, 250, 0.15)' : '#EEF4FA' }]}>
                  <Text style={{ fontSize: 20 }}>📄</Text>
                </View>
                <View style={styles.modalTextGroup}>
                  <Text style={[styles.modalOptionTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>이미지 불러오기</Text>
                  <Text style={[styles.modalOptionDesc, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>저장된 스캔 파일에서 가져와요</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Cancel Card */}
            <TouchableOpacity
              style={[styles.modalCancelCard, glassModalCardStyle]}
              onPress={() => setIsVerifyModalVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: isDarkMode ? '#FFFFFF' : '#8F8E84' }]}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Level Up Celebration Modal */}
      <Modal
        visible={isLevelUpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLevelUpVisible(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={[styles.levelUpDialog, { backgroundColor: '#ffffff' }]}>
            <View style={styles.levelUpStars}>
              <Trophy color="#EF6C00" size={48} fill="#EF6C00" />
            </View>

            <Text style={[styles.levelUpBadge, { color: COLORS.primary }]}>LEVEL UP! ✦</Text>
            <Text style={[styles.levelUpTitle, { color: theme.textDark }]}>
              {levelUpAnimal}이가 자랐어요!
            </Text>

            <View style={styles.levelUpProgressRow}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.textMuted }}>Lv 33</Text>
              <Text style={{ fontSize: 20, color: COLORS.primary }}>➔</Text>
              <View style={[styles.levelNewBadge, { backgroundColor: COLORS.primaryLight }]}>
                <Text style={{ color: COLORS.primaryDark, fontWeight: '800', fontSize: 16 }}>Lv 34</Text>
              </View>
            </View>

            <Text style={[styles.levelUpMessage, { color: theme.textMuted }]}>
              오늘의 미션을 모두 완료하여{"\n"}든든이의 성장이 빨라졌습니다!
            </Text>

            <TouchableOpacity
              style={[styles.levelUpCloseBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => {
                setIsLevelUpVisible(false);
                // Reset missions for replayability
                setMissions(missions.map((m) => ({ ...m, completed: false })));
              }}
            >
              <Text style={styles.levelUpCloseBtnText}>정원으로 돌아가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Animal Unlock Reveal Modal */}
      <Modal
        visible={currentRevealAnimal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setCurrentRevealAnimal(null)}
      >
        <View style={styles.revealModalOverlay}>
          <View style={styles.revealModalContainer}>
            {revealStep !== 'revealed' ? (
              <Pressable onPress={startShake} style={styles.revealInteractArea}>
                <Animated.View style={[shakeStyle, styles.giftBoxWrapper]}>
                  <Image source={require('../assets/giftbox.png')} style={styles.giftBoxImage} />
                </Animated.View>
                <Text style={styles.revealInteractText}>
                  {revealStep === 'shaking' ? '깨어나는 중...' : '선물이 도착했어요!\n톡! 눌러서 확인해보세요'}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.revealSuccessContainer}>
                <Text style={styles.revealSuccessTitle}>새로운 친구 등장!</Text>

                <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], marginVertical: 20 }}>
                  <Image
                    source={getRevealImage(currentRevealAnimal!)}
                    style={styles.revealAnimalImage}
                  />
                </Animated.View>

                <Text style={styles.revealSuccessText}>
                  새로운 친구 {ANIMAL_NAMES[currentRevealAnimal!] || currentRevealAnimal}이 정원에 합류했습니다!
                </Text>

                <TouchableOpacity
                  style={[styles.revealConfirmButton, { backgroundColor: COLORS.primary }]}
                  onPress={handleConfirmReveal}
                >
                  <Text style={styles.revealConfirmButtonText}>정원 가기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  streakBadge: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
  },
  badgeIcon: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  gardenArea: {
    flex: 1,
    position: 'relative',
  },
  mushroomDeco: {
    fontSize: 14,
    position: 'absolute',
    opacity: 0.7,
  },
  animalNode: {
    position: 'absolute',
    alignItems: 'center',
  },
  animalLevel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
    opacity: 0.9,
  },
  emojiWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalEmoji: {
    fontSize: 48,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  sheetHeaderZone: {
    paddingTop: 4,
    paddingBottom: 10,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sheetProgress: {
    fontSize: 14,
    fontWeight: '700',
  },
  missionScroll: {
    maxHeight: 280,
  },
  missionRow: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  missionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  missionTitleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  missionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '700',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelUpDialog: {
    width: '80%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  levelUpStars: {
    marginBottom: 4,
  },
  levelUpBadge: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  levelUpTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  levelUpProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  levelNewBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelUpMessage: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  levelUpCloseBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  levelUpCloseBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalInnerContainer: {
    gap: 12,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  modalOptionsCard: {
    borderRadius: 24,
    overflow: 'hidden',
    paddingVertical: 8,
    borderWidth: 1,
  },
  modalTitleText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 12,
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  modalIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextGroup: {
    flex: 1,
    gap: 2,
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalOptionDesc: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalDivider: {
    height: 1,
  },
  modalCancelCard: {
    height: 54,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '800',
  },
  frogContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frog: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  revealModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealModalContainer: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  revealInteractArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  giftBoxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealInteractText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    color: '#1C2E21',
  },
  revealSuccessContainer: {
    alignItems: 'center',
    width: '100%',
  },
  revealSuccessTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2E5E35',
  },
  revealAnimalImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  revealSuccessText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    color: '#1C2E21',
    marginVertical: 15,
  },
  revealConfirmButton: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  revealConfirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  giftBoxImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
});
