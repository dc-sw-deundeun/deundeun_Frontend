import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Sparkles, Plus, Camera, Smartphone, Award, Trophy, Info, Search } from 'lucide-react-native';

// Type definition for local screen navigation props
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
  desc: string;
  points: number;
  completed: boolean;
  category: string;
}

interface AnimalCharacter {
  id: number;
  emoji: string;
  name: string;
  level: number;
  posX: number;
  posY: number;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Streak & Points State
  const [streakDays, setStreakDays] = useState(27);
  const [totalPoints, setTotalPoints] = useState(4856);

  // Character list in the garden
  const [characters, setCharacters] = useState<AnimalCharacter[]>([
    { id: 1, emoji: '🐯', name: '호랑이', level: 40, posX: 30, posY: 30 },
    { id: 2, emoji: '🐼', name: '판다', level: 33, posX: 140, posY: 110 },
    { id: 3, emoji: '🐰', name: '토끼', level: 18, posX: 230, posY: 20 },
    { id: 4, emoji: '🐹', name: '햄스터', level: 17, posX: 60, posY: 140 },
    { id: 5, emoji: '🐱', name: '고양이', level: 40, posX: 260, posY: 130 },
  ]);

  // Today's Missions
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: '아침 30분 걷기', desc: '유산소로 혈당 낮추기', points: 10, completed: false, category: 'cardio' },
    { id: 2, title: '잡곡밥 · 채소 먼저', desc: '식이섬유 챙기기', points: 10, completed: false, category: 'diet' },
    { id: 3, title: '물 자주 마시기', desc: '하루 8잔', points: 5, completed: false, category: 'water' },
  ]);

  // Modals & Bottom Sheets state
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isAuthSheetVisible, setIsAuthSheetVisible] = useState(false);
  const [isLevelUpVisible, setIsLevelUpVisible] = useState(false);
  const [isRecordSheetVisible, setIsRecordSheetVisible] = useState(false);
  const [levelUpAnimal, setLevelUpAnimal] = useState<string>('고양이');

  const completedMissionsCount = missions.filter((m) => m.completed).length;

  const handleMissionPress = (mission: Mission) => {
    if (mission.completed) return;
    setSelectedMission(mission);
    setIsAuthSheetVisible(true);
  };

  const handleVerifyMission = (type: 'photo' | 'auto') => {
    if (!selectedMission) return;

    // Simulate completion
    const updatedMissions = missions.map((m) => {
      if (m.id === selectedMission.id) {
        return { ...m, completed: true };
      }
      return m;
    });

    setMissions(updatedMissions);
    setTotalPoints((prev) => prev + selectedMission.points);
    setIsAuthSheetVisible(false);

    // If this triggers all missions completed, show Level Up celebration modal
    const nextCompletedCount = updatedMissions.filter((m) => m.completed).length;
    if (nextCompletedCount === missions.length) {
      setTimeout(() => {
        // Upgrade one of the characters
        setCharacters((prev) =>
          prev.map((c) => (c.name === '고양이' ? { ...c, level: c.level + 1 } : c))
        );
        setLevelUpAnimal('고양이');
        setIsLevelUpVisible(true);
      }, 800);
    }
  };

  // Add Health Record Action Sheet triggers
  const handleAddRecordSelect = (action: 'camera' | 'manual' | 'gallery') => {
    setIsRecordSheetVisible(false);
    if (action === 'manual') {
      navigation.navigate('EditResults');
    } else {
      Alert.alert('건강검진 스캔', '검진 결과지를 촬영하거나 갤러리에서 불러오기 데모입니다.', [
        { text: '확인하고 가짜 데이터 입력', onPress: () => navigation.navigate('EditResults') }
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.logoText, { color: COLORS.primary }]}>든든</Text>
          <Text style={[styles.headerSlogan, { color: theme.textMuted }]}>우리 정원 · 함께 자라는 중</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchBrowse')} style={styles.headerIconBtn}>
            <Search color={theme.text} size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.headerIconBtn}>
            <View style={styles.notifBadge} />
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDarkMode} style={styles.headerIconBtn}>
            <Text style={{ fontSize: 18 }}>{isDarkMode ? '🌞' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Streak & Points Widgets */}
        <View style={styles.widgetsRow}>
          <View style={[styles.widgetCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Flame color={COLORS.warning} size={20} fill={COLORS.warning} />
            <View>
              <Text style={[styles.widgetValue, { color: theme.text }]}>{streakDays}일 연속</Text>
              <Text style={[styles.widgetLabel, { color: theme.textMuted }]}>꾸준히 기록 중</Text>
            </View>
          </View>

          <View style={[styles.widgetCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Sparkles color={COLORS.primary} size={20} fill={COLORS.primaryLight} />
            <View>
              <Text style={[styles.widgetValue, { color: theme.text }]}>{totalPoints.toLocaleString()} XP</Text>
              <Text style={[styles.widgetLabel, { color: theme.textMuted }]}>모은 든든 포인트</Text>
            </View>
          </View>
        </View>

        {/* 3D-Like Garden View */}
        <View style={[styles.gardenContainer, { borderColor: theme.border }]}>
          {/* Grassy Background Green Gradient Mock */}
          <View style={[styles.gardenCanvas, { backgroundColor: isDarkMode ? '#132819' : '#E8F5E9' }]}>
            {/* Visual Trees & Grass details */}
            <Text style={[styles.decoElement, { top: 20, left: 100 }]}>🌲</Text>
            <Text style={[styles.decoElement, { top: 120, left: 200 }]}>🌳</Text>
            <Text style={[styles.decoElement, { top: 70, left: 15 }]}>🌻</Text>
            <Text style={[styles.decoElement, { top: 150, left: 80 }]}>🌸</Text>

            {/* Animal Characters */}
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
                <View style={[styles.animalAvatar, { backgroundColor: isDarkMode ? '#223F2A' : '#ffffff' }]}>
                  <Text style={styles.animalEmoji}>{char.emoji}</Text>
                  <View style={styles.animalLevelBadge}>
                    <Text style={styles.animalLevelText}>Lv {char.level}</Text>
                  </View>
                </View>
                <Text style={[styles.animalName, { color: theme.text }]}>{char.name}</Text>
              </View>
            ))}
          </View>

          {/* Floating Action Button inside Garden (to add results) */}
          <TouchableOpacity
            style={[styles.addRecordBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => setIsRecordSheetVisible(true)}
          >
            <Plus color="#ffffff" size={24} strokeWidth={2.5} />
            <Text style={styles.addRecordBtnText}>검진 결과 추가</Text>
          </TouchableOpacity>
        </View>

        {/* Missions Checklist Card */}
        <View style={[styles.missionsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.missionsHeader}>
            <View>
              <Text style={[styles.missionsTitle, { color: theme.text }]}>오늘의 미션</Text>
              <Text style={[styles.missionsSub, { color: theme.textMuted }]}>
                미션을 완료하면 든든이들이 성장해요!
              </Text>
            </View>
            <View style={[styles.missionsProgressBadge, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={[styles.missionsProgressText, { color: COLORS.primaryDark }]}>
                {completedMissionsCount} / {missions.length} 완료
              </Text>
            </View>
          </View>

          {/* Missions List */}
          <View style={styles.missionsList}>
            {missions.map((mission) => (
              <TouchableOpacity
                key={mission.id}
                style={[
                  styles.missionRow,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  },
                  mission.completed && { opacity: 0.6 }
                ]}
                onPress={() => handleMissionPress(mission)}
                disabled={mission.completed}
              >
                <View style={styles.missionLeft}>
                  <View
                    style={[
                      styles.missionCheckCircle,
                      { borderColor: mission.completed ? COLORS.primary : theme.textMuted },
                      mission.completed && { backgroundColor: COLORS.primary }
                    ]}
                  >
                    {mission.completed && <Text style={{ color: '#ffffff', fontSize: 10 }}>✓</Text>}
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.missionTitleText,
                        { color: theme.text },
                        mission.completed && styles.lineThrough
                      ]}
                    >
                      {mission.title}
                    </Text>
                    <Text style={[styles.missionDescText, { color: theme.textMuted }]}>
                      {mission.desc}
                    </Text>
                  </View>
                </View>

                <View style={styles.missionRight}>
                  <Text style={[styles.pointsText, { color: COLORS.primary }]}>
                    +{mission.points} XP
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 1. Mission Verification Bottom Sheet Modal */}
      <Modal
        visible={isAuthSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAuthSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>미션 인증하기</Text>
              <TouchableOpacity onPress={() => setIsAuthSheetVisible(false)}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>닫기</Text>
              </TouchableOpacity>
            </View>

            {selectedMission && (
              <View style={styles.authSheetBody}>
                <View style={[styles.selectedMissionCard, { backgroundColor: theme.background }]}>
                  <Text style={[styles.selectedMissionTitle, { color: theme.text }]}>
                    {selectedMission.title}
                  </Text>
                  <Text style={[styles.selectedMissionDesc, { color: theme.textMuted }]}>
                    {selectedMission.desc}
                  </Text>
                </View>

                <View style={styles.authOptions}>
                  {/* Photo Verification Option */}
                  <TouchableOpacity
                    style={[styles.authOptionBtn, { borderColor: theme.border }]}
                    onPress={() => handleVerifyMission('photo')}
                  >
                    <View style={[styles.authIconCircle, { backgroundColor: '#FFF3E0' }]}>
                      <Camera color="#EF6C00" size={24} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.authOptionTitle, { color: theme.text }]}>사진으로 인증하기</Text>
                      <Text style={[styles.authOptionSubtitle, { color: theme.textMuted }]}>
                        실천한 모습을 사진 촬영하여 기록을 남깁니다.
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Auto Sync Verification Option (e.g. Samsung Health) */}
                  {selectedMission.category === 'cardio' && (
                    <TouchableOpacity
                      style={[styles.authOptionBtn, { borderColor: theme.border }]}
                      onPress={() => handleVerifyMission('auto')}
                    >
                      <View style={[styles.authIconCircle, { backgroundColor: '#E8F5E9' }]}>
                        <Smartphone color="#2E7D32" size={24} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.authOptionTitle, { color: theme.text }]}>삼성 헬스로 인증하기</Text>
                        <Text style={[styles.authOptionSubtitle, { color: theme.textMuted }]}>
                          오늘 감지된 4,820걸음 데이터로 자동 인증합니다.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* 2. Record Addition Action Sheet */}
      <Modal
        visible={isRecordSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsRecordSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>무엇을 추가할까요?</Text>
              <TouchableOpacity onPress={() => setIsRecordSheetVisible(false)}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>취소</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionSheetList}>
              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() => handleAddRecordSelect('camera')}
              >
                <Text style={styles.actionSheetEmoji}>📸</Text>
                <View>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>검진 결과지 촬영</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    사진을 찍으면 인공지능이 수치를 자동 분석해요.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() => handleAddRecordSelect('manual')}
              >
                <Text style={styles.actionSheetEmoji}>✍️</Text>
                <View>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>직접 입력하기</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    수치를 손으로 직접 입력하여 기록할게요.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() => handleAddRecordSelect('gallery')}
              >
                <Text style={styles.actionSheetEmoji}>🖼️</Text>
                <View>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>이미지 불러오기</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    기기 갤러리에 저장된 결과지 사진을 불러옵니다.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. Level Up Celebration Modal */}
      <Modal
        visible={isLevelUpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLevelUpVisible(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={[styles.levelUpDialog, { backgroundColor: theme.card }]}>
            <View style={styles.levelUpStars}>
              <Trophy color={COLORS.warning} size={48} fill={COLORS.warning} />
            </View>

            <Text style={[styles.levelUpBadge, { color: COLORS.primary }]}>LEVEL UP! ✦</Text>
            <Text style={[styles.levelUpTitle, { color: theme.text }]}>
              {levelUpAnimal}이가 자랐어요!
            </Text>

            <View style={styles.levelUpProgressRow}>
              <View style={styles.levelOld}>
                <Text style={[styles.levelOldText, { color: theme.textMuted }]}>Lv 40</Text>
              </View>
              <Text style={{ fontSize: 20, color: COLORS.primary }}>➔</Text>
              <View style={[styles.levelNew, { backgroundColor: COLORS.primaryLight }]}>
                <Text style={[styles.levelNewText, { color: COLORS.primaryDark }]}>Lv 41</Text>
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
                setMissions(missions.map(m => ({ ...m, completed: false })));
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
    paddingHorizontal: SPACING.lg,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerLeft: {},
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSlogan: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerIconBtn: {
    padding: 6,
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
    zIndex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  widgetsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  widgetCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  widgetValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  widgetLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  gardenContainer: {
    height: 280,
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  gardenCanvas: {
    flex: 1,
    position: 'relative',
  },
  decoElement: {
    fontSize: 22,
    position: 'absolute',
    opacity: 0.3,
  },
  animalNode: {
    position: 'absolute',
    alignItems: 'center',
    width: 64,
  },
  animalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  animalEmoji: {
    fontSize: 32,
  },
  animalLevelBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  animalLevelText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
  },
  animalName: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  addRecordBtn: {
    position: 'absolute',
    bottom: SPACING.md,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addRecordBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  missionsCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: SPACING.lg,
  },
  missionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  missionsTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  missionsSub: {
    fontSize: 12,
    marginTop: 2,
  },
  missionsProgressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  missionsProgressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  missionsList: {
    gap: SPACING.sm,
  },
  missionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  missionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  missionCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionTitleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  missionDescText: {
    fontSize: 12,
    marginTop: 2,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  missionRight: {},
  pointsText: {
    fontSize: 13,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  authSheetBody: {
    gap: SPACING.md,
  },
  selectedMissionCard: {
    padding: SPACING.md,
    borderRadius: 16,
    gap: 4,
  },
  selectedMissionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  selectedMissionDesc: {
    fontSize: 13,
  },
  authOptions: {
    gap: SPACING.sm,
  },
  authOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  authIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  authOptionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  actionSheetList: {
    gap: SPACING.md,
  },
  actionSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  actionSheetEmoji: {
    fontSize: 28,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionSheetDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  levelUpDialog: {
    width: '85%',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  levelUpStars: {
    marginBottom: SPACING.xs,
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
    gap: SPACING.md,
    marginVertical: SPACING.xs,
  },
  levelOld: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  levelOldText: {
    fontSize: 16,
    fontWeight: '700',
  },
  levelNew: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelNewText: {
    fontSize: 16,
    fontWeight: '800',
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
    marginTop: SPACING.sm,
  },
  levelUpCloseBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
