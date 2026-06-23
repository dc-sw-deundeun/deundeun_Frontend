import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Check } from 'lucide-react-native';

// Navigation types
import { CompositeScreenProps } from '@react-navigation/native';
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

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { isDarkMode } = useAppStore();
  
  // Custom theme variables for the new design (soft pasture theme)
  const theme = {
    background: '#A6D7A8', // Pastel grass green
    cardBg: '#F5F4EE',    // Cream off-white card background
    textDark: '#1C2E21',  // Deep forest dark green text
    textMuted: '#7A8C7C', // Muted sage text
    border: '#E2E1D8',
  };

  // Streak & Points State
  const [streakDays, setStreakDays] = useState(27);
  const [totalPoints, setTotalPoints] = useState(240);

  // Today's Missions
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: '아침 30분 걷기', points: 10, completed: false, emoji: '🚶' },
    { id: 2, title: '잡곡밥 · 채소 먼저', points: 10, completed: false, emoji: '🥗' },
    { id: 3, title: '물 자주 마시기', points: 5, completed: false, emoji: '💧' },
  ]);

  // Floating animal characters positioning
  const [characters] = useState<AnimalCharacter[]>([
    { id: 1, emoji: '🐸', level: null, posX: 50, posY: 110 },
    { id: 2, emoji: '🐱', level: 40, posX: 260, posY: 90 },
    { id: 3, emoji: '🐻', level: 33, posX: 140, posY: 170 },
    { id: 4, emoji: '🐥', level: 35, posX: 60, posY: 220 },
    { id: 5, emoji: '🐶', level: 18, posX: 260, posY: 200 },
    { id: 6, emoji: '🐧', level: null, posX: 190, posY: 240 },
  ]);

  // Level Up Modal states
  const [isLevelUpVisible, setIsLevelUpVisible] = useState(false);
  const [levelUpAnimal, setLevelUpAnimal] = useState<string>('곰');

  const completedCount = missions.filter((m) => m.completed).length;

  const handleToggleMission = (id: number) => {
    const updatedMissions = missions.map((m) => {
      if (m.id === id) {
        const nextState = !m.completed;
        // Adjust points based on toggle
        setTotalPoints((prev) => (nextState ? prev + m.points : prev - m.points));
        return { ...m, completed: nextState };
      }
      return m;
    });

    setMissions(updatedMissions);

    // If all completed, trigger level up pop-up
    const nextCompletedCount = updatedMissions.filter((m) => m.completed).length;
    if (nextCompletedCount === missions.length) {
      setTimeout(() => {
        setLevelUpAnimal('곰');
        setIsLevelUpVisible(true);
      }, 600);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sproutEmoji}>🌱</Text>
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
      <View style={styles.gardenArea}>
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
              <Text style={styles.animalEmoji}>{char.emoji}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Sheet Card */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.cardBg }]}>
        {/* Drag handle line indicator */}
        <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />

        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: theme.textDark }]}>오늘의 미션</Text>
          <Text style={[styles.sheetProgress, { color: theme.textMuted }]}>
            {completedCount}/{missions.length}
          </Text>
        </View>

        {/* Mission Rows */}
        <ScrollView style={styles.missionScroll} showsVerticalScrollIndicator={false}>
          {missions.map((mission) => (
            <TouchableOpacity
              key={mission.id}
              style={[styles.missionRow, { borderColor: theme.border }]}
              onPress={() => handleToggleMission(mission.id)}
              activeOpacity={0.7}
            >
              <View style={styles.missionLeft}>
                {/* Icon wrapper circular background */}
                <View style={[styles.iconWrapper, { backgroundColor: '#E4F2E6' }]}>
                  <Text style={styles.iconEmoji}>{mission.emoji}</Text>
                </View>
                <Text
                  style={[
                    styles.missionTitleText,
                    { color: theme.textDark },
                    mission.completed && styles.lineThrough,
                  ]}
                >
                  {mission.title}
                </Text>
              </View>

              <View style={styles.missionRight}>
                <Text style={[styles.pointsText, { color: theme.textMuted }]}>
                  +{mission.points}
                </Text>

                {/* Checkbox indicator */}
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: '#D3D2CC' },
                    mission.completed && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                  ]}
                >
                  {mission.completed && <Check color="#ffffff" size={14} strokeWidth={3} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
  sproutEmoji: {
    fontSize: 22,
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
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
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
});
