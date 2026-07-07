import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, PanResponder, Alert, Platform, Image, Pressable } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Check } from 'lucide-react-native';
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
  id: number;
  emoji: string;
  level: number | null; // null means no level tag displayed
  posX: number;
  posY: number;
}

interface CroakingFrogProps {
  gardenLayout: { width: number; height: number };
  initialX: number;
  initialY: number;
}

const CroakingFrog = ({ gardenLayout, initialX, initialY }: CroakingFrogProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const currentPosition = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });

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
    // 30 seconds in milliseconds = 30,000 ms
    const interval = setInterval(() => {
      setIsBlinking(true);
      // Blink for 500ms
      const timeout = setTimeout(() => {
        setIsBlinking(false);
      }, 500);
      return () => clearTimeout(timeout);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
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

        if (gardenLayout.width > 0 && gardenLayout.height > 0) {
          // Bounding constraint logic (container is 60x60)
          targetX = Math.max(0, Math.min(gardenLayout.width - 60, targetX + initialX)) - initialX;
          targetY = Math.max(0, Math.min(gardenLayout.height - 60, targetY + initialY)) - initialY;
        }

        const nextX = targetX - startPosition.current.x;
        const nextY = targetY - startPosition.current.y;

        pan.setValue({ x: nextX, y: nextY });
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        pan.flattenOffset();
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        pan.flattenOffset();
      },
    })
  ).current;

  const showActive = isHovered || isBlinking || isDragging;
  const imageSource = showActive
    ? require('../assets/animal/frog2.png')
    : require('../assets/animal/frog1.png');

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
        <Image
          source={imageSource}
          style={styles.frog}
        />
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

  // 홈 화면 데이터 로드
  const loadHomeData = async () => {
    try {
      setLoading(true);
      const res = await homeApi.getHome();
      if (res.success && res.data) {
        const { character, today_missions } = res.data;
        
        // 경험치 및 레벨 설정
        setTotalPoints(character.total_exp);
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

        // 보유 중인 캐릭터 동적 좌표 매핑
        const mappedCharacters = character.owned_animals.map((animal, idx) => {
          const coord = ANIMAL_COORDINATES[animal.animal_code] || { posX: 50 + (idx * 30), posY: 100 + (idx * 20), emoji: '🐾' };
          return {
            id: idx + 1,
            emoji: coord.emoji,
            level: idx === 0 ? character.level : null, // 주 캐릭터에만 레벨 노출
            posX: coord.posX,
            posY: coord.posY,
          };
        });
        setCharacters(mappedCharacters);
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
          {/* Flame streak badge */}
          <View style={styles.streakBadge}>
            <Text style={styles.badgeIcon}>🔥</Text>
            <Text style={styles.badgeText}>{streakDays}일</Text>
          </View>

          {/* Points badge */}
          <View style={[styles.pointsBadge, { backgroundColor: '#2E5E35' }]}>
            <Text style={styles.badgeIcon}>🌿</Text>
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
            {char.level !== null && (
              <Text style={[styles.animalLevel, { color: theme.textDark }]}>
                Lv {char.level}
              </Text>
            )}
            <View style={styles.emojiWrapper}>
              {char.emoji === '🐸' ? (
                <CroakingFrog
                  gardenLayout={gardenLayout}
                  initialX={char.posX}
                  initialY={char.posY}
                />
              ) : (
                <Text style={styles.animalEmoji}>{char.emoji}</Text>
              )}
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
});
