import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { characterApi, CharacterMeResponse, AnimalCatalogItem } from '@/api';

// 성장 기록(캐릭터 레벨/경험치, 동물 도감) 데이터를 로드하는 훅
export const useGrowthData = () => {
  const [loading, setLoading] = useState(true);
  const [characterInfo, setCharacterInfo] = useState<CharacterMeResponse | null>(null);
  const [animalsCatalog, setAnimalsCatalog] = useState<AnimalCatalogItem[]>([]);

  // API 데이터 로드
  const loadGrowthData = useCallback(async () => {
    try {
      setLoading(true);
      const [charRes, catalogRes] = await Promise.all([
        characterApi.getMyCharacter(),
        characterApi.getAnimalsCatalog(),
      ]);

      if (charRes.success && charRes.data) {
        setCharacterInfo(charRes.data);
      }
      if (catalogRes.success && catalogRes.data) {
        setAnimalsCatalog(catalogRes.data.animals);
      }
    } catch (error) {
      console.error('성장 기록 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면 포커스 시 실시간 성장 기록 갱신
  useFocusEffect(
    useCallback(() => {
      loadGrowthData();
    }, [loadGrowthData])
  );

  return { loading, characterInfo, animalsCatalog };
};

export default useGrowthData;
