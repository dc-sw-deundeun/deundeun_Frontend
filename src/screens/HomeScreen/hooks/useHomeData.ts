import { useState } from 'react';
import React from 'react';
import { Alert } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { useFocusEffect } from '@react-navigation/native';
import { homeApi, missionApi } from '@/api';
import { Mission, AnimalCharacter } from '../types';
import { ANIMAL_COORDINATES } from '../constants';

// 홈 화면 데이터(포인트/레벨/미션/보유 동물) 조회 및 미션 인증을 담당하는 훅
export const useHomeData = (onNewUnlock: (newlyUnlocked: string[]) => void) => {
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
            onNewUnlock(newlyUnlocked);
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

  const completedCount = missions.filter((m) => m.completed).length;

  const handleToggleMission = (id: number) => {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;

    if (mission.completed) {
      useAppStore.getState().showAlert('알림', '이미 완료된 미션입니다.');
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
        useAppStore.getState().showAlert('미션 인증 완료', '미션 인증이 완료되어 포인트(XP)가 지급되었습니다!');

        // 홈 데이터 리로드하여 실시간으로 포인트 및 동물 성장 상태 반영
        await loadHomeData();
      } catch (error) {
        console.error('미션 완료 처리 실패:', error);
        useAppStore.getState().showAlert('오류', '미션 완료 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const closeLevelUpModal = () => {
    setIsLevelUpVisible(false);
    // Reset missions for replayability
    setMissions(missions.map((m) => ({ ...m, completed: false })));
  };

  return {
    totalPoints,
    missions,
    characters,
    isVerifyModalVisible,
    setIsVerifyModalVisible,
    isLevelUpVisible,
    setIsLevelUpVisible,
    levelUpAnimal,
    gardenLayout,
    setGardenLayout,
    completedCount,
    handleToggleMission,
    handleCompleteVerification,
    closeLevelUpModal,
  };
};

export default useHomeData;
